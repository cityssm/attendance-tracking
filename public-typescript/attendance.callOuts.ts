/* eslint-disable unicorn/prefer-string-replace-all */
/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

import type * as globalTypes from '../types/globalTypes'
import type * as recordTypes from '../types/recordTypes'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  const searchFilterElement = document.querySelector(
    '#callOuts--searchFilter'
  ) as HTMLInputElement

  const searchResultsElement = document.querySelector(
    '#callOuts--searchResults'
  ) as HTMLElement

  function toggleCallOutListFavourite(clickEvent: Event): void {
    const buttonElement = clickEvent.currentTarget as HTMLButtonElement

    const oldIsFavourite = buttonElement.dataset.isFavourite === '1'

    const panelBlockElement = buttonElement.closest(
      '.panel-block'
    ) as HTMLElement

    const listId = panelBlockElement.dataset.listId

    cityssm.postJSON(
      MonTY.urlPrefix +
        (oldIsFavourite
          ? '/attendance/doRemoveFavouriteCallOutList'
          : '/attendance/doAddFavouriteCallOutList'),
      { listId },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          callOutLists: recordTypes.CallOutList[]
        }

        MonTY.callOuts!.callOutLists = responseJSON.callOutLists

        renderCallOutLists()
      }
    )
  }

  function renderCallOutLists(): void {
    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    const searchFilterPieces = searchFilterElement.value
      .trim()
      .toLowerCase()
      .split(' ')

    for (const callOutList of MonTY.callOuts!.callOutLists) {
      let showList = true

      const listStringToSearch = (
        callOutList.listName +
        ' ' +
        (callOutList.listDescription ?? '')
      ).toLowerCase()

      for (const searchFilterPiece of searchFilterPieces) {
        if (!listStringToSearch.includes(searchFilterPiece)) {
          showList = false
          break
        }
      }

      if (!showList) {
        continue
      }

      const panelBlockElement = document.createElement('div')

      panelBlockElement.className = 'panel-block is-block'
      panelBlockElement.dataset.listId = callOutList.listId.toString()

      panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <button class="button is-white" data-is-favourite="${
            callOutList.isFavourite! ? '1' : '0'
          }" data-tooltip="Toggle Favourite" type="button">
            ${
              callOutList.isFavourite!
                ? '<i class="fas fa-star" aria-label="Favourite"></i>'
                : '<i class="far fa-star" aria-label="Not Favourite"></i>'
            }
          </button>
        </div>
        <div class="column">
          <a class="is-block" href="#">
          <strong>${callOutList.listName}</strong><br />
            <span class="is-size-7">${(
              callOutList.listDescription ?? ''
            ).replace(/\n/g, '<br />')}</span>
          </a>
        </div>
        <div class="column is-narrow">
          <span class="tag" data-tooltip="Members">
            <span class="icon is-small"><i class="fas fa-hard-hat" aria-hidden="true"></i></span>
            <span>${callOutList.callOutListMembersCount ?? ''}</span>
          </span>
        </div>
        </div>`

      panelBlockElement
        .querySelector('button')
        ?.addEventListener('click', toggleCallOutListFavourite)

      panelBlockElement
        .querySelector('a')
        ?.addEventListener('click', openCallOutListByClick)

      panelElement.append(panelBlockElement)
    }

    if (panelElement.hasChildNodes()) {
      searchResultsElement.innerHTML = ''
      searchResultsElement.append(panelElement)
    } else {
      searchResultsElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no call out lists that meet your search criteria.</p>
        </div>`
    }
  }

  function openCallOutListByClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()

    const listId = (
      (clickEvent.currentTarget as HTMLAnchorElement).closest(
        '.panel-block'
      ) as HTMLElement
    ).dataset.listId!

    MonTY.callOuts?.openCallOutList(listId, renderCallOutLists)
  }

  document.querySelector('#callOuts--create')?.addEventListener('click', () => {
    let createCloseModalFunction: () => void

    function doCreate(formEvent: Event): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        MonTY.urlPrefix + '/attendance/doCreateCallOutList',
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            listId: string
            callOutLists: recordTypes.CallOutList[]
          }

          MonTY.callOuts!.callOutLists = responseJSON.callOutLists
          renderCallOutLists()

          MonTY.callOuts?.openCallOutList(responseJSON.listId)

          createCloseModalFunction()
        }
      )
    }

    cityssm.openHtmlModal('callOuts-createList', {
      onshown(modalElement, closeModalFunction) {
        createCloseModalFunction = closeModalFunction
        bulmaJS.toggleHtmlClipped()
        ;(
          modalElement.querySelector(
            '#callOutListAdd--listName'
          ) as HTMLInputElement
        ).focus()

        modalElement
          .querySelector('#form--callOutListAdd')
          ?.addEventListener('submit', doCreate)
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  })

  // Load Page

  renderCallOutLists()

  searchFilterElement.addEventListener('keyup', renderCallOutLists)
})()
