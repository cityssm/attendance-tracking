/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
import type { BulmaJS } from '@cityssm/bulma-js/types'

import type * as recordTypes from '../types/recordTypes'
declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  /*
   * Absence Types
   */

  let absenceTypes = exports.absenceTypes as recordTypes.AbsenceType[]
  delete exports.absenceTypes

  function renderAbsenceTypes(): void {
    const containerElement = document.querySelector(
      '#container--absenceTypes'
    ) as HTMLElement

    if (absenceTypes.length === 0) {
      containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active absence types.</p>
        </div>`

      return
    }

    containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Absence Type</th>
          <th class="has-width-1">
            <span class="is-sr-only">Update Absence Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Move Absence Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Delete Absence Type</span>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
      </table>`

    const tableBodyElement = containerElement.querySelector('tbody')!

    for (const absenceType of absenceTypes) {
      const rowElement = document.createElement('tr')
      rowElement.dataset.absenceTypeKey = absenceType.absenceTypeKey

      rowElement.innerHTML = `<td>
        <input class="input" name="absenceType" maxlength="100" required />
        </td>
        <td>
          <button class="button is-success is-update-button" type="button" aria-label="Update Absence Type">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>`

      rowElement.querySelector('input')!.value = absenceType.absenceType

      tableBodyElement.append(rowElement)
    }
  }

  renderAbsenceTypes()

  /*
   * Call Out Response Types
   */

  let callOutResponseTypes =
    exports.callOutResponseTypes as recordTypes.CallOutResponseType[]
  delete exports.callOutResponseTypes
})()
