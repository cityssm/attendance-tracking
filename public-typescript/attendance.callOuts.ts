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

  const callOutResponseTypes =
    exports.callOutResponseTypes as recordTypes.CallOutResponseType[]
  delete exports.callOutResponseTypes

  const canUpdate = exports.callOutsCanUpdate as boolean
  const canManage = exports.callOutsCanManage as boolean

  const searchFilterElement = document.querySelector(
    '#callOuts--searchFilter'
  ) as HTMLInputElement

  const searchResultsElement = document.querySelector(
    '#callOuts--searchResults'
  ) as HTMLElement

  let currentListId = ''
  let currentCallOutListMembers: recordTypes.CallOutListMember[] = []

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

  function openCallOutListMember(employeeNumber: string): void {
    const callOutList = callOutLists.find((possibleCallOutList) => {
      return possibleCallOutList.listId === currentListId
    })!

    let callOutListMemberIndex = 0

    const callOutListMember = currentCallOutListMembers.find(
      (possibleMember, possibleIndex) => {
        if (possibleMember.employeeNumber === employeeNumber) {
          callOutListMemberIndex = possibleIndex
          return true
        }

        return false
      }
    )!

    let callOutMemberModalElement: HTMLElement

    let callOutRecords: recordTypes.CallOutRecord[]

    function addCallOutRecord(formEvent: SubmitEvent): void {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        MonTY.urlPrefix + '/attendance/doAddCallOutRecord',
        formElement,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            recordId: string
            callOutRecords: recordTypes.CallOutRecord[]
          }

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Call out recorded successfully.',
              contextualColorName: 'success'
            })

            formElement.reset()

            callOutRecords = responseJSON.callOutRecords
            renderCallOutRecords()
          }
        }
      )
    }

    function renderCallOutRecords(): void {
      // Tag Count

      callOutMemberModalElement.querySelector(
        '#tag--recentCalls'
      )!.textContent = callOutRecords.length.toString()

      // Data

      const callOutRecordsContainerElement =
        callOutMemberModalElement.querySelector(
          '#container--callOutRecords'
        ) as HTMLElement

      const callOutDateTimeMaxElement = callOutMemberModalElement.querySelector(
        '#callOutListMember--callOutDateTimeMax'
      ) as HTMLElement

      if (callOutRecords.length === 0) {
        callOutRecordsContainerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">There are no recent call outs to show.</p>
          </div>`

        callOutDateTimeMaxElement.textContent = '(No Recent Call Outs)'

        return
      }

      const panelElement = document.createElement('div')
      panelElement.className = 'panel'

      for (const [index, record] of callOutRecords.entries()) {
        const callOutDateTime = new Date(record.callOutDateTime)

        if (index === 0) {
          callOutDateTimeMaxElement.innerHTML = `${
            record.isSuccessful!
              ? '<i class="fas fa-fw fa-check has-text-success" aria-label="Yes"></i>'
              : '<i class="fas fa-fw fa-times has-text-danger" aria-label="No"></i>'
          }
            ${callOutDateTime.toLocaleDateString()} ${callOutDateTime.toLocaleTimeString()}`
        }

        const panelBlockElement = document.createElement('div')
        panelBlockElement.className = 'panel-block'

        panelBlockElement.classList.add(
          record.isSuccessful!
            ? 'has-background-success-light'
            : 'has-background-danger-light'
        )

        panelBlockElement.innerHTML = `<div class="columns">
          <div class="column is-narrow">
            ${
              record.isSuccessful!
                ? '<i class="fas fa-fw fa-check has-text-success" aria-label="Yes"></i>'
                : '<i class="fas fa-fw fa-times has-text-danger" aria-label="No"></i>'
            }
          </div>
          <div class="column">
            ${callOutDateTime.toLocaleDateString()} ${callOutDateTime.toLocaleTimeString()}<br />
            <span class="is-size-7">
              <strong>${record.responseType ?? '(No Response)'}</strong><br />
              ${record.recordComment ?? ''}
            </span>
          </div>
          </div>`

        panelElement.append(panelBlockElement)
      }

      callOutRecordsContainerElement.innerHTML = ''
      callOutRecordsContainerElement.append(panelElement)
    }

    cityssm.openHtmlModal('callOuts-member', {
      onshow(modalElement) {
        callOutMemberModalElement = modalElement

        const employeeName =
          callOutListMember.employeeSurname +
          ', ' +
          callOutListMember.employeeGivenName

        ;(
          modalElement.querySelector('.modal-card-title') as HTMLElement
        ).textContent = employeeName
        ;(
          modalElement.querySelector(
            '#callOutListMember--listName'
          ) as HTMLElement
        ).textContent = callOutList.listName
        ;(
          modalElement.querySelector(
            '#callOutListMember--employeeName'
          ) as HTMLElement
        ).textContent = employeeName
        ;(
          modalElement.querySelector(
            '#callOutListMember--employeeNumber'
          ) as HTMLElement
        ).textContent = callOutListMember.employeeNumber
        ;(
          modalElement.querySelector(
            '#callOutListMember--sortKey'
          ) as HTMLElement
        ).textContent = callOutListMember.sortKey ?? ''
        ;(
          modalElement.querySelector(
            '#callOutListMember--listPosition'
          ) as HTMLElement
        ).textContent = `${callOutListMemberIndex + 1} / ${
          currentCallOutListMembers.length
        }`

        if (canUpdate) {
          ;(
            modalElement.querySelector(
              '#callOutListMember--workContact1'
            ) as HTMLElement
          ).textContent = callOutListMember.workContact1 ?? ''
          ;(
            modalElement.querySelector(
              '#callOutListMember--workContact2'
            ) as HTMLElement
          ).textContent = callOutListMember.workContact2 ?? ''
          ;(
            modalElement.querySelector(
              '#callOutListMember--homeContact1'
            ) as HTMLElement
          ).textContent = callOutListMember.homeContact1 ?? ''
          ;(
            modalElement.querySelector(
              '#callOutListMember--homeContact2'
            ) as HTMLElement
          ).textContent = callOutListMember.homeContact2 ?? ''
        } else {
          modalElement
            .querySelector('a[href$="tab--callNow"]')
            ?.closest('li')
            ?.remove()
          modalElement.querySelector('#tab--callNow')?.remove()

          modalElement
            .querySelector('a[href$="tab--recentCalls"]')
            ?.closest('li')
            ?.classList.add('is-active')
          modalElement
            .querySelector('#tab--recentCalls')
            ?.classList.remove('is-hidden')
        }

        cityssm.postJSON(
          MonTY.urlPrefix + '/attendance/doGetCallOutRecords',
          {
            listId: callOutList.listId,
            employeeNumber
          },
          (rawResponseJSON) => {
            callOutRecords = (
              rawResponseJSON as { callOutRecords: recordTypes.CallOutRecord[] }
            ).callOutRecords

            renderCallOutRecords()
          }
        )
      },
      onshown(modalElement, closeModalFunction) {
        bulmaJS.toggleHtmlClipped()
        bulmaJS.init(modalElement)

        if (canUpdate) {
          ;(
            modalElement.querySelector(
              '#callOutRecordAdd--listId'
            ) as HTMLInputElement
          ).value = callOutList.listId
          ;(
            modalElement.querySelector(
              '#callOutRecordAdd--employeeNumber'
            ) as HTMLInputElement
          ).value = callOutListMember.employeeNumber

          const responseTypeElement = modalElement.querySelector(
            '#callOutRecordAdd--responseTypeId'
          ) as HTMLSelectElement

          for (const responseType of callOutResponseTypes) {
            const optionElement = document.createElement('option')
            optionElement.value = responseType.responseTypeId.toString()
            optionElement.textContent = responseType.responseType
            responseTypeElement.append(optionElement)
          }

          ;(
            modalElement.querySelector(
              '#form--callOutRecordAdd'
            ) as HTMLFormElement
          ).addEventListener('submit', addCallOutRecord)
        }

        const nextButtonElement = modalElement.querySelector(
          '#callOutListMember--next'
        ) as HTMLButtonElement

        if (callOutListMemberIndex + 1 === currentCallOutListMembers.length) {
          nextButtonElement.disabled = true
        } else {
          nextButtonElement.addEventListener('click', () => {
            const nextEmployeeNumber =
              currentCallOutListMembers[callOutListMemberIndex + 1]
                .employeeNumber
            closeModalFunction()
            openCallOutListMember(nextEmployeeNumber)
          })
        }

        const previousButtonElement = modalElement.querySelector(
          '#callOutListMember--previous'
        ) as HTMLButtonElement

        if (callOutListMemberIndex === 0) {
          previousButtonElement.disabled = true
        } else {
          previousButtonElement.addEventListener('click', () => {
            const previousEmployeeNumber =
              currentCallOutListMembers[callOutListMemberIndex - 1]
                .employeeNumber
            closeModalFunction()
            openCallOutListMember(previousEmployeeNumber)
          })
        }
      },
      onhidden() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  function openCallOutListMemberByClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()

    const anchorElement = clickEvent.currentTarget as HTMLAnchorElement

    const employeeNumber = anchorElement.dataset.employeeNumber!

    openCallOutListMember(employeeNumber)
  }

  function openCallOutList(listId: string): void {
    currentListId = listId
    currentCallOutListMembers = []

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

      const submitButtonElement = (
        formEvent.currentTarget as HTMLFormElement
      ).querySelector('button[type="submit"]') as HTMLButtonElement
      submitButtonElement.disabled = true
      submitButtonElement.classList.add('is-loading')

      cityssm.postJSON(
        MonTY.urlPrefix + '/attendance/doUpdateCallOutList',
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            callOutLists?: recordTypes.CallOutList[]
            callOutListMembers?: recordTypes.CallOutListMember[]
            availableEmployees?: recordTypes.Employee[]
          }

          submitButtonElement.disabled = false
          submitButtonElement.classList.remove('is-loading')

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

            currentCallOutListMembers = responseJSON.callOutListMembers!
            availableEmployees = responseJSON.availableEmployees!
            renderCallOutListMembers()
            renderAvailableEmployees()

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

    function initializeListDetailsTab(): void {
      ;(
        callOutListModalElement.querySelector(
          '#callOutListEdit--listId'
        ) as HTMLInputElement
      ).value = callOutList.listId
      ;(
        callOutListModalElement.querySelector(
          '#callOutListEdit--listName'
        ) as HTMLInputElement
      ).value = callOutList.listName
      ;(
        callOutListModalElement.querySelector(
          '#callOutListEdit--listDescription'
        ) as HTMLTextAreaElement
      ).value = callOutList.listDescription ?? ''

      // Eligibility Function

      let eligibilityFunctionFound = false
      const eligibilityFunctionElement = callOutListModalElement.querySelector(
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
      const sortKeyFunctionElement = callOutListModalElement.querySelector(
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

      if (!sortKeyFunctionFound && (callOutList.sortKeyFunction ?? '') !== '') {
        const optionElement = document.createElement('option')
        optionElement.value = callOutList.sortKeyFunction!
        optionElement.textContent = callOutList.sortKeyFunction!
        optionElement.selected = true
        sortKeyFunctionElement.append(optionElement)
      }

      ;(
        callOutListModalElement.querySelector(
          '#callOutListEdit--employeePropertyName'
        ) as HTMLInputElement
      ).value = callOutList.employeePropertyName ?? ''

      if (canManage) {
        const unlockButtonsContainerElement =
          callOutListModalElement.querySelector(
            '#callOutListEdit--unlockButtons'
          ) as HTMLElement

        unlockButtonsContainerElement.classList.remove('is-hidden')

        unlockButtonsContainerElement
          .querySelector('button')
          ?.addEventListener('click', () => {
            unlockButtonsContainerElement.remove()

            callOutListModalElement
              .querySelector('#callOutListEdit--updateButtons')
              ?.classList.remove('is-hidden')

            const formElement = callOutListModalElement.querySelector(
              '#form--callOutListEdit'
            ) as HTMLFormElement

            formElement.addEventListener('submit', doUpdateCallOutList)

            formElement.querySelector('fieldset')!.disabled = false
          })
      }
    }

    let callOutListMemberEmployeeNumbers: string[] = []
    let availableEmployees: recordTypes.Employee[] = []

    function addCallOutListMember(clickEvent: MouseEvent): void {
      clickEvent.preventDefault()

      const employeeNumber = (clickEvent.currentTarget as HTMLAnchorElement)
        .dataset.employeeNumber

      cityssm.postJSON(
        MonTY.urlPrefix + '/attendance/doAddCallOutListMember',
        {
          listId: callOutList.listId,
          employeeNumber
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            callOutListMembers?: recordTypes.CallOutListMember[]
          }

          if (responseJSON.success) {
            currentCallOutListMembers = responseJSON.callOutListMembers!
            renderCallOutListMembers()
            renderAvailableEmployees()
          } else {
            bulmaJS.alert({
              title: 'Error Adding Member',
              message: 'Please try again.',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    function deleteCallOutListMember(clickEvent: MouseEvent): void {
      clickEvent.preventDefault()

      const employeeNumber = (clickEvent.currentTarget as HTMLAnchorElement)
        .dataset.employeeNumber!

      function doDelete(): void {
        cityssm.postJSON(
          MonTY.urlPrefix + '/attendance/doDeleteCallOutListMember',
          {
            listId: callOutList.listId,
            employeeNumber
          },
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              success: boolean
              callOutListMembers?: recordTypes.CallOutListMember[]
            }

            if (responseJSON.success) {
              currentCallOutListMembers = responseJSON.callOutListMembers!
              renderCallOutListMembers()
              renderAvailableEmployees()
            } else {
              bulmaJS.alert({
                title: 'Error Removing Member',
                message: 'Please try again.',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Remove Employee from Call Out List',
        message: `Are you sure you want to remove employee ${employeeNumber} from the list?`,
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Remove Them',
          callbackFunction: doDelete
        }
      })
    }

    function renderAvailableEmployees(): void {
      if (!canManage) {
        return
      }

      const availableEmployeesContainer = callOutListModalElement.querySelector(
        '#container--callOutListAvailableEmployees'
      ) as HTMLElement

      const panelElement = document.createElement('div')
      panelElement.className = 'panel'

      for (const employee of availableEmployees) {
        // employee already in the list
        if (
          callOutListMemberEmployeeNumbers.includes(employee.employeeNumber)
        ) {
          continue
        }

        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block'
        panelBlockElement.href = '#'
        panelBlockElement.dataset.employeeNumber = employee.employeeNumber

        panelBlockElement.innerHTML = `<span class="panel-icon">
          <i class="fas fa-plus" aria-hidden="true"></i>
          </span>
          <div>
            <strong>${employee.employeeSurname}, ${
          employee.employeeGivenName
        }</strong><br />
            <span class="is-size-7">${employee.jobTitle ?? ''}</span>
          </div>`

        panelBlockElement.addEventListener('click', addCallOutListMember)

        panelElement.append(panelBlockElement)
      }

      if (panelElement.hasChildNodes()) {
        availableEmployeesContainer.innerHTML = ''
        availableEmployeesContainer.append(panelElement)
      } else {
        availableEmployeesContainer.innerHTML = `<div class="message is-info is-small">
            <p class="message-body">There are no employees available to add.</p>
          </div>`
      }
    }

    function renderCallOutListMembers(): void {
      const callOutListMembersContainer = callOutListModalElement.querySelector(
        '#container--callOutListMembers'
      ) as HTMLElement

      const callOutListCurrentMembersContainer =
        callOutListModalElement.querySelector(
          '#container--callOutListCurrentMembers'
        ) as HTMLElement

      callOutListMemberEmployeeNumbers = []

      if (currentCallOutListMembers.length === 0) {
        callOutListMembersContainer.innerHTML = `<div class="message is-warning">
            <p class="message-body">The "${callOutList.listName}" call out list does not include any active employees.</p>
          </div>`

        callOutListCurrentMembersContainer.innerHTML = `<div class="message is-warning is-small">
            <p class="message-body">No active employees.</p>
          </div>`

        return
      }

      const panelElement = document.createElement('div')
      panelElement.className = 'panel'

      let currentPanelElement: HTMLElement

      if (canManage) {
        currentPanelElement = document.createElement('div')
        currentPanelElement.className = 'panel'
      }

      for (const member of currentCallOutListMembers) {
        // Member List

        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.href = '#'
        panelBlockElement.dataset.employeeNumber = member.employeeNumber

        panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow">
            <i class="fas fa-user" aria-hidden="true"></i>
          </div>
          <div class="column">
            <strong>${member.employeeSurname}, ${
          member.employeeGivenName
        }</strong><br />
            <span class="is-size-7">${member.employeeNumber}</span>
          </div>
          <div class="column">
            <span class="is-size-7 has-tooltip-left" data-tooltip="Sort Key">
              <i class="fas fa-sort-alpha-down" aria-hidden="true"></i> ${
                member.sortKey ?? ''
              }
            </span>
          </div>
          </div>`

        panelBlockElement.addEventListener(
          'click',
          openCallOutListMemberByClick
        )

        panelElement.append(panelBlockElement)

        // Current Members (Management)

        if (!canManage) {
          continue
        }

        // Track employee number
        callOutListMemberEmployeeNumbers.push(member.employeeNumber)

        const currentPanelBlockElement = document.createElement('a')
        currentPanelBlockElement.className = 'panel-block'
        currentPanelBlockElement.href = '#'
        currentPanelBlockElement.dataset.employeeNumber = member.employeeNumber

        currentPanelBlockElement.innerHTML = `<span class="panel-icon">
          <i class="fas fa-minus" aria-hidden="true"></i>
          </span>
          <div>
            <strong>${member.employeeSurname}, ${member.employeeGivenName}</strong>
          </div>`

        currentPanelBlockElement.addEventListener(
          'click',
          deleteCallOutListMember
        )

        currentPanelElement!.append(currentPanelBlockElement)
      }

      callOutListMembersContainer.innerHTML = ''
      callOutListMembersContainer.append(panelElement)

      if (canManage) {
        callOutListCurrentMembersContainer.innerHTML = ''
        callOutListCurrentMembersContainer.append(currentPanelElement!)
      }
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

        // List Details
        initializeListDetailsTab()

        // Members

        cityssm.postJSON(
          MonTY.urlPrefix + '/attendance/doGetCallOutListMembers',
          {
            listId: callOutList.listId,
            includeAvailableEmployees: canManage
          },
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              callOutListMembers: recordTypes.CallOutListMember[]
              availableEmployees: recordTypes.Employee[]
            }

            currentCallOutListMembers = responseJSON.callOutListMembers
            availableEmployees = responseJSON.availableEmployees

            renderCallOutListMembers()
            renderAvailableEmployees()
          }
        )
      },
      onshown(modalElement, closeModalFunction) {
        bulmaJS.toggleHtmlClipped()

        MonTY.initializeMenuTabs(
          modalElement.querySelectorAll('.menu a'),
          modalElement.querySelectorAll('.tabs-container > article')
        )

        cityssm.enableNavBlocker()
      },
      onhidden() {
        bulmaJS.toggleHtmlClipped()

        cityssm.disableNavBlocker()

        currentListId = ''
        currentCallOutListMembers = []
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