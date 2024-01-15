// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent, unicorn/prefer-module */

// eslint-disable-next-line n/no-missing-import
import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { DoAddCallOutListMemberResponse } from '../handlers/attendance-post/doAddCallOutListMember.js'
import type { DoAddCallOutRecordResponse } from '../handlers/attendance-post/doAddCallOutRecord.js'
import type { DoDeleteCallOutListResponse } from '../handlers/attendance-post/doDeleteCallOutList.js'
import type { DoDeleteCallOutListMemberResponse } from '../handlers/attendance-post/doDeleteCallOutListMember.js'
import type { DoDeleteCallOutRecordResponse } from '../handlers/attendance-post/doDeleteCallOutRecord.js'
import type { DoGetCallOutListMembersResponse } from '../handlers/attendance-post/doGetCallOutListMembers.js'
import type { DoGetCallOutRecordsResponse } from '../handlers/attendance-post/doGetCallOutRecords.js'
import type { DoUpdateCallOutListResponse } from '../handlers/attendance-post/doUpdateCallOutList.js'
import type { DoUpdateCallOutRecordResponse } from '../handlers/attendance-post/doUpdateCallOutRecord.js'
import type {
  AttendCallOuts,
  Attend as AttendGlobal
} from '../types/globalTypes.js'
import type {
  AbsenceRecord,
  CallOutList,
  CallOutListMember,
  CallOutRecord,
  CallOutResponseType,
  Employee
} from '../types/recordTypes.js'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal

  // eslint-disable-next-line sonarjs/cognitive-complexity
