/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
import type { BulmaJS } from '@cityssm/bulma-js/types'

import type * as recordTypes from '../types/recordTypes'
declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  let callOutLists = exports.callOutLists as recordTypes.CallOutList[]
  delete exports.callOutLists

  const canUpdate = exports.callOutsCanUpdate as boolean
  const canManage = exports.callOutsCanManage as boolean

  const searchFilterElement = document.querySelector(
    '#callOuts--searchFilter'
  ) as HTMLInputElement

  const searchResultsElement = document.querySelector(
    '#callOuts--searchResults'
  ) as HTMLElement

  function renderCallOutLists(): void {
    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    const searchFilterPieces = searchFilterElement.value
      .trim()
      .toLowerCase()
      .split(' ')

    for (const callOutList of callOutLists) {
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

      const panelBlockElement = document.createElement('a')

      panelBlockElement.className = 'panel-block'
      panelBlockElement.dataset.listId = callOutList.listId.toString()
      panelBlockElement.href = '#'

      panelBlockElement.innerHTML = `<span class="panel-icon">
        <i class="fas fa-list-ol" aria-hidden="true"></i>
        </span>
        <div>
          <strong>${callOutList.listName}</strong><br />
          <span class="is-size-7">${callOutList.listDescription ?? ''}</span>
        </div>`

      panelBlockElement.addEventListener('click', openCallOutListByClick)

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

  function openCallOutList(listId: string): void {
    const callOutList = callOutLists.find((possibleCallOutList) => {
      return possibleCallOutList.listId === listId
    }) as recordTypes.CallOutList

    let callOutListModalElement: HTMLElement

    function doUpdateCallOutList(formEvent: SubmitEvent): void {
      formEvent.preventDefault()

      if (!canManage) {
        bulmaJS.alert({
          title: 'Access Denied',
          message: 'You do not have permission to update call out lists.',
          contextualColorName: 'danger'
        })

        return
      }

      cityssm.postJSON(
        MonTY.urlPrefix + '/attendance/doUpdateCallOutList',
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            callOutLists?: recordTypes.CallOutList[]
          }

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Call out list updated successfully.',
              contextualColorName: 'success'
            })
            ;(
              callOutListModalElement.querySelector(
                '.modal-card-title'
              ) as HTMLElement
            ).textContent = (
              callOutListModalElement.querySelector(
                '#callOutListEdit--listName'
              ) as HTMLInputElement
            ).value

            callOutLists = responseJSON.callOutLists!
            renderCallOutLists()
          } else {
            bulmaJS.alert({
              title: 'Error Updating Call Out List',
              message: 'Please try again.',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    cityssm.openHtmlModal('callOuts-list', {
      onshow(modalElement) {
        callOutListModalElement = modalElement
        ;(
          modalElement.querySelector('.modal-card-title') as HTMLElement
        ).textContent = callOutList.listName

        if (canManage) {
          modalElement
            .querySelector(".menu a[href$='tab--callOuts-memberManagement']")
            ?.closest('li')
            ?.classList.remove('is-hidden')
        }

        // List Details form
        ;(
          modalElement.querySelector(
            '#callOutListEdit--listId'
          ) as HTMLInputElement
        ).value = callOutList.listId
        ;(
          modalElement.querySelector(
            '#callOutListEdit--listName'
          ) as HTMLInputElement
        ).value = callOutList.listName
        ;(
          modalElement.querySelector(
            '#callOutListEdit--listDescription'
          ) as HTMLTextAreaElement
        ).value = callOutList.listDescription ?? ''

        // Eligibility Function

        let eligibilityFunctionFound = false
        const eligibilityFunctionElement = modalElement.querySelector(
          '#callOutListEdit--eligibilityFunction'
        ) as HTMLSelectElement

        for (const eligibilityFunctionName of exports.employeeEligibilityFunctionNames as string[]) {
          const optionElement = document.createElement('option')
          optionElement.value = eligibilityFunctionName
          optionElement.textContent = eligibilityFunctionName

          if (eligibilityFunctionName === callOutList.eligibilityFunction) {
            optionElement.selected = true
            eligibilityFunctionFound = true
          }

          eligibilityFunctionElement.append(optionElement)
        }

        if (
          !eligibilityFunctionFound &&
          (callOutList.eligibilityFunction ?? '') !== ''
        ) {
          const optionElement = document.createElement('option')
          optionElement.value = callOutList.eligibilityFunction!
          optionElement.textContent = callOutList.eligibilityFunction!
          optionElement.selected = true
          eligibilityFunctionElement.append(optionElement)
        }

        // Sort Key Function

        let sortKeyFunctionFound = false
        const sortKeyFunctionElement = modalElement.querySelector(
          '#callOutListEdit--sortKeyFunction'
        ) as HTMLSelectElement

        for (const sortKeyFunctionName of exports.employeeSortKeyFunctionNames as string[]) {
          const optionElement = document.createElement('option')
          optionElement.value = sortKeyFunctionName
          optionElement.textContent = sortKeyFunctionName

          if (sortKeyFunctionName === callOutList.sortKeyFunction) {
            optionElement.selected = true
            sortKeyFunctionFound = true
          }

          sortKeyFunctionElement.append(optionElement)
        }

        if (
          !sortKeyFunctionFound &&
          (callOutList.sortKeyFunction ?? '') !== ''
        ) {
          const optionElement = document.createElement('option')
          optionElement.value = callOutList.sortKeyFunction!
          optionElement.textContent = callOutList.sortKeyFunction!
          optionElement.selected = true
          sortKeyFunctionElement.append(optionElement)
        }

        if (canManage) {
          const unlockButtonsContainerElement = modalElement.querySelector(
            '#callOutListEdit--unlockButtons'
          ) as HTMLElement

          unlockButtonsContainerElement.classList.remove('is-hidden')

          unlockButtonsContainerElement
            .querySelector('button')
            ?.addEventListener('click', () => {
              unlockButtonsContainerElement.remove()

              modalElement
                .querySelector('#callOutListEdit--updateButtons')
                ?.classList.remove('is-hidden')

              const formElement = modalElement.querySelector(
                '#form--callOutListEdit'
              ) as HTMLFormElement

              formElement.addEventListener('submit', doUpdateCallOutList)

              formElement.querySelector('fieldset')!.disabled = false
            })
        }
      },
      onshown(modalElement, closeModalFunction) {
        MonTY.initializeMenuTabs(
          modalElement.querySelectorAll('.menu a'),
          modalElement.querySelectorAll('.tabs-container > article')
        )
      }
    })
  }

  function openCallOutListByClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()

    const listId = (clickEvent.currentTarget as HTMLAnchorElement).dataset
      .listId!

    openCallOutList(listId)
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
            listId: number
            callOutLists: recordTypes.CallOutList[]
          }

          callOutLists = responseJSON.callOutLists
          renderCallOutLists()

          createCloseModalFunction()
        }
      )
    }

    cityssm.openHtmlModal('callOuts-createList', {
      onshown(modalElement, closeModalFunction) {
        createCloseModalFunction = closeModalFunction

        modalElement
          .querySelector('#form--callOutListAdd')
          ?.addEventListener('submit', doCreate)
      }
    })
  })

  // Load Page

  renderCallOutLists()

  searchFilterElement.addEventListener('keyup', renderCallOutLists)
})()
