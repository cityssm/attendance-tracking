/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
// import type { BulmaJS } from '@cityssm/bulma-js/types'

import type * as globalTypes from '../types/globalTypes'
import type * as recordTypes from '../types/recordTypes'

// declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  const employees = exports.employees as recordTypes.Employee[]

  const filterElement = document.querySelector(
    '#employees--searchFilter'
  ) as HTMLInputElement

  const employeesContainerElement = document.querySelector(
    '#container--employees'
  ) as HTMLElement

  function insertRecord(
    panelElement: HTMLElement,
    panelBlockElementToInsert: HTMLElement
  ): void {
    let inserted = false

    const panelBlockElements: NodeListOf<HTMLElement> =
      panelElement.querySelectorAll('.panel-block')

    for (const panelBlockElement of panelBlockElements) {
      if (
        panelBlockElement.dataset.recordCreate_timeMillis! <
        panelBlockElementToInsert.dataset.recordCreate_timeMillis!
      ) {
        panelBlockElement.before(panelBlockElementToInsert)
        inserted = true
        break
      }
    }

    if (!inserted) {
      panelElement.append(panelBlockElementToInsert)
    }
  }

  function openEmployeeModal(employeeNumber: string): void {
    let employeeModalElement: HTMLElement

    const employee = employees.find((possibleEmployee) => {
      return possibleEmployee.employeeNumber === employeeNumber
    })!

    function renderAttendanceRecords(records: {
      absenceRecords: recordTypes.AbsenceRecord[]
      returnToWorkRecords: recordTypes.ReturnToWorkRecord[]
      callOutRecords: recordTypes.CallOutRecord[]
    }): void {
      const panelElement = document.createElement('div')
      panelElement.className = 'panel'

      const containerElement = employeeModalElement.querySelector(
        '#container--attendanceLog'
      ) as HTMLElement

      for (const absenceRecord of records.absenceRecords) {
        const panelBlockElement = document.createElement('div')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.recordCreate_timeMillis = new Date(
          absenceRecord.recordCreate_dateTime!
        )
          .getTime()
          .toString()

        panelBlockElement.innerHTML = `<div class="columns">
          <div class="column is-narrow has-tooltip-right" data-tooltip="Absence">
            <i class="fas fa-fw fa-sign-out-alt" aria-label="Absence"></i>
          </div>
          <div class="column">
            <strong>${new Date(
              absenceRecord.absenceDateTime
            ).toLocaleDateString()}</strong>
          </div>
          <div class="column">
            <strong>${absenceRecord.absenceType!}</strong><br />
            <span class="is-size-7">${absenceRecord.recordComment ?? ''}</span>
          </div>
          </div>`

        panelElement.append(panelBlockElement)
      }

      for (const returnToWorkRecord of records.returnToWorkRecords) {
        const panelBlockElement = document.createElement('div')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.recordCreate_timeMillis = new Date(
          returnToWorkRecord.recordCreate_dateTime!
        )
          .getTime()
          .toString()

        panelBlockElement.innerHTML = `<div class="columns">
          <div class="column is-narrow has-tooltip-right" data-tooltip="Return to Work">
            <i class="fas fa-fw fa-sign-in-alt" aria-label="Return to Work"></i>
          </div>
          <div class="column">
            <strong>${new Date(
              returnToWorkRecord.returnDateTime
            ).toLocaleDateString()}</strong><br />
            ${returnToWorkRecord.returnShift ?? ''}
          </div>
          <div class="column">
            <strong>Return to Work</strong><br />
            <span class="is-size-7">${
              returnToWorkRecord.recordComment ?? ''
            }</span>
          </div>
          </div>`

        insertRecord(panelElement, panelBlockElement)
      }

      for (const callOutRecord of records.callOutRecords) {
        const panelBlockElement = document.createElement('div')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.recordCreate_timeMillis = new Date(
          callOutRecord.recordCreate_dateTime!
        )
          .getTime()
          .toString()

        panelBlockElement.innerHTML = `<div class="columns">
          <div class="column is-narrow has-tooltip-right" data-tooltip="Call Out">
            <i class="fas fa-fw fa-phone" aria-label="Call Out"></i>
          </div>
          <div class="column">
            <strong>${new Date(
              callOutRecord.callOutDateTime
            ).toLocaleDateString()}</strong><br />
            <span class="is-size-7">
              <i class="fas fa-fw ${
                callOutRecord.isSuccessful ?? false
                  ? ' fa-check has-text-success'
                  : ' fa-times has-text-danger'
              }" aria-hidden="true"></i>
              ${callOutRecord.responseType ?? ''}
            </span>
          </div>
          <div class="column">
            <strong>Call Out</strong><br />
            <span class="is-size-7">${callOutRecord.recordComment ?? ''}</span>
          </div>
          </div>`

        insertRecord(panelElement, panelBlockElement)
      }

      if (panelElement.hasChildNodes()) {
        containerElement.innerHTML = ''
        containerElement.append(panelElement)
      } else {
        containerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">There are no attendance records in the past ${
            exports.recentDays as number
          } days.</p>
          </div>`
      }
    }

    cityssm.openHtmlModal('attendance-employee', {
      onshow(modalElement) {
        employeeModalElement = modalElement
        ;(
          modalElement.querySelector(
            '#container--attendanceLogEmployee'
          ) as HTMLElement
        ).innerHTML = `<div class="columns">
            <div class="column is-5">
              <strong>Employee Number</strong><br />
              ${employee.employeeNumber}
            </div>
            <div class="column">
              <strong>Employee Name</strong><br />
              ${employee.employeeSurname}, ${employee.employeeGivenName}
            </div>
          </div>`

        cityssm.postJSON(
          MonTY.urlPrefix + '/attendance/doGetAttendanceRecords',
          {
            employeeNumber
          },
          (rawResponseJSON) => {
            renderAttendanceRecords(
              rawResponseJSON as {
                absenceRecords: recordTypes.AbsenceRecord[]
                returnToWorkRecords: recordTypes.ReturnToWorkRecord[]
                callOutRecords: recordTypes.CallOutRecord[]
              }
            )
          }
        )
      }
    })
  }

  function openEmployeeModalByClick(clickEvent: Event): void {
    clickEvent.preventDefault()

    const employeeNumber = (clickEvent.currentTarget as HTMLAnchorElement)
      .dataset.employeeNumber!

    openEmployeeModal(employeeNumber)
  }

  function renderEmployees(): void {
    if (employees.length === 0) {
      employeesContainerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active employees to report.</p>
        </div>`

      return
    }

    const searchStringPieces = filterElement.value
      .trim()
      .toLowerCase()
      .split(' ')

    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    for (const employee of employees) {
      const employeeSearchString = (
        employee.employeeNumber +
        ' ' +
        employee.employeeGivenName +
        ' ' +
        employee.employeeSurname
      ).toLowerCase()

      let recordFound = true

      for (const searchStringPiece of searchStringPieces) {
        if (!employeeSearchString.includes(searchStringPiece)) {
          recordFound = false
          break
        }
      }

      if (!recordFound) {
        continue
      }

      const panelBlockElement = document.createElement('a')
      panelBlockElement.className = 'panel-block is-block'
      panelBlockElement.dataset.employeeNumber = employee.employeeNumber
      panelBlockElement.href = '#'

      panelBlockElement.innerHTML = `<div class="columns">
        <div class="column">
          <strong>${employee.employeeNumber}</strong>
        </div>
        <div class="column">
          <strong>${employee.employeeSurname}, ${
        employee.employeeGivenName
      }</strong><br />
          <span class="is-size-7">${employee.jobTitle ?? ''}</span>
        </div>
        </div>`

      panelBlockElement.addEventListener('click', openEmployeeModalByClick)

      panelElement.append(panelBlockElement)
    }

    if (!panelElement.hasChildNodes()) {
      employeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no active employees that meet the search criteria.</p>
        </div>`

      return
    }

    employeesContainerElement.innerHTML = ''
    employeesContainerElement.append(panelElement)
  }

  renderEmployees()

  filterElement.addEventListener('keyup', renderEmployees)
})()
