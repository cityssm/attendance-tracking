/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

declare const bulmaJS: BulmaJS
declare const cityssm: cityssmGlobal
;(() => {
  const urlPrefix = exports.urlPrefix as string

  // Employee Tab

  const employeeMessageContainerElement = document.querySelector(
    '#employee--message'
  ) as HTMLElement

  const employeeNumberElement = document.querySelector(
    '#employee--employeeNumber'
  ) as HTMLInputElement

  function employeeKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      validateEmployee()
    } else if (event.key !== 'Shift' && event.key !== 'Tab') {
      employeeMessageContainerElement.innerHTML = ''
    }
  }

  employeeNumberElement.addEventListener('keyup', employeeKeyUp)

  const employeeHomeContactLastFourDigitsElement = document.querySelector(
    '#employee--homeContact_lastFourDigits'
  ) as HTMLInputElement

  employeeHomeContactLastFourDigitsElement.addEventListener(
    'keyup',
    employeeKeyUp
  )

  function validateEmployee(): void {
    employeeMessageContainerElement.innerHTML = `<p class="has-text-centered">
      <i class="fas fa-4x fa-cog fa-spin" aria-hidden="true"></i><br />
      <em>Loading employee...</em>
      </p>`

    if (!employeeNumberElement.checkValidity()) {
      employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
        <p class="message-body">
        Please enter a valid <strong>Employee Number</strong>.
        </p>
        </div>`

      employeeNumberElement.focus()

      return
    }

    if (!employeeHomeContactLastFourDigitsElement.checkValidity()) {
      employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
        <p class="message-body">
        Please enter a valid <strong>Last Four Digits</strong>.
        </p>
        </div>`

      employeeHomeContactLastFourDigitsElement.focus()

      return
    }

    cityssm.postJSON(
      urlPrefix + '/doValidateEmployee',
      {
        employeeNumber: employeeNumberElement.value,
        employeeHomeContactLastFourDigits:
          employeeHomeContactLastFourDigitsElement.value
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          employeeName?: string
        }

        if (responseJSON.success) {
          employeeMessageContainerElement.innerHTML = ''
          document.querySelector('#tab--employee')?.classList.add('is-hidden')

          document.querySelector(
            '#employeeOptions--employeeName'
          )!.textContent = responseJSON.employeeName ?? ''

          document
            .querySelector('#tab--employeeOptions')
            ?.classList.remove('is-hidden')
        } else {
          employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
            <p class="message-body">
            <strong>${responseJSON.errorMessage ?? ''}</strong><br />
            If errors persist, please contact a manager for assistance.</p>
            </div>`
        }
      }
    )
  }

  document
    .querySelector('#employee--nextButton')
    ?.addEventListener('click', validateEmployee)

  // Select Employee Option

  // Call Out List Add
})()
