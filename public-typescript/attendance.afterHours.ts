/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

import type * as globalTypes from '../types/globalTypes.js'
import type * as recordTypes from '../types/recordTypes.js'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  const afterHoursReasons =
    exports.afterHoursReasons as recordTypes.AfterHoursReason[]
  const employees = exports.employees as recordTypes.Employee[]

  let afterHoursRecords =
    exports.afterHoursRecords as recordTypes.AfterHoursRecord[]

  function renderAfterHoursRecords(): void {
    const containerElement = document.querySelector(
      '#container--afterHours'
    ) as HTMLElement

    if (containerElement === null) {
      return
    }

    if (afterHoursRecords.length === 0) {
      containerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no recent after hours records to show.</p>
        </div>`

      return
    }

    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    let todayCount = 0

    for (const afterHoursRecord of afterHoursRecords) {
      const attendanceDateTime = new Date(afterHoursRecord.attendanceDateTime)

      const panelBlockElement = document.createElement('div')
      panelBlockElement.className = 'panel-block is-block'

      if (Date.now() - attendanceDateTime.getTime() <= 86_400 * 1000) {
        panelBlockElement.classList.add('has-background-success-light')
        todayCount += 1
      }

      panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-clock" aria-hidden="true"></i>
        </div>
        <div class="column is-3">
          <strong data-tooltip="Attendance Date">
            ${attendanceDateTime.toLocaleDateString()}
            </strong><br />
            <span class="is-size-7">${attendanceDateTime.toLocaleTimeString()}</span>
        </div>
        <div class="column">
          <strong>${afterHoursRecord.employeeName}</strong><br />
          <span class="is-size-7">${
            afterHoursRecord.employeeNumber ?? ''
          }</span>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Type">${afterHoursRecord.afterHoursReason!}</strong><br />
          <span class="is-size-7">${afterHoursRecord.recordComment ?? ''}</span>
        </div>
        </div>`

      panelElement.append(panelBlockElement)
    }

    containerElement.innerHTML = ''
    containerElement.append(panelElement)

    document.querySelector(
      '#menu--attendance a[href="#tab--afterHours"] .tag'
    )!.textContent = todayCount.toString()
  }

  document
    .querySelector('.is-new-after-hours-button')
    ?.addEventListener('click', () => {
      let afterHoursModalElement: HTMLElement
      let afterHoursCloseModalFunction: () => void

      let previousEmployeeNumberPiece = ''

      function populateEmployeeName(): void {
        const employeeNumberElement = afterHoursModalElement.querySelector(
          '#afterHoursAdd--employeeNumber'
        ) as HTMLInputElement

        const employeeNumberPiece = employeeNumberElement.value.toLowerCase()

        if (employeeNumberPiece === previousEmployeeNumberPiece) {
          return
        }

        previousEmployeeNumberPiece = employeeNumberPiece

        const employeeNameElement = afterHoursModalElement.querySelector(
          '#afterHoursAdd--employeeName'
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

      function recordAfterHours(formEvent: SubmitEvent): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          MonTY.urlPrefix + '/attendance/doAddAfterHoursRecord',
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              success: boolean
              recordId?: string
              afterHoursRecords?: recordTypes.AfterHoursRecord[]
            }

            if (responseJSON.success) {
              afterHoursCloseModalFunction()

              bulmaJS.alert({
                message: 'After hours attendance recorded successfully.'
              })

              afterHoursRecords = responseJSON.afterHoursRecords!
              renderAfterHoursRecords()
            }
          }
        )
      }

      cityssm.openHtmlModal('afterHours-add', {
        onshow(modalElement) {
          afterHoursModalElement = modalElement

          const afterHoursReasonElement = modalElement.querySelector(
            '#afterHoursAdd--afterHoursReasonId'
          ) as HTMLSelectElement

          for (const reason of afterHoursReasons) {
            const optionElement = document.createElement('option')
            optionElement.value = reason.afterHoursReasonId.toString()
            optionElement.textContent = reason.afterHoursReason
            afterHoursReasonElement.append(optionElement)
          }
        },
        onshown(modalElement, closeModalFunction) {
          afterHoursCloseModalFunction = closeModalFunction

          bulmaJS.toggleHtmlClipped()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', recordAfterHours)

          modalElement
            .querySelector('#afterHoursAdd--employeeNumber')
            ?.addEventListener('keyup', populateEmployeeName)
        },
        onremoved() {
          bulmaJS.toggleHtmlClipped()
        }
      })
    })

  renderAfterHoursRecords()
})()
