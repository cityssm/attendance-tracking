/* eslint-disable unicorn/prefer-module */

import type { MonTY as MonTYGlobal } from '../types/globalTypes.js'
import type { CallOutList } from '../types/recordTypes.js'
;(() => {
  const MonTY = exports.MonTY as MonTYGlobal

  const callOutListContainerElement = document.querySelector(
    '#container--favouriteCallOutLists'
  )
  const callOutLists = (exports.callOutLists ?? []) as CallOutList[]

  function openCallOutListByClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()

    const listId = (clickEvent.currentTarget as HTMLAnchorElement).dataset
      .listId!

    MonTY.callOuts?.openCallOutList(listId)
  }

  if (callOutListContainerElement !== null) {
    for (const callOutList of callOutLists) {
      const panelBlockElement = document.createElement('a')

      panelBlockElement.className = 'panel-block'
      panelBlockElement.dataset.listId = callOutList.listId
      panelBlockElement.href = '#'

      panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow"><i class="fas fa-phone" aria-hidden="true"></i></div>
        <div class="column">${callOutList.listName}</div>
        </div>`

      panelBlockElement.addEventListener('click', openCallOutListByClick)

      callOutListContainerElement.append(panelBlockElement)
    }
  }
})()
