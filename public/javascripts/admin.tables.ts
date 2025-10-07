import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { DoAddAbsenceTypeResponse } from '../../handlers/admin-post/doAddAbsenceType.js'
import type { DoAddAfterHoursReasonResponse } from '../../handlers/admin-post/doAddAfterHoursReason.js'
import type { DoAddCallOutResponseTypeResponse } from '../../handlers/admin-post/doAddCallOutResponseType.js'
import type { DoDeleteAbsenceTypeResponse } from '../../handlers/admin-post/doDeleteAbsenceType.js'
import type { DoDeleteAfterHoursReasonResponse } from '../../handlers/admin-post/doDeleteAfterHoursReason.js'
import type { DoDeleteCallOutResponseTypeResponse } from '../../handlers/admin-post/doDeleteCallOutResponseType.js'
import type { DoMoveAbsenceTypeResponse } from '../../handlers/admin-post/doMoveAbsenceType.js'
import type { DoMoveAfterHoursReasonResponse } from '../../handlers/admin-post/doMoveAfterHoursReason.js'
import type { DoMoveCallOutResponseTypeResponse } from '../../handlers/admin-post/doMoveCallOutResponseType.js'
import type { DoUpdateAbsenceTypeResponse } from '../../handlers/admin-post/doUpdateAbsenceType.js'
import type { DoUpdateAfterHoursReasonResponse } from '../../handlers/admin-post/doUpdateAfterHoursReason.js'
import type { DoUpdateCallOutResponseTypeResponse } from '../../handlers/admin-post/doUpdateCallOutResponseType.js'
import type { Attend as AttendGlobal } from '../../types/globalTypes.js'
import type {
  AbsenceType,
  AfterHoursReason,
  CallOutResponseType
} from '../../types/recordTypes.js'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const Attend = exports.Attend as AttendGlobal

  const updateButtonClassName = 'is-update-button'
  const upButtonClassName = 'is-up-button'
  const downButtonClassName = 'is-down-button'
  const deleteButtonClassName = 'is-delete-button'

  function setRowBackgroundColor(changeEvent: Event): void {
    // eslint-disable-next-line no-extra-semi
    ;(
      (changeEvent.currentTarget as HTMLElement).closest(
        'tr'
      ) as HTMLTableRowElement
    ).classList.add('has-background-warning-light')
  }

  /*
   * Absence Types
   */

  let absenceTypes = exports.absenceTypes as AbsenceType[]
  delete exports.absenceTypes

  function updateAbsenceType(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    const absenceTypeKey = rowElement.dataset.absenceTypeKey
    const absenceType = (rowElement.querySelector('input') as HTMLInputElement)
      .value

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/doUpdateAbsenceType`,
      {
        absenceTypeKey,
        absenceType
      },
      (rawResponseJSON) => {
        const responseJSON =
          rawResponseJSON as unknown as DoUpdateAbsenceTypeResponse

        if (responseJSON.success) {
          bulmaJS.alert({
            message: 'Absence type updated successfully.'
          })

          rowElement.classList.remove('has-background-warning-light')
        }
      }
    )
  }

  function moveAbsenceType(clickEvent: MouseEvent): void {
    const buttonElement = clickEvent.currentTarget as HTMLButtonElement

    const tableRowElement = buttonElement.closest('tr') as HTMLTableRowElement

    const absenceTypeKey = tableRowElement.dataset.absenceTypeKey

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/${
        buttonElement.dataset.direction === 'up'
          ? 'doMoveAbsenceTypeUp'
          : 'doMoveAbsenceTypeDown'
      }`,
      {
        absenceTypeKey,
        moveToEnd: clickEvent.shiftKey ? '1' : '0'
      },
      (rawResponseJSON) => {
        const responseJSON =
          rawResponseJSON as unknown as DoMoveAbsenceTypeResponse

        if (responseJSON.success) {
          absenceTypes = responseJSON.absenceTypes
          renderAbsenceTypes()
        } else {
          bulmaJS.alert({
            title: 'Error Moving Absence Type',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  function deleteAbsenceType(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    const absenceTypeKey = rowElement.dataset.absenceTypeKey

    function doDelete(): void {
      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doDeleteAbsenceType`,
        {
          absenceTypeKey
        },
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoDeleteAbsenceTypeResponse

          if (responseJSON.success) {
            absenceTypes = responseJSON.absenceTypes
            renderAbsenceTypes()
          } else {
            bulmaJS.alert({
              title: 'Error Deleting Absence Type',
              message: 'Please try again.',
              contextualColorName: 'danger'
            })
          }
        }
      )
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

    containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fade-hoverable is-fullwidth">
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

    const tableBodyElement = containerElement.querySelector(
      'tbody'
    ) as HTMLTableSectionElement

    for (const absenceType of absenceTypes) {
      const rowElement = document.createElement('tr')
      rowElement.dataset.absenceTypeKey = absenceType.absenceTypeKey

      rowElement.innerHTML = `<td>
        <input class="input" name="absenceType" maxlength="100" aria-label="Absence Type" required />
        </td>
        <td>
          <button class="button is-success ${updateButtonClassName}" data-cy="save" type="button" aria-label="Update Absence Type">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button ${upButtonClassName}" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button ${downButtonClassName}" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger ${deleteButtonClassName}" data-cy="delete" type="button" aria-label="Delete Absence Type">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`

      const inputElement = rowElement.querySelector('input') as HTMLInputElement

      inputElement.value = absenceType.absenceType

      inputElement.addEventListener('change', setRowBackgroundColor)

      rowElement
        .getElementsByClassName(updateButtonClassName)[0]
        .addEventListener('click', updateAbsenceType)
      ;(
        rowElement.getElementsByClassName(
          upButtonClassName
        )[0] as HTMLButtonElement
      ).addEventListener('click', moveAbsenceType)
      ;(
        rowElement.getElementsByClassName(
          downButtonClassName
        )[0] as HTMLButtonElement
      ).addEventListener('click', moveAbsenceType)

      rowElement
        .getElementsByClassName(deleteButtonClassName)[0]
        .addEventListener('click', deleteAbsenceType)

      tableBodyElement.append(rowElement)
    }
  }

  document
    .querySelector('#tab--absenceTypes .is-add-button')
    ?.addEventListener('click', () => {
      let addCloseModalFunction: () => void

      function addAbsenceType(formEvent: SubmitEvent): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doAddAbsenceType`,
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoAddAbsenceTypeResponse

            if (responseJSON.success) {
              addCloseModalFunction()

              bulmaJS.alert({
                message: 'Absence type added successfully.',
                contextualColorName: 'success'
              })

              absenceTypes = responseJSON.absenceTypes
              renderAbsenceTypes()
            } else {
              bulmaJS.alert({
                title: 'Error Adding Absence Type',
                message: 'Please try again.',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      cityssm.openHtmlModal('tableAdmin-addAbsenceType', {
        onshown(modalElement, closeModalFunction) {
          bulmaJS.toggleHtmlClipped()
          addCloseModalFunction = closeModalFunction

          modalElement.querySelector('input')?.focus()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', addAbsenceType)
        },
        onremoved() {
          bulmaJS.toggleHtmlClipped()
        }
      })
    })

  renderAbsenceTypes()

  /*
   * Call Out Response Types
   */

  let callOutResponseTypes =
    exports.callOutResponseTypes as CallOutResponseType[]
  delete exports.callOutResponseTypes

  function updateCallOutResponseType(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    const responseTypeId = rowElement.dataset.responseTypeId

    const responseType = (rowElement.querySelector('input') as HTMLInputElement)
      .value

    const isSuccessful = (
      rowElement.querySelector('select') as HTMLSelectElement
    ).value

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/doUpdateCallOutResponseType`,
      {
        responseTypeId,
        responseType,
        isSuccessful
      },
      (rawResponseJSON) => {
        const responseJSON =
          rawResponseJSON as unknown as DoUpdateCallOutResponseTypeResponse

        if (responseJSON.success) {
          bulmaJS.alert({
            message: 'Response type updated successfully.'
          })

          rowElement.classList.remove('has-background-warning-light')
        }
      }
    )
  }

  function moveCallOutResponseType(clickEvent: MouseEvent): void {
    const buttonElement = clickEvent.currentTarget as HTMLButtonElement

    const tableRowElement = buttonElement.closest('tr') as HTMLTableRowElement

    const responseTypeId = tableRowElement.dataset.responseTypeId

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/${
        buttonElement.dataset.direction === 'up'
          ? 'doMoveCallOutResponseTypeUp'
          : 'doMoveCallOutResponseTypeDown'
      }`,
      {
        responseTypeId,
        moveToEnd: clickEvent.shiftKey ? '1' : '0'
      },
      (rawResponseJSON) => {
        const responseJSON =
          rawResponseJSON as unknown as DoMoveCallOutResponseTypeResponse

        if (responseJSON.success) {
          callOutResponseTypes = responseJSON.callOutResponseTypes
          renderCallOutResponseTypes()
        } else {
          bulmaJS.alert({
            title: 'Error Moving Response Type',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  function deleteCallOutResponseType(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    const responseTypeId = rowElement.dataset.responseTypeId

    function doDelete(): void {
      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doDeleteCallOutResponseType`,
        {
          responseTypeId
        },
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoDeleteCallOutResponseTypeResponse

          if (responseJSON.success) {
            callOutResponseTypes = responseJSON.callOutResponseTypes
            renderCallOutResponseTypes()
          } else {
            bulmaJS.alert({
              title: 'Error Deleting Response Type',
              message: 'Please try again.',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    bulmaJS.confirm({
      title: 'Delete Response Type',
      message: 'Are you sure you want to delete this response type?',
      contextualColorName: 'warning',
      okButton: {
        text: 'Yes, Delete Response Type',
        callbackFunction: doDelete
      }
    })
  }

  function renderCallOutResponseTypes(): void {
    const containerElement = document.querySelector(
      '#container--callOutResponseTypes'
    ) as HTMLElement

    if (absenceTypes.length === 0) {
      containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active response types.</p>
        </div>`

      return
    }

    containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fade-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Response Type</th>
          <th>Is Successful</th>
          <th class="has-width-1">
            <span class="is-sr-only">Update Response Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Move Response Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Delete Response Type</span>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
      </table>`

    const tableBodyElement = containerElement.querySelector(
      'tbody'
    ) as HTMLTableSectionElement

    for (const callOutResponseType of callOutResponseTypes) {
      const rowElement = document.createElement('tr')
      rowElement.dataset.responseTypeId =
        callOutResponseType.responseTypeId.toString()

      rowElement.innerHTML = `<td>
        <input class="input" name="responseType" maxlength="100" aria-label="Call Out Response Type" required />
        </td>
        <td>
          <div class="select is-fullwidth">
            <select name="isSuccessful" aria-label="Is Successful" required>
              <option value="1">Successful</option>
              <option value="0">Unsuccessful</option>
            </select>
          </div>
        </td>
        <td>
          <button class="button is-success ${updateButtonClassName}" data-cy="save" type="button" aria-label="Update Response Type">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button ${upButtonClassName}" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button ${downButtonClassName}" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger ${deleteButtonClassName}" data-cy="delete" type="button" aria-label="Delete Response Type">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`

      const inputElement = rowElement.querySelector('input') as HTMLInputElement

      inputElement.value = callOutResponseType.responseType

      inputElement.addEventListener('change', setRowBackgroundColor)

      rowElement
        .querySelector('select')
        ?.addEventListener('change', setRowBackgroundColor)

      if (!(callOutResponseType.isSuccessful as boolean)) {
        // eslint-disable-next-line no-extra-semi
        ;(rowElement.querySelector('select') as HTMLSelectElement).value = '0'
      }

      rowElement
        .getElementsByClassName(updateButtonClassName)[0]
        .addEventListener('click', updateCallOutResponseType)
      ;(
        rowElement.getElementsByClassName(
          upButtonClassName
        )[0] as HTMLButtonElement
      ).addEventListener('click', moveCallOutResponseType)
      ;(
        rowElement.getElementsByClassName(
          downButtonClassName
        )[0] as HTMLButtonElement
      ).addEventListener('click', moveCallOutResponseType)

      rowElement
        .getElementsByClassName(deleteButtonClassName)[0]
        .addEventListener('click', deleteCallOutResponseType)

      tableBodyElement.append(rowElement)
    }
  }

  document
    .querySelector('#tab--callOutResponseTypes .is-add-button')
    ?.addEventListener('click', () => {
      let addCloseModalFunction: () => void

      function addCallOutResponseType(formEvent: SubmitEvent): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doAddCallOutResponseType`,
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoAddCallOutResponseTypeResponse

            if (responseJSON.success) {
              addCloseModalFunction()

              bulmaJS.alert({
                message: 'Response type added successfully.',
                contextualColorName: 'success'
              })

              callOutResponseTypes = responseJSON.callOutResponseTypes
              renderCallOutResponseTypes()
            } else {
              bulmaJS.alert({
                title: 'Error Adding Response Type',
                message: 'Please try again.',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      cityssm.openHtmlModal('tableAdmin-addCallOutResponseType', {
        onshown(modalElement, closeModalFunction) {
          bulmaJS.toggleHtmlClipped()
          addCloseModalFunction = closeModalFunction

          modalElement.querySelector('input')?.focus()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', addCallOutResponseType)
        },
        onremoved() {
          bulmaJS.toggleHtmlClipped()
        }
      })
    })

  renderCallOutResponseTypes()

  /*
   * After Hours Reasons
   */

  let afterHoursReasons = exports.afterHoursReasons as AfterHoursReason[]
  delete exports.afterHoursReasons

  function updateAfterHoursReason(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    const afterHoursReasonId = rowElement.dataset.afterHoursReasonId
    const afterHoursReason = (
      rowElement.querySelector('input') as HTMLInputElement
    ).value

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/doUpdateAfterHoursReason`,
      {
        afterHoursReasonId,
        afterHoursReason
      },
      (rawResponseJSON) => {
        const responseJSON =
          rawResponseJSON as unknown as DoUpdateAfterHoursReasonResponse

        if (responseJSON.success) {
          bulmaJS.alert({
            message: 'Reason updated successfully.'
          })

          rowElement.classList.remove('has-background-warning-light')
        }
      }
    )
  }

  function moveAfterHoursReason(clickEvent: MouseEvent): void {
    const buttonElement = clickEvent.currentTarget as HTMLButtonElement

    const tableRowElement = buttonElement.closest('tr') as HTMLTableRowElement

    const afterHoursReasonId = tableRowElement.dataset.afterHoursReasonId

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/${
        buttonElement.dataset.direction === 'up'
          ? 'doMoveAfterHoursReasonUp'
          : 'doMoveAfterHoursReasonDown'
      }`,
      {
        afterHoursReasonId,
        moveToEnd: clickEvent.shiftKey ? '1' : '0'
      },
      (rawResponseJSON) => {
        const responseJSON =
          rawResponseJSON as unknown as DoMoveAfterHoursReasonResponse

        if (responseJSON.success) {
          afterHoursReasons = responseJSON.afterHoursReasons
          renderAfterHoursReasons()
        } else {
          bulmaJS.alert({
            title: 'Error Moving Reason',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  function deleteAfterHoursReason(clickEvent: Event): void {
    const rowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    const afterHoursReasonId = rowElement.dataset.afterHoursReasonId

    function doDelete(): void {
      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doDeleteAfterHoursReason`,
        {
          afterHoursReasonId
        },
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoDeleteAfterHoursReasonResponse

          if (responseJSON.success) {
            afterHoursReasons = responseJSON.afterHoursReasons
            renderAfterHoursReasons()
          } else {
            bulmaJS.alert({
              title: 'Error Deleting Reason',
              message: 'Please try again.',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    bulmaJS.confirm({
      title: 'Delete Reason',
      message: 'Are you sure you want to delete this after hours reason?',
      contextualColorName: 'warning',
      okButton: {
        text: 'Yes, Delete Reason',
        callbackFunction: doDelete
      }
    })
  }

  function renderAfterHoursReasons(): void {
    const containerElement = document.querySelector(
      '#container--afterHoursReasons'
    ) as HTMLElement

    if (absenceTypes.length === 0) {
      containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active active hours reasons.</p>
        </div>`

      return
    }

    containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fade-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Reason</th>
          <th class="has-width-1">
            <span class="is-sr-only">Update Reason</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Move Reason</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Delete Reason</span>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
      </table>`

    const tableBodyElement = containerElement.querySelector(
      'tbody'
    ) as HTMLTableSectionElement

    for (const afterHoursReason of afterHoursReasons) {
      const rowElement = document.createElement('tr')
      rowElement.dataset.afterHoursReasonId =
        afterHoursReason.afterHoursReasonId.toString()

      rowElement.innerHTML = `<td>
        <input class="input" name="afterHoursReason" maxlength="100" aria-label="After Hours Reason" required />
        </td>
        <td>
          <button class="button is-success ${updateButtonClassName}" data-cy="save" type="button" aria-label="Update Reason">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button ${upButtonClassName}" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button ${downButtonClassName}" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger ${deleteButtonClassName}" data-cy="delete" type="button" aria-label="Delete Reason">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`

      const inputElement = rowElement.querySelector('input') as HTMLInputElement

      inputElement.value = afterHoursReason.afterHoursReason

      inputElement.addEventListener('change', setRowBackgroundColor)

      rowElement
        .getElementsByClassName(updateButtonClassName)[0]
        .addEventListener('click', updateAfterHoursReason)
      ;(
        rowElement.getElementsByClassName(
          upButtonClassName
        )[0] as HTMLButtonElement
      ).addEventListener('click', moveAfterHoursReason)
      ;(
        rowElement.getElementsByClassName(
          downButtonClassName
        )[0] as HTMLButtonElement
      ).addEventListener('click', moveAfterHoursReason)

      rowElement
        .getElementsByClassName(deleteButtonClassName)[0]
        .addEventListener('click', deleteAfterHoursReason)

      tableBodyElement.append(rowElement)
    }
  }

  document
    .querySelector('#tab--afterHoursReasons .is-add-button')
    ?.addEventListener('click', () => {
      let addCloseModalFunction: () => void

      function addAfterHoursReason(formEvent: SubmitEvent): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doAddAfterHoursReason`,
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoAddAfterHoursReasonResponse

            if (responseJSON.success) {
              addCloseModalFunction()

              bulmaJS.alert({
                message: 'Reason added successfully.',
                contextualColorName: 'success'
              })

              afterHoursReasons = responseJSON.afterHoursReasons
              renderAfterHoursReasons()
            } else {
              bulmaJS.alert({
                title: 'Error Adding Reason',
                message: 'Please try again.',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      cityssm.openHtmlModal('tableAdmin-addAfterHoursReason', {
        onshown(modalElement, closeModalFunction) {
          bulmaJS.toggleHtmlClipped()
          addCloseModalFunction = closeModalFunction

          modalElement.querySelector('input')?.focus()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', addAfterHoursReason)
        },
        onremoved() {
          bulmaJS.toggleHtmlClipped()
        }
      })
    })

  renderAfterHoursReasons()
})()