;(() => {
  const Attend = exports.Attend as AttendGlobal

  let currentListId = ''
  let currentCallOutListMembers: CallOutListMember[] = []
  let absenceRecords: AbsenceRecord[] = []

  /*
   * Data
   */

  let callOutLists = exports.callOutLists as CallOutList[]

  function getCurrentCallOutList(): CallOutList {
    return Attend.callOuts?.callOutLists.find((possibleCallOutList) => {
      return possibleCallOutList.listId === currentListId
    }) as CallOutList
  }

  const callOutResponseTypes = (exports.callOutResponseTypes ??
    []) as CallOutResponseType[]

  const employeeEligibilityFunctions =
    (exports.employeeEligibilityFunctionNames ?? []) as string[]

  const employeeSortKeyFunctionNames = (exports.employeeSortKeyFunctionNames ??
    []) as string[]

  /*
   * Permissions
   */

  const isAdmin = document.querySelector('main')?.dataset.isAdmin === 'true'

  const userName = document.querySelector('main')?.dataset.userName ?? ''

  const canUpdate =
    callOutResponseTypes.length === 0
      ? false
      : (exports.userPermissions.callOutsCanUpdate as boolean)

  const canManage =
    employeeEligibilityFunctions.length === 0
      ? false
      : (exports.userPermissions.callOutsCanManage as boolean)

  function openCallOutListMember(employeeNumber: string): void {
    const callOutList = getCurrentCallOutList()

    let callOutListMemberIndex = 0

    const callOutListMember = currentCallOutListMembers.find(
      (possibleMember, possibleIndex) => {
        if (possibleMember.employeeNumber === employeeNumber) {
          callOutListMemberIndex = possibleIndex
          return true
        }

        return false
      }
    ) as CallOutListMember

    const absenceRecord = absenceRecords.find((possibleRecord) => {
      return employeeNumber === possibleRecord.employeeNumber
    })

    let callOutMemberModalElement: HTMLElement

    let callOutRecords: CallOutRecord[]

    function addCallOutRecord(formEvent: SubmitEvent): void {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        `${Attend.urlPrefix}/attendance/doAddCallOutRecord`,
        formElement,
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoAddCallOutRecordResponse

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

    function deleteCallOutRecord(clickEvent: Event): void {
      clickEvent.preventDefault()

      const recordId = (
        (clickEvent.currentTarget as HTMLButtonElement).closest(
          '.panel-block'
        ) as HTMLElement
      ).dataset.recordId

      function doDelete(): void {
        cityssm.postJSON(
          `${Attend.urlPrefix}/attendance/doDeleteCallOutRecord`,
          {
            recordId,
            employeeNumber,
            listId: currentListId
          },
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoDeleteCallOutRecordResponse

            if (responseJSON.success) {
              bulmaJS.alert({
                message: 'Call out record deleted successfully.',
                contextualColorName: 'success'
              })

              callOutRecords = responseJSON.callOutRecords
              renderCallOutRecords()
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Delete Call Out Record',
        message: 'Are you sure you want to delete this call out record?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete Record',
          callbackFunction: doDelete
        }
      })
    }

    function openUpdateCallOutRecordModal(clickEvent: Event): void {
      clickEvent.preventDefault()

      let updateCallOutRecordCloseModalFunction: () => void

      const recordId = (
        (clickEvent.currentTarget as HTMLButtonElement).closest(
          '.panel-block'
        ) as HTMLElement
      ).dataset.recordId

      function doUpdateCallOutRecord(formEvent: SubmitEvent): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          `${Attend.urlPrefix}/attendance/doUpdateCallOutRecord`,
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoUpdateCallOutRecordResponse

            if (responseJSON.success) {
              updateCallOutRecordCloseModalFunction()

              bulmaJS.alert({
                message: 'Call out record updated successfully.',
                contextualColorName: 'success'
              })

              callOutRecords = responseJSON.callOutRecords
              renderCallOutRecords()
            }
          }
        )
      }

      const callOutRecord = callOutRecords.find((possibleCallOutRecord) => {
        return possibleCallOutRecord.recordId === recordId
      })

      if (callOutRecord === undefined) {
        bulmaJS.alert({
          title: 'Call Out Record Unavailable',
          message: 'Please refresh and try again.',
          contextualColorName: 'danger'
        })

        return
      }

      const callOutDateTime = new Date(callOutRecord.callOutDateTime)

      cityssm.openHtmlModal('callOutRecord-edit', {
        onshow(modalElement) {
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--recordId'
            ) as HTMLInputElement
          ).value = callOutRecord.recordId
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--listId'
            ) as HTMLInputElement
          ).value = callOutRecord.listId
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--employeeNumber'
            ) as HTMLInputElement
          ).value = callOutRecord.employeeNumber
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--callOutDateString'
            ) as HTMLInputElement
          ).value = cityssm.dateToString(callOutDateTime)
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--callOutTimeString'
            ) as HTMLInputElement
          ).value = cityssm.dateToTimeString(callOutDateTime)
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--natureOfCallOut'
            ) as HTMLInputElement
          ).value = callOutRecord.natureOfCallOut
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--callOutHours'
            ) as HTMLInputElement
          ).value = callOutRecord.callOutHours.toString()

          const responseTypeElement = modalElement.querySelector(
            '#callOutRecordEdit--responseTypeId'
          ) as HTMLSelectElement

          let responseTypeFound = false

          for (const responseType of callOutResponseTypes) {
            const optionElement = document.createElement('option')
            optionElement.value = responseType.responseTypeId.toString()
            optionElement.textContent = responseType.responseType

            if (callOutRecord.responseTypeId === responseType.responseTypeId) {
              responseTypeFound = true
            }

            responseTypeElement.append(optionElement)
          }

          if (!responseTypeFound) {
            const optionElement = document.createElement('option')
            optionElement.value = callOutRecord.responseTypeId.toString()
            optionElement.textContent =
              callOutRecord.responseType ??
              `responseTypeId:${callOutRecord.responseTypeId.toString()}`
            responseTypeElement.append(optionElement)
          }

          responseTypeElement.value = callOutRecord.responseTypeId.toString()
          ;(
            modalElement.querySelector(
              '#callOutRecordEdit--recordComment'
            ) as HTMLInputElement
          ).value = callOutRecord.recordComment
        },
        onshown(modalElement, closeModalFunction) {
          updateCallOutRecordCloseModalFunction = closeModalFunction
          modalElement
            .querySelector('form')
            ?.addEventListener('submit', doUpdateCallOutRecord)
        }
      })
    }

    function renderCallOutRecords(): void {
      // Tag Count

      ;(
        callOutMemberModalElement.querySelector(
          '#tag--recentCalls'
        ) as HTMLElement
      ).textContent = callOutRecords.length.toString()

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
            (record.isSuccessful as boolean)
              ? '<i class="fas fa-fw fa-check has-text-success" aria-label="Yes"></i>'
              : '<i class="fas fa-fw fa-times has-text-danger" aria-label="No"></i>'
          }
            ${callOutDateTime.toLocaleDateString()} ${callOutDateTime.toLocaleTimeString()}`
        }

        const panelBlockElement = document.createElement('div')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.recordId = record.recordId

        panelBlockElement.classList.add(
          (record.isSuccessful as boolean)
            ? 'has-background-success-light'
            : 'has-background-danger-light'
        )

        panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow">
            ${
              (record.isSuccessful as boolean)
                ? '<i class="fas fa-fw fa-check has-text-success" aria-label="Yes"></i>'
                : '<i class="fas fa-fw fa-times has-text-danger" aria-label="No"></i>'
            }
          </div>
          <div class="column">
            ${callOutDateTime.toLocaleDateString()} ${callOutDateTime.toLocaleTimeString()}<br />
            <span class="is-size-7">
              <strong>${record.responseType ?? '(No Response)'}</strong><br />
              <span class="has-tooltip-right" data-tooltip="Call Out List">
                <i class="fas fa-fw fa-list" aria-hidden="true"></i>
                ${cityssm.escapeHTML(record.listName ?? '')}
              </span><br />
              <span class="has-tooltip-right" data-tooltip="Nature of Call Out">
                <i class="fas fa-fw fa-info-circle" aria-hidden="true"></i>
                ${cityssm.escapeHTML(record.natureOfCallOut ?? '')}
              </span><br />
              <span class="has-tooltip-right" data-tooltip="Comment">
                <i class="fas fa-fw fa-comment" aria-hidden="true"></i>
                ${cityssm.escapeHTML(record.recordComment ?? '')}
              </span>
            </span>
          </div>
          <div class="column is-narrow">
            ${
              canUpdate &&
              (isAdmin || record.recordCreate_userName === userName)
                ? `<div class="field has-addons">
                  <div class="control">
                    <button class="button is-update-button" data-tooltip="Edit Record">
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div class="control">
                    <button class="button is-delete-button" data-tooltip="Delete Record">
                      <i class="fas fa-trash has-text-danger" aria-hidden="true"></i>
                    </button>
                  </div>
                  </div>`
                : ''
            }
          </div>
          </div>`

        panelBlockElement
          .querySelector('.is-update-button')
          ?.addEventListener('click', openUpdateCallOutRecordModal)

        panelBlockElement
          .querySelector('.is-delete-button')
          ?.addEventListener('click', deleteCallOutRecord)

        panelElement.append(panelBlockElement)
      }

      callOutRecordsContainerElement.innerHTML = ''
      callOutRecordsContainerElement.append(panelElement)
    }

    cityssm.openHtmlModal('callOuts-member', {
      onshow(modalElement) {
        callOutMemberModalElement = modalElement

        const employeeName = `${callOutListMember.employeeSurname}, ${callOutListMember.employeeGivenName}`

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

        if (absenceRecord !== undefined) {
          modalElement
            .querySelector('#callOutListMember--absenceRecord')
            ?.insertAdjacentHTML(
              'afterbegin',
              `<div class="box mb-3 has-background-warning-light">
              <div class="columns is-mobile">
                <div class="column is-narrow" data-tooltip="Absence Record">
                  <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                </div>
                <div class="column">
                  ${new Date(
                    absenceRecord.absenceDateTime
                  ).toLocaleDateString()}<br />
                  ${absenceRecord.absenceType}
                </div>
              </div>
              </div>`
            )
        }

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
          `${Attend.urlPrefix}/attendance/doGetCallOutRecords`,
          {
            listId: callOutList.listId,
            employeeNumber
          },
          (rawResponseJSON) => {
            callOutRecords = (
              rawResponseJSON as unknown as DoGetCallOutRecordsResponse
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

    const employeeNumber = anchorElement.dataset.employeeNumber as string

    openCallOutListMember(employeeNumber)
  }

  function openCallOutList(
    listId: string,
    onUpdateCallbackFunction?: () => void
  ): void {
    currentListId = listId
    currentCallOutListMembers = []

    let callOutListMemberEmployeeNumbers: string[] = []
    let availableEmployees: Employee[] = []

    let callOutListCloseModalFunction: () => void

    const callOutList = getCurrentCallOutList()

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
        `${Attend.urlPrefix}/attendance/doUpdateCallOutList`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoUpdateCallOutListResponse

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

            currentCallOutListMembers = responseJSON.callOutListMembers
            availableEmployees = responseJSON.availableEmployees
            renderCallOutListMembers()
            renderAvailableEmployees()

            callOutLists = responseJSON.callOutLists
            ;(Attend.callOuts as AttendCallOuts).callOutLists =
              responseJSON.callOutLists

            if (onUpdateCallbackFunction !== undefined) {
              onUpdateCallbackFunction()
            }
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
      ;(
        callOutListModalElement.querySelector(
          '#callOutListEdit--allowSelfSignUp'
        ) as HTMLTextAreaElement
      ).value = callOutList.allowSelfSignUp ?? false ? '1' : '0'
      ;(
        callOutListModalElement.querySelector(
          '#callOutListEdit--selfSignUpKey'
        ) as HTMLTextAreaElement
      ).value = callOutList.selfSignUpKey ?? ''

      // Eligibility Function

      let eligibilityFunctionFound = false
      const eligibilityFunctionElement = callOutListModalElement.querySelector(
        '#callOutListEdit--eligibilityFunction'
      ) as HTMLSelectElement

      for (const eligibilityFunctionName of employeeEligibilityFunctions) {
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
        optionElement.value = callOutList.eligibilityFunction ?? ''
        optionElement.textContent = callOutList.eligibilityFunction ?? ''
        optionElement.selected = true
        eligibilityFunctionElement.append(optionElement)
      }

      // Sort Key Function

      let sortKeyFunctionFound = false
      const sortKeyFunctionElement = callOutListModalElement.querySelector(
        '#callOutListEdit--sortKeyFunction'
      ) as HTMLSelectElement

      for (const sortKeyFunctionName of employeeSortKeyFunctionNames) {
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
        optionElement.value = callOutList.sortKeyFunction ?? ''
        optionElement.textContent = callOutList.sortKeyFunction ?? ''
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
            ;(
              formElement.querySelector('fieldset') as HTMLFieldSetElement
            ).disabled = false
          })
      }
    }

    function addCallOutListMember(clickEvent: MouseEvent): void {
      clickEvent.preventDefault()

      const employeeNumber = (clickEvent.currentTarget as HTMLAnchorElement)
        .dataset.employeeNumber

      cityssm.postJSON(
        `${Attend.urlPrefix}/attendance/doAddCallOutListMember`,
        {
          listId: callOutList.listId,
          employeeNumber
        },
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoAddCallOutListMemberResponse

          if (responseJSON.success) {
            currentCallOutListMembers = responseJSON.callOutListMembers
            renderCallOutListMembers()
            renderAvailableEmployees()

            callOutList.callOutListMembersCount =
              currentCallOutListMembers.length

            if (onUpdateCallbackFunction !== undefined) {
              onUpdateCallbackFunction()
            }
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

      const employeeNumber =
        (clickEvent.currentTarget as HTMLAnchorElement).dataset
          .employeeNumber ?? ''

      function doDelete(): void {
        cityssm.postJSON(
          `${Attend.urlPrefix}/attendance/doDeleteCallOutListMember`,
          {
            listId: callOutList.listId,
            employeeNumber
          },
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoDeleteCallOutListMemberResponse

            if (responseJSON.success) {
              currentCallOutListMembers = responseJSON.callOutListMembers
              renderCallOutListMembers()
              renderAvailableEmployees()

              callOutList.callOutListMembersCount =
                currentCallOutListMembers.length

              if (onUpdateCallbackFunction !== undefined) {
                onUpdateCallbackFunction()
              }
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

      // eslint-disable-next-line no-labels
      availableEmployeeLoop: for (const availableEmployee of availableEmployees) {
        // employee already in the list
        if (
          callOutListMemberEmployeeNumbers.includes(
            availableEmployee.employeeNumber
          )
        ) {
          continue
        }

        const searchStringPieces = (
          callOutListModalElement.querySelector(
            '#filter--callOutListAvailableEmployees'
          ) as HTMLInputElement
        ).value
          .trim()
          .toLowerCase()
          .split(' ')

        const employeeString =
          `${availableEmployee.employeeGivenName} ${availableEmployee.employeeSurname}`.toLowerCase()

        for (const searchStringPiece of searchStringPieces) {
          if (!employeeString.includes(searchStringPiece)) {
            // eslint-disable-next-line no-labels
            continue availableEmployeeLoop
          }
        }

        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block'
        panelBlockElement.href = '#'
        panelBlockElement.dataset.employeeNumber =
          availableEmployee.employeeNumber

        panelBlockElement.innerHTML = `<span class="panel-icon">
          <i class="fas fa-plus" aria-hidden="true"></i>
          </span>
          <div>
            <strong>
            ${availableEmployee.employeeSurname},
            ${availableEmployee.employeeGivenName}
            </strong><br />
            <span class="is-size-7">${availableEmployee.jobTitle ?? ''}</span>
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

      let currentPanelElement: HTMLElement | undefined

      if (canManage) {
        currentPanelElement = document.createElement('div')
        currentPanelElement.className = 'panel'
      }

      for (const member of currentCallOutListMembers) {
        const absenceRecord = absenceRecords.find((possibleRecord) => {
          return member.employeeNumber === possibleRecord.employeeNumber
        })

        // Member List

        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.href = '#'
        panelBlockElement.dataset.employeeNumber = member.employeeNumber

        panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow">
          ${
            absenceRecord === undefined
              ? '<i class="fas fa-fw fa-hard-hat" aria-hidden="true"></i>'
              : '<i class="fas fa-fw fa-sign-out-alt has-text-warning-dark" aria-hidden="true"></i>'
          }
          </div>
          <div class="column">
            <strong>
              ${member.employeeSurname},
              ${member.employeeGivenName}
            </strong><br />
            <span class="is-size-7">${member.employeeNumber}</span>
          </div>
          <div class="column">
            <span class="is-size-7 has-tooltip-left" data-tooltip="Sort Key">
              <i class="fas fa-sort-alpha-down" aria-hidden="true"></i>
              ${member.sortKey ?? ''}
            </span><br />
            <span class="is-size-7 has-tooltip-left" data-tooltip="Last Call Out Time">
              <i class="fas fa-phone-volume" aria-hidden="true"></i>
              ${
                member.callOutDateTimeMax === null
                  ? '(No Recent Call Out)'
                  : new Date(
                      member.callOutDateTimeMax as string
                    ).toLocaleDateString()
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

        if (!canManage || currentPanelElement === undefined) {
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

        currentPanelElement.append(currentPanelBlockElement)
      }

      callOutListMembersContainer.innerHTML = ''
      callOutListMembersContainer.append(panelElement)

      if (canManage && currentPanelElement !== undefined) {
        callOutListCurrentMembersContainer.innerHTML = ''
        callOutListCurrentMembersContainer.append(currentPanelElement)
      }
    }

    function deleteCallOutList(clickEvent: MouseEvent): void {
      clickEvent.preventDefault()

      function doDelete(): void {
        cityssm.postJSON(
          `${Attend.urlPrefix}/attendance/doDeleteCallOutList`,
          {
            listId
          },
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoDeleteCallOutListResponse

            if (responseJSON.success) {
              cityssm.disableNavBlocker()
              callOutListCloseModalFunction()

              bulmaJS.alert({
                message: 'Call Out List deleted successfully.'
              })

              callOutLists = responseJSON.callOutLists
              ;(Attend.callOuts as AttendCallOuts).callOutLists =
                responseJSON.callOutLists

              if (onUpdateCallbackFunction !== undefined) {
                onUpdateCallbackFunction()
              }
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Delete Call Out List',
        message: 'Are you sure you want to delete this call out list?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete Call Out List',
          callbackFunction: doDelete
        }
      })
    }

    cityssm.openHtmlModal('callOuts-list', {
      onshow(modalElement) {
        callOutListModalElement = modalElement
        ;(
          modalElement.querySelector('.modal-card-title') as HTMLElement
        ).textContent = callOutList.listName

        if (canManage) {
          modalElement
            .querySelector(".tabs a[href$='tab--callOutMembers-manage']")
            ?.classList.remove('is-hidden')

          const deleteCallOutListElement = modalElement.querySelector(
            '.is-delete-call-out-list'
          ) as HTMLAnchorElement

          deleteCallOutListElement
            .closest('.dropdown')
            ?.classList.remove('is-hidden')

          deleteCallOutListElement.addEventListener('click', deleteCallOutList)
        } else {
          modalElement.querySelector('#tab--callOuts-members > .tabs')?.remove()
        }

        // List Details

        initializeListDetailsTab()

        // Members

        cityssm.postJSON(
          `${Attend.urlPrefix}/attendance/doGetCallOutListMembers`,
          {
            listId: callOutList.listId,
            includeAvailableEmployees: canManage
          },
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoGetCallOutListMembersResponse

            currentCallOutListMembers = responseJSON.callOutListMembers
            availableEmployees = responseJSON.availableEmployees
            absenceRecords = responseJSON.absenceRecords

            renderCallOutListMembers()
            renderAvailableEmployees()

            callOutListModalElement
              .querySelector('#filter--callOutListAvailableEmployees')
              ?.addEventListener('keyup', renderAvailableEmployees)
          }
        )
      },
      onshown(modalElement, closeModalFunction) {
        callOutListCloseModalFunction = closeModalFunction

        bulmaJS.toggleHtmlClipped()

        bulmaJS.init(modalElement)

        Attend.initializeMenuTabs(
          modalElement.querySelectorAll('.menu a'),
          modalElement.querySelectorAll('.tabs-container > article')
        )
        ;(
          modalElement.querySelector(
            '#reportingLink--callOutListReport'
          ) as HTMLAnchorElement
        ).href = `${Attend.urlPrefix}/print/screen/callOutList/?listIds=${listId}`
        ;(
          modalElement.querySelector(
            '#reportingLink--callOutListMembersCSV'
          ) as HTMLAnchorElement
        ).href = `${Attend.urlPrefix}/reports/callOutListMembers-formatted-byListId/?listId=${listId}`
        ;(
          modalElement.querySelector(
            '#reportingLink--callOutRecordsCSV'
          ) as HTMLAnchorElement
        ).href = `${Attend.urlPrefix}/reports/callOutRecords-recent-byListId/?listId=${listId}`

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

  const AttendCallOuts: AttendCallOuts = {
    callOutLists,
    openCallOutList
  }

  exports.Attend.callOuts = AttendCallOuts
})()
