// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

// eslint-disable-next-line n/no-missing-import
import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type {
  AttendCallOuts as AttendCallOutsGlobal,
  Attend as AttendGlobal
} from '../types/globalTypes.js'
import type { CallOutList } from '../types/recordTypes.js'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const Attend = exports.Attend as AttendGlobal
  const AttendCallOuts = Attend.callOuts as AttendCallOutsGlobal

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
      `${Attend.urlPrefix}/attendance/${
        oldIsFavourite
          ? 'doRemoveFavouriteCallOutList'
          : 'doAddFavouriteCallOutList'
      }`,
      { listId },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          callOutLists: CallOutList[]
        }

        if (responseJSON.success) {
          AttendCallOuts.callOutLists = responseJSON.callOutLists

          renderCallOutLists()
        } else {
          bulmaJS.alert({
            title: 'Error Updating Favourites',
            message: 'Please try again.'
          })
        }
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

    // eslint-disable-next-line no-labels
    callOutListLoop: for (const callOutList of AttendCallOuts.callOutLists) {
      const listStringToSearch = `${callOutList.listName} ${
        callOutList.listDescription ?? ''
      }`.toLowerCase()

      for (const searchFilterPiece of searchFilterPieces) {
        if (!listStringToSearch.includes(searchFilterPiece)) {
          // eslint-disable-next-line no-labels
          continue callOutListLoop
        }
      }

      const panelBlockElement = document.createElement('div')

      panelBlockElement.className = 'panel-block is-block'
      panelBlockElement.dataset.listId = callOutList.listId.toString()

      // eslint-disable-next-line unicorn/prefer-string-replace-all
      const listDescriptionHTML = (callOutList.listDescription ?? '').replace(
        /\n/g,
        '<br />'
      )

      panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <button class="button is-white" data-is-favourite="${
            (callOutList.isFavourite as boolean) ? '1' : '0'
          }" data-tooltip="Toggle Favourite" type="button" aria-label="Toggle Favourite">
            ${
              (callOutList.isFavourite as boolean)
                ? '<i class="fas fa-star" aria-hidden="true"></i><span class="is-sr-only">Favourite</span>'
                : '<i class="far fa-star" aria-hidden="true"></i><span class="is-sr-only">Not Favourite</span>'
            }
          </button>
        </div>
        <div class="column">
          <a class="is-block" href="#">
          <strong>${callOutList.listName}</strong><br />
            <span class="is-size-7">${listDescriptionHTML}</span>
          </a>
        </div>
        <div class="column is-narrow">
        ${
          callOutList.allowSelfSignUp ?? false
            ? `<span class="tag is-light is-info">
              <span class="icon is-small"><i class="fas fa-hand-paper" aria-hidden="true"></i></span>
              <span>Self Sign Up</span>
              </span>`
            : ''
        } 
          <span class="tag" data-tooltip="Members">
            <span class="icon is-small"><i class="fas fa-hard-hat" aria-hidden="true"></i></span>
            <span>${callOutList.callOutListMembersCount ?? ''}</span>
          </span>
        </div>
        </div>`

      panelBlockElement
        .querySelector('button')
        ?.addEventListener('click', toggleCallOutListFavourite)

      const listAnchorElement = panelBlockElement.querySelector(
        'a'
      ) as HTMLAnchorElement

      listAnchorElement.dataset.cy = callOutList.listName
      listAnchorElement.addEventListener('click', openCallOutListByClick)

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
    ).dataset.listId as string

    AttendCallOuts.openCallOutList(listId, renderCallOutLists)
  }

  document.querySelector('#callOuts--create')?.addEventListener('click', () => {
    let createCloseModalFunction: () => void

    function doCreate(formEvent: Event): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${Attend.urlPrefix}/attendance/doCreateCallOutList`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            listId: string
            callOutLists: CallOutList[]
          }

          AttendCallOuts.callOutLists = responseJSON.callOutLists
          renderCallOutLists()

          AttendCallOuts.openCallOutList(responseJSON.listId)

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
