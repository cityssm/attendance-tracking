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

  interface AbsenceResponseJSON {
    success: boolean
    errorMessage?: string
    absenceTypes?: recordTypes.AbsenceType[]
  }

  let absenceTypes = exports.absenceTypes as recordTypes.AbsenceType[]
  delete exports.absenceTypes

  function updateAbsenceType(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest('tr')!

    const absenceTypeKey = rowElement.dataset.absenceTypeKey
    const absenceType = rowElement.querySelector('input')!.value

    cityssm.postJSON(
      MonTY.urlPrefix + '/admin/doUpdateAbsenceType',
      {
        absenceTypeKey,
        absenceType
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as unknown as AbsenceResponseJSON

        if (responseJSON.success) {
          bulmaJS.alert({
            message: 'Absence type updated successfully.'
          })
        }
      }
    )
  }

  function moveAbsenceType(clickEvent: MouseEvent): void {
    const buttonElement = clickEvent.currentTarget as HTMLButtonElement

    const tableRowElement = buttonElement.closest('tr')!

    const absenceTypeKey = tableRowElement.dataset.absenceTypeKey

    cityssm.postJSON(
      MonTY.urlPrefix +
        '/admin/' +
        (buttonElement.dataset.direction === 'up'
          ? 'doMoveAbsenceTypeUp'
          : 'doMoveAbsenceTypeDown'),
      {
        absenceTypeKey,
        moveToEnd: clickEvent.shiftKey ? '1' : '0'
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as unknown as AbsenceResponseJSON

        if (responseJSON.success) {
          absenceTypes = responseJSON.absenceTypes!
          renderAbsenceTypes()
        } else {
          bulmaJS.alert({
            title: 'Error Moving Absence Type',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  function deleteAbsenceType(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest('tr')!

    const absenceTypeKey = rowElement.dataset.absenceTypeKey

    function doDelete(): void {
      cityssm.postJSON(MonTY.urlPrefix + '/admin/doDeleteAbsenceType', {
        absenceTypeKey
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as unknown as AbsenceResponseJSON

        if (responseJSON.success) {
          absenceTypes = responseJSON.absenceTypes!
          renderAbsenceTypes()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Absence Type',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      })
    }

    bulmaJS.confirm({
      title: 'Delete Absence Type',
      message: 'Are you sure you want to delete this absence type?',
      contextualColorName: 'warning',
      okButton: {
        text: 'Yes, Delete Absence Type',
        callbackFunction: doDelete
      }
    })
  }

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
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button is-up-button" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button is-down-button" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger is-delete-button" type="button" aria-label="Delete Absence Type">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`

      rowElement.querySelector('input')!.value = absenceType.absenceType

      rowElement
        .querySelector('.is-update-button')
        ?.addEventListener('click', updateAbsenceType)
      ;(
        rowElement.querySelector('.is-up-button') as HTMLButtonElement
      ).addEventListener('click', moveAbsenceType)
      ;(
        rowElement.querySelector('.is-down-button') as HTMLButtonElement
      ).addEventListener('click', moveAbsenceType)

      rowElement
        .querySelector('.is-delete-button')
        ?.addEventListener('click', deleteAbsenceType)

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
