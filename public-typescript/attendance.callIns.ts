/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
// import type { BulmaJS } from '@cityssm/bulma-js/types'
import type * as recordTypes from '../types/recordTypes'

// declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  const absenceTypes = exports.absenceTypes as recordTypes.AbsenceType[]
  const employees = exports.employees as recordTypes.Employee[]

  const canUpdateAbsences = exports.absencesCanUpdate as boolean
  const canUpdateReturnsToWork = exports.returnsToWorkCanUpdate as boolean

  let absenceRecords = exports.absenceRecords as recordTypes.AbsenceRecord[]
  let returnToWorkRecords =
    exports.returnToWorkRecords as recordTypes.ReturnToWorkRecord[]

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

      if (Date.now() - absenceDate.getTime() <= 86_400 * 1000) {
        panelBlockElement.classList.add('has-background-success-light')
        todayCount += 1
      }

      panelBlockElement.innerHTML = `<div class="columns">
        <div class="column is-narrow">
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Date">
            ${absenceDate.toLocaleDateString()}
          </strong>
        </div>
        <div class="column">
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

      panelElement.append(panelBlockElement)
    }

    containerElement.innerHTML = ''
    containerElement.append(panelElement)

    document.querySelector('#menu--attendance a[href="#tab--absences"] .tag')!.textContent = todayCount.toString()
  }

  function renderReturnToWorkRecords(): void {
    const containerElement = document.querySelector(
      '#container--returnsToWork'
    ) as HTMLElement

    if (containerElement === null) {
      return
    }

    if (absenceRecords.length === 0) {
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

      if (Date.now() - returnDate.getTime() <= 86_400 * 1000) {
        panelBlockElement.classList.add('has-background-success-light')
        todayCount += 1
      }

      panelBlockElement.innerHTML = `<div class="columns">
        <div class="column is-narrow">
          <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
        </div>
        <div class="column">
          <strong data-tooltip="Return Date">${returnDate.toLocaleDateString()}</strong>
        </div>
        <div class="column">
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

      panelElement.append(panelBlockElement)
    }

    containerElement.innerHTML = ''
    containerElement.append(panelElement)

    document.querySelector('#menu--attendance a[href="#tab--returnsToWork"] .tag')!.textContent = todayCount.toString()
  }

  function openCallInModal(clickEvent: Event): void {
    let callInModalElement: HTMLElement
    let callInCloseModalFunction: () => void

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

        employeeNameElement.value = (
          matchingEmployees[0].employeeGivenName +
          ' ' +
          matchingEmployees[0].employeeSurname
        ).trim()
      }
    }

    function toggleCallInType(): void {
      const callInTypeRadioElements: NodeListOf<HTMLInputElement> =
        callInModalElement.querySelectorAll('input[name="callInType"]')

      for (const radioElement of callInTypeRadioElements) {
        const labelButtonElement = radioElement.closest('label')!
        const fieldsetElement = callInModalElement.querySelector(
          `fieldset[data-call-in-type="${radioElement.value}"]`
        ) as HTMLFieldSetElement

        if (radioElement.checked) {
          labelButtonElement.classList.add('is-link')
          labelButtonElement.querySelector('.icon')!.innerHTML =
            '<i class="fas fa-check" aria-hidden="true"></i>'

          fieldsetElement.disabled = false
          fieldsetElement.classList.remove('is-hidden')
        } else {
          labelButtonElement.classList.remove('is-link')
          labelButtonElement.querySelector('.icon')!.innerHTML =
            '<i class="fas fa-minus" aria-hidden="true"></i>'

          fieldsetElement.classList.add('is-hidden')
          fieldsetElement.disabled = true
        }
      }
    }

    function recordCallIn(formEvent: Event): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        MonTY.urlPrefix + '/attendance/doRecordCallIn',
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            callInType: 'absence' | 'returnToWork'
            recordId: string
            absenceRecords?: recordTypes.AbsenceRecord[]
            returnToWorkRecords?: recordTypes.ReturnToWorkRecord[]
          }

          if (responseJSON.success) {
            callInCloseModalFunction()

            switch (responseJSON.callInType) {
              case 'absence': {
                absenceRecords = responseJSON.absenceRecords!
                renderAbsenceRecords()
                break
              }
              case 'returnToWork': {
                returnToWorkRecords = responseJSON.returnToWorkRecords!
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
          ;(modalElement.querySelector(
            '#callInAdd--absenceDateString-absence'
          ) as HTMLInputElement)!.valueAsDate = new Date()

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

        if (!canUpdateReturnsToWork) {
          modalElement
            .querySelector('#callInAdd--callInType_returnToWork')
            ?.remove()
        }
      },
      onshown(modalElement, closeModalFunction) {
        callInCloseModalFunction = closeModalFunction

        modalElement
          .querySelector('form')
          ?.addEventListener('submit', recordCallIn)

        modalElement
          .querySelector('#callInAdd--employeeNumber')
          ?.addEventListener('keyup', populateEmployeeName)

        modalElement
          .querySelector('#callInAdd--callInType_absence')
          ?.addEventListener('change', toggleCallInType)

        modalElement
          .querySelector('#callInAdd--callInType_returnToWork')
          ?.addEventListener('change', toggleCallInType)
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
