/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes.js'
import type * as recordTypes from '../types/recordTypes'
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  const callOutListContainerElement = document.querySelector(
    '#container--favouriteCallOutLists'
  )
  const callOutLists = (exports.callOutLists ?? []) as recordTypes.CallOutList[]

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

      panelBlockElement.textContent = callOutList.listName

      panelBlockElement.addEventListener('click', openCallOutListByClick)

      callOutListContainerElement.append(panelBlockElement)
    }
  }
})()
