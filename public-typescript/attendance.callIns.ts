// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

// eslint-disable-next-line n/no-missing-import
import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { MonTY as MonTYGlobal } from '../types/globalTypes.js'
import type {
  AbsenceRecord,
  AbsenceType,
  Employee,
  ReturnToWorkRecord
} from '../types/recordTypes.js'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal

  // eslint-disable-next-line sonarjs/cognitive-complexity
;(() => {
  const MonTY = exports.MonTY as MonTYGlobal

  const absenceTypes = exports.absenceTypes as AbsenceType[]
  const employees = exports.employees as Employee[]

  const employeeNumberRegularExpression =
    exports.employeeNumberRegularExpression as RegExp | undefined

  // const updateDays = exports.updateDays as number

  const canUpdateAbsences = exports.absencesCanUpdate as boolean
  // const canManageAbsences = exports.absencesCanManage as boolean

  const canUpdateReturnsToWork = exports.returnsToWorkCanUpdate as boolean
  // const canManageReturnsToWork = exports.returnsToWorkCanManage as boolean

  let absenceRecords = exports.absenceRecords as AbsenceRecord[]
  let returnToWorkRecords = exports.returnToWorkRecords as ReturnToWorkRecord[]

  function deleteAbsenceRecord(clickEvent: Event): void {
    const recordId = (
      (clickEvent.currentTarget as HTMLButtonElement).closest(
        '.panel-block'
      ) as HTMLElement
    ).dataset.recordId

    function doDelete(): void {
      cityssm.postJSON(
        `${MonTY.urlPrefix}/attendance/doDeleteAbsenceRecord`,
        {
          recordId
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as
            | {
                success: true
                absenceRecords: AbsenceRecord[]
              }
            | {
                success: false
                errorMessage: string
              }

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Absence record deleted successfully.',
              contextualColorName: 'success'
            })

            absenceRecords = responseJSON.absenceRecords
            renderAbsenceRecords()
          } else {
            bulmaJS.alert({
              title: 'Error Deleting Record',
              message: responseJSON.errorMessage ?? '',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    bulmaJS.confirm({
      title: 'Delete Absence Record',
      message: 'Are you sure you want to delete this absence record?',
      contextualColorName: 'warning',
      okButton: {
        text: 'Yes, Delete Record',
        callbackFunction: doDelete
      }
    })
  }

  function renderAbsenceRecords(): void {
    const containerElement = document.querySelector(
      '#container--absences'
    ) as HTMLElement

    if (containerElement === null) {
      return
    }

    if (absenceRecords.length === 0) {
      containerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no recent absence records to show.</p>
        </div>`

      return
    }

    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    let todayCount = 0

    for (const absenceRecord of absenceRecords) {
      const absenceDate = new Date(absenceRecord.absenceDateTime)

      const panelBlockElement = document.createElement('div')
      panelBlockElement.className = 'panel-block is-block'
      panelBlockElement.dataset.recordId = absenceRecord.recordId
      panelBlockElement.tabIndex = 0

      if (Date.now() - absenceDate.getTime() <= 86_400 * 1000) {
        panelBlockElement.classList.add('has-background-success-light')
        todayCount += 1
      }

      panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
        </div>
        <div class="column is-3">
          <strong data-tooltip="Absence Date">
            ${absenceDate.toLocaleDateString()}
          </strong>
        </div>
        <div class="column is-4">
          <strong>${absenceRecord.employeeName}</strong><br />
          <span class="is-size-7">${absenceRecord.employeeNumber ?? ''}</span>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Type">${
            absenceRecord.absenceType ?? absenceRecord.absenceTypeKey
          }</strong><br />
          <span class="is-size-7">${absenceRecord.recordComment ?? ''}</span>
        </div>
        </div>`

      if (absenceRecord.canUpdate as boolean) {
        panelBlockElement.querySelector('.columns')?.insertAdjacentHTML(
          'beforeend',
          `<div class="column is-narrow">
            <button class="button is-small is-inverted is-danger has-tooltip-left is-delete-button" data-tooltip="Delete Record" data-cy="delete" type="button" aria-label="Delete Record">
              <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
          </div>`
        )

        panelBlockElement
          .querySelector('.is-delete-button')
          ?.addEventListener('click', deleteAbsenceRecord)
      }

      panelElement.append(panelBlockElement)
    }

    containerElement.innerHTML = ''
    containerElement.append(panelElement)
    ;(
      document.querySelector(
        '#menu--attendance a[href="#tab--absences"] .tag'
      ) as HTMLElement
    ).textContent = todayCount.toString()
  }

  function deleteReturnToWorkRecord(clickEvent: Event): void {
    const recordId = (
      (clickEvent.currentTarget as HTMLButtonElement).closest(
        '.panel-block'
      ) as HTMLElement
    ).dataset.recordId

    function doDelete(): void {
      cityssm.postJSON(
        `${MonTY.urlPrefix}/attendance/doDeleteReturnToWorkRecord`,
        {
          recordId
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as
            | {
                success: true
                returnToWorkRecords: ReturnToWorkRecord[]
              }
            | {
                success: false
                errorMessage: string
              }

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Return to work record deleted successfully.',
              contextualColorName: 'success'
            })

            returnToWorkRecords = responseJSON.returnToWorkRecords
            renderReturnToWorkRecords()
          } else {
            bulmaJS.alert({
              title: 'Error Deleting Record',
              message: responseJSON.errorMessage ?? '',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    bulmaJS.confirm({
      title: 'Delete Return to Work Record',
      message: 'Are you sure you want to delete this return to work record?',
      contextualColorName: 'warning',
      okButton: {
        text: 'Yes, Delete Record',
        callbackFunction: doDelete
      }
    })
  }

  function renderReturnToWorkRecords(): void {
    const containerElement = document.querySelector(
      '#container--returnsToWork'
    ) as HTMLElement

    if (containerElement === null) {
      return
    }

    if (returnToWorkRecords.length === 0) {
      containerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no recent return to work records to show.</p>
        </div>`

      return
    }

    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    let todayCount = 0

    for (const returnToWorkRecord of returnToWorkRecords) {
      const returnDate = new Date(returnToWorkRecord.returnDateTime)

      const panelBlockElement = document.createElement('div')
      panelBlockElement.className = 'panel-block is-block'
      panelBlockElement.dataset.recordId = returnToWorkRecord.recordId
      panelBlockElement.tabIndex = 0

      if (Date.now() - returnDate.getTime() <= 86_400 * 1000) {
        panelBlockElement.classList.add('has-background-success-light')
        todayCount += 1
      }

      panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
        </div>
        <div class="column is-3">
          <strong data-tooltip="Return Date">${returnDate.toLocaleDateString()}</strong>
        </div>
        <div class="column is-4">
          <strong>${returnToWorkRecord.employeeName}</strong><br />
          <span class="is-size-7">${
            returnToWorkRecord.employeeNumber ?? ''
          }</span>
        </div>
        <div class="column">
          <strong data-tooltip="Return Shift">${
            returnToWorkRecord.returnShift ?? '(No Shift)'
          }</strong><br />
          <span class="is-size-7">${
            returnToWorkRecord.recordComment ?? ''
          }</span>
        </div>
        </div>`

      if (returnToWorkRecord.canUpdate as boolean) {
        panelBlockElement.querySelector('.columns')?.insertAdjacentHTML(
          'beforeend',
          `<div class="column is-narrow">
              <button class="button is-small is-inverted is-danger has-tooltip-left is-delete-button" data-tooltip="Delete Record" data-cy="delete" type="button" aria-label="Delete Record">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>`
        )

        panelBlockElement
          .querySelector('.is-delete-button')
          ?.addEventListener('click', deleteReturnToWorkRecord)
      }

      panelElement.append(panelBlockElement)
    }

    containerElement.innerHTML = ''
    containerElement.append(panelElement)
    ;(
      document.querySelector(
        '#menu--attendance a[href="#tab--returnsToWork"] .tag'
      ) as HTMLElement
    ).textContent = todayCount.toString()
  }

  function openCallInModal(clickEvent: Event): void {
    let callInModalElement: HTMLElement
    let callInCloseModalFunction: () => void

    const callInType =
      (clickEvent.currentTarget as HTMLElement).dataset.callInType ?? ''

    let previousEmployeeNumberPiece = ''

    function populateEmployeeName(): void {
      const employeeNumberElement = callInModalElement.querySelector(
        '#callInAdd--employeeNumber'
      ) as HTMLInputElement

      const employeeNumberPiece = employeeNumberElement.value.toLowerCase()

      if (employeeNumberPiece === previousEmployeeNumberPiece) {
        return
      }

      previousEmployeeNumberPiece = employeeNumberPiece

      const employeeNameElement = callInModalElement.querySelector(
        '#callInAdd--employeeName'
      ) as HTMLInputElement
      employeeNameElement.value = ''

      const matchingEmployees = employees.filter((possibleEmployee) => {
        return (
          employeeNumberPiece.length >=
            possibleEmployee.employeeNumber.length / 2 &&
          possibleEmployee.employeeNumber
            .toLowerCase()
            .endsWith(employeeNumberPiece)
        )
      })

      if (matchingEmployees.length === 1) {
        employeeNumberElement.value = matchingEmployees[0].employeeNumber
        previousEmployeeNumberPiece =
          matchingEmployees[0].employeeNumber.toLowerCase()

        employeeNameElement.value =
          `${matchingEmployees[0].employeeGivenName} ${matchingEmployees[0].employeeSurname}`.trim()
      }
    }

    function toggleCallInType(): void {
      const callInTypeRadioElements: NodeListOf<HTMLInputElement> =
        callInModalElement.querySelectorAll('input[name="callInType"]')

      for (const radioElement of callInTypeRadioElements) {
        const labelButtonElement = radioElement.closest(
          'label'
        ) as HTMLLabelElement
        const fieldsetElement = callInModalElement.querySelector(
          `fieldset[data-call-in-type="${radioElement.value}"]`
        ) as HTMLFieldSetElement

        if (radioElement.checked) {
          labelButtonElement.classList.add('is-link')
          ;(
            labelButtonElement.querySelector('.icon') as HTMLElement
          ).innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>'

          fieldsetElement.disabled = false
          fieldsetElement.classList.remove('is-hidden')
        } else {
          labelButtonElement.classList.remove('is-link')
          ;(
            labelButtonElement.querySelector('.icon') as HTMLElement
          ).innerHTML = '<i class="fas fa-minus" aria-hidden="true"></i>'

          fieldsetElement.classList.add('is-hidden')
          fieldsetElement.disabled = true
        }
      }
    }

    function recordCallIn(formEvent: Event): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${MonTY.urlPrefix}/attendance/doRecordCallIn`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            callInType: 'absence' | 'returnToWork'
            recordId: string
            absenceRecords?: AbsenceRecord[]
            returnToWorkRecords?: ReturnToWorkRecord[]
          }

          if (responseJSON.success) {
            callInCloseModalFunction()

            switch (responseJSON.callInType) {
              case 'absence': {
                absenceRecords = responseJSON.absenceRecords ?? []
                renderAbsenceRecords()
                break
              }
              case 'returnToWork': {
                returnToWorkRecords = responseJSON.returnToWorkRecords ?? []
                renderReturnToWorkRecords()
                break
              }
            }
          }
        }
      )
    }

    cityssm.openHtmlModal('callIn-add', {
      onshow(modalElement) {
        callInModalElement = modalElement

        if (canUpdateAbsences) {
          // eslint-disable-next-line no-extra-semi
          ;(
            modalElement.querySelector(
              '#callInAdd--absenceDateString-absence'
            ) as HTMLInputElement
          ).valueAsDate = new Date()

          const absenceTypeElement = modalElement.querySelector(
            '#callInAdd--absenceTypeKey-absence'
          ) as HTMLSelectElement

          for (const absenceType of absenceTypes) {
            const optionElement = document.createElement('option')
            optionElement.value = absenceType.absenceTypeKey
            optionElement.textContent = absenceType.absenceType
            absenceTypeElement.append(optionElement)
          }
        } else {
          modalElement.querySelector('#callInAdd--callInType_absence')?.remove()
        }

        if (canUpdateReturnsToWork) {
          // eslint-disable-next-line no-extra-semi
          ;(
            modalElement.querySelector(
              '#callInAdd--returnDateString-returnToWork'
            ) as HTMLInputElement
          ).valueAsDate = new Date()
        } else {
          modalElement
            .querySelector('#callInAdd--callInType_returnToWork')
            ?.remove()
        }

        if (callInType !== '') {
          // eslint-disable-next-line no-extra-semi
          ;(
            modalElement.querySelector(
              `#callInAdd--callInType_${callInType}`
            ) as HTMLInputElement
          ).checked = true

          toggleCallInType()
        }
      },
      onshown(modalElement, closeModalFunction) {
        callInCloseModalFunction = closeModalFunction

        bulmaJS.toggleHtmlClipped()

        modalElement
          .querySelector('form')
          ?.addEventListener('submit', recordCallIn)

        const employeeNumberElement = modalElement.querySelector(
          '#callInAdd--employeeNumber'
        ) as HTMLInputElement

        if (employeeNumberRegularExpression !== undefined) {
          employeeNumberElement.pattern = employeeNumberRegularExpression.source
        }

        employeeNumberElement.focus()

        employeeNumberElement.addEventListener('keyup', populateEmployeeName)

        modalElement
          .querySelector('#callInAdd--callInType_absence')
          ?.addEventListener('change', toggleCallInType)

        modalElement
          .querySelector('#callInAdd--callInType_returnToWork')
          ?.addEventListener('change', toggleCallInType)
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  if (canUpdateAbsences || canUpdateReturnsToWork) {
    const addCallInButtonElements = document.querySelectorAll(
      '.is-new-call-in-button'
    )

    for (const buttonElement of addCallInButtonElements) {
      buttonElement.addEventListener('click', openCallInModal)
    }
  }

  renderAbsenceRecords()
  renderReturnToWorkRecords()
})()
