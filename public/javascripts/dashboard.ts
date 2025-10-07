import type { Attend as AttendGlobal } from '../../types/globalTypes.js'
import type { CallOutList } from '../../types/recordTypes.js'
;(() => {
  const Attend = exports.Attend as AttendGlobal

  const callOutLists = (exports.callOutLists ?? []) as CallOutList[]

  function openCallOutListByClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()

    const listId = (clickEvent.currentTarget as HTMLAnchorElement).dataset
      .listId as string

    Attend.callOuts?.openCallOutList(listId)
  }

  const callOutListContainerElement = document.querySelector(
    '#container--favouriteCallOutLists'
  )

  if (callOutListContainerElement !== null) {
    let hasFavourites = false

    for (const callOutList of callOutLists) {
      if (!(callOutList.isFavourite ?? false)) {
        continue
      }

      hasFavourites = true

      const panelBlockElement = document.createElement('a')

      panelBlockElement.className = 'panel-block py-3'
      panelBlockElement.dataset.listId = callOutList.listId
      panelBlockElement.href = '#'

      panelBlockElement.innerHTML = `<span class="panel-icon"><i class="fas fa-phone" aria-hidden="true"></i></span>
        ${callOutList.listName}`

      panelBlockElement.addEventListener('click', openCallOutListByClick)

      callOutListContainerElement.append(panelBlockElement)
    }

    if (!hasFavourites) {
      callOutListContainerElement.insertAdjacentHTML(
        'beforeend',
        `<div class="panel-block is-block">
          <div class="message is-small is-info">
            <div class="message-body">
              <strong>You have no favourite call out lists.</strong><br />
              Add call out lists to your dashboard for quick access by marking them as favourites.
            </div>
          </div>
        </div>`
      )
    }
  }

  const absencesCallOutListElements = document.querySelectorAll(
    '#tab--attendance-absences a.is-call-out-list'
  )

  for (const listElement of absencesCallOutListElements) {
    ;(listElement as HTMLAnchorElement).addEventListener(
      'click',
      openCallOutListByClick
    )
  }

  document
    .querySelector('.panel a.is-panel-block-toggle')
    ?.addEventListener('click', Attend.togglePanelBlocks)
})()
