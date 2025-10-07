// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { DoAddEmployeeResponse } from '../../handlers/admin-post/doAddEmployee.js'
import type { DoDeleteEmployeeResponse } from '../../handlers/admin-post/doDeleteEmployee.js'
import type { DoGetEmployeePropertiesResponse } from '../../handlers/admin-post/doGetEmployeeProperties.js'
import type { DoModifyEmployeePropertyResponse } from '../../handlers/admin-post/doModifyEmployeeProperty.js'
import type { DoUpdateEmployeeResponse } from '../../handlers/admin-post/doUpdateEmployee.js'
import type { Attend as AttendGlobal } from '../../types/globalTypes.js'
import type { Employee, EmployeeProperty } from '../../types/recordTypes.js'
declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const Attend = exports.Attend as AttendGlobal

  let unfilteredEmployees = exports.employees as Employee[]
  delete exports.employees

  let filteredEmployees = unfilteredEmployees

  const employeeNumberRegularExpression =
    exports.employeeNumberRegularExpression as RegExp | undefined

  // Employee Modal

  const selfServiceEnabled = exports.selfService as boolean

  function swapFields(clickEvent: Event): void {
    clickEvent.preventDefault()

    const inputElements = (clickEvent.currentTarget as HTMLElement)
      .closest('.columns')
      ?.querySelectorAll('input') as NodeListOf<HTMLInputElement>

    if (inputElements.length !== 2) {
      return
    }

    const value = inputElements.item(0).value
    inputElements.item(0).value = inputElements.item(1).value
    inputElements.item(1).value = value
  }

  function openEmployeeModal(employeeNumber: string): void {
    let employeeModalElement: HTMLElement
    let closeEmployeeModalFunction: () => void

    const employee = unfilteredEmployees.find(
      (possibleEmployee) => possibleEmployee.employeeNumber === employeeNumber
    ) as Employee

    let employeeProperties: EmployeeProperty[] = []

    function updateEmployeeProperty(clickEvent: Event): void {
      const rowElement = (clickEvent.currentTarget as HTMLElement).closest('tr')

      const propertyName = rowElement?.dataset.propertyName
      const propertyValue = rowElement?.querySelector('input')?.value
      const isSynced = rowElement?.querySelector('select')?.value

      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doUpdateEmployeeProperty`,
        {
          employeeNumber,
          propertyName,
          propertyValue,
          isSynced
        },
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoModifyEmployeePropertyResponse

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Property updated successfully.',
              contextualColorName: 'success'
            })

            employeeProperties = responseJSON.employeeProperties
          }
        }
      )
    }

    function deleteEmployeeProperty(clickEvent: Event): void {
      const rowElement = (clickEvent.currentTarget as HTMLElement).closest('tr')

      function doDelete(): void {
        const propertyName = rowElement?.dataset.propertyName
        const propertyValue = rowElement?.querySelector('input')?.value
        const isSynced = rowElement?.querySelector('select')?.value

        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doDeleteEmployeeProperty`,
          {
            employeeNumber,
            propertyName,
            propertyValue,
            isSynced
          },
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoModifyEmployeePropertyResponse

            if (responseJSON.success) {
              bulmaJS.alert({
                message: 'Property deleted successfully.',
                contextualColorName: 'success'
              })

              employeeProperties = responseJSON.employeeProperties
              rowElement?.remove()
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Delete Employee Property',
        message: 'Are you sure you want to remove this employee property?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Delete Property',
          callbackFunction: doDelete
        }
      })
    }

    function renderEmployeeProperties(): void {
      const tbodyElement = employeeModalElement.querySelector(
        '#employeePropertyTab--current tbody'
      ) as HTMLTableSectionElement

      tbodyElement.innerHTML = ''

      for (const employeeProperty of employeeProperties) {
        const rowElement = document.createElement('tr')
        rowElement.dataset.propertyName = employeeProperty.propertyName

        rowElement.innerHTML = `<td class="is-size-7 is-vcentered">
          ${cityssm.escapeHTML(employeeProperty.propertyName)}
          </td>
          <td>
            <div class="control">
              <input class="input is-small" name="propertyValue" type="text" maxlength="500" />
            </div>
          </td>
          <td>
            <div class="control">
            <div class="select is-small is-fullwidth">
              <select name="isSynced">
                <option value="1">Synced</option>
                <option value="0">Not Synced</option>
              </select>
            </div>
            </div>
          </td>
          <td class="has-text-right">
          <div class="field is-grouped is-justify-content-flex-end">
            <div class="control">
            <button class="button is-update-button is-success is-small" data-tooltip="Save" type="button" aria-label="Save">
              <i class="fas fa-save" aria-hidden="true"></i>
            </button>
            </div>
            <div class="control">
            <button class="button is-delete-button is-danger is-small" data-tooltip="Delete" type="button" aria-label="Delete">
              <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
            </div>
          </div>
          </td>`
        ;(rowElement.querySelector('input') as HTMLInputElement).value =
          employeeProperty.propertyValue
        ;(rowElement.querySelector('select') as HTMLSelectElement).value =
          (employeeProperty.isSynced as boolean) ? '1' : '0'

        rowElement
          .querySelector('.is-update-button')
          ?.addEventListener('click', updateEmployeeProperty)

        rowElement
          .querySelector('.is-delete-button')
          ?.addEventListener('click', deleteEmployeeProperty)

        tbodyElement.append(rowElement)
      }
    }

    function addEmployeeProperty(formEvent: Event): void {
      formEvent.preventDefault()

      const addPropertyFormElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doAddEmployeeProperty`,
        addPropertyFormElement,
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoModifyEmployeePropertyResponse

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Property added successfully.',
              contextualColorName: 'success',
              okButton: {
                callbackFunction() {
                  ;(
                    employeeModalElement.querySelector(
                      '#employeePropertyAdd--propertyName'
                    ) as HTMLInputElement
                  ).focus()
                }
              }
            })

            addPropertyFormElement.reset()

            employeeProperties = responseJSON.employeeProperties ?? []
            renderEmployeeProperties()
          } else {
            bulmaJS.alert({
              contextualColorName: 'danger',
              title: 'Error Adding Property',

              message:
                'The property may already be set. Please check, then try again.'
            })
          }
        }
      )
    }

    function updateEmployee(formEvent: Event): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doUpdateEmployee`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoUpdateEmployeeResponse

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Employee updated successfully.',
              contextualColorName: 'success'
            })

            unfilteredEmployees = responseJSON.employees
            refreshFilteredEmployees()
          }
        }
      )
    }

    function deleteEmployee(clickEvent: Event): void {
      clickEvent.preventDefault()

      function doDelete(): void {
        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doDeleteEmployee`,
          {
            employeeNumber
          },
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoDeleteEmployeeResponse
            if (responseJSON.success) {
              closeEmployeeModalFunction()

              bulmaJS.alert({
                message: 'Employee deleted successfully',
                contextualColorName: 'info'
              })

              unfilteredEmployees = responseJSON.employees
              refreshFilteredEmployees()
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Delete Employee',
        message: `Are you sure you want to delete this employee?<br />
          Note that if the employee is found in a subsequent syncing process, they may be restored.`,
        messageIsHtml: true,
        contextualColorName: 'warning',
        okButton: {
          callbackFunction: doDelete,
          text: 'Yes, Delete Employee'
        }
      })
    }

    cityssm.openHtmlModal('employeeAdmin-employee', {
      onshow(modalElement) {
        employeeModalElement = modalElement
        ;(
          modalElement.querySelector('.modal-card-title') as HTMLElement
        ).textContent =
          `${employee.employeeSurname}, ${employee.employeeGivenName}`
        ;(
          modalElement.querySelector(
            '#employeeEdit--employeeNumber'
          ) as HTMLInputElement
        ).value = employee.employeeNumber
        ;(
          modalElement.querySelector(
            '#employeeEdit--employeeNumberSpan'
          ) as HTMLElement
        ).textContent = employee.employeeNumber
        ;(
          modalElement.querySelector(
            '#employeeEdit--isActive'
          ) as HTMLSelectElement
        ).value = employee.isActive ? '1' : '0'

        // Main Details
        ;(
          modalElement.querySelector(
            '#employeeEdit--isSynced'
          ) as HTMLSelectElement
        ).value = employee.isSynced ? '1' : '0'
        ;(
          modalElement.querySelector(
            '#employeeEdit--employeeSurname'
          ) as HTMLInputElement
        ).value = employee.employeeSurname
        ;(
          modalElement.querySelector(
            '#employeeEdit--employeeGivenName'
          ) as HTMLInputElement
        ).value = employee.employeeGivenName
        ;(
          modalElement.querySelector(
            '#employeeEdit--jobTitle'
          ) as HTMLInputElement
        ).value = employee.jobTitle ?? ''
        ;(
          modalElement.querySelector(
            '#employeeEdit--userName'
          ) as HTMLInputElement
        ).value = employee.userName ?? ''
        ;(
          modalElement.querySelector(
            '#employeeEdit--department'
          ) as HTMLInputElement
        ).value = employee.department ?? ''

        if ((employee.seniorityDateTime ?? '') !== '') {
          // eslint-disable-next-line no-extra-semi
          ;(
            modalElement.querySelector(
              '#employeeEdit--seniorityDateTime'
            ) as HTMLInputElement
          ).valueAsDate = new Date(employee.seniorityDateTime as string)
        }

        // Contact Information
        // eslint-disable-next-line no-extra-semi
        ;(
          modalElement.querySelector(
            '#employeeEdit--syncContacts'
          ) as HTMLSelectElement
        ).value = employee.syncContacts ? '1' : '0'
        ;(
          modalElement.querySelector(
            '#employeeEdit--workContact1'
          ) as HTMLInputElement
        ).value = employee.workContact1 ?? ''
        ;(
          modalElement.querySelector(
            '#employeeEdit--workContact2'
          ) as HTMLInputElement
        ).value = employee.workContact2 ?? ''

        if (selfServiceEnabled) {
          modalElement
            .querySelector('.is-self-service-message')
            ?.classList.remove('is-hidden')
        }

        ;(
          modalElement.querySelector(
            '#employeeEdit--homeContact1'
          ) as HTMLInputElement
        ).value = employee.homeContact1 ?? ''
        ;(
          modalElement.querySelector(
            '#employeeEdit--homeContact2'
          ) as HTMLInputElement
        ).value = employee.homeContact2 ?? ''

        // Properties
        ;(
          modalElement.querySelector(
            '#employeePropertyAdd--employeeNumber'
          ) as HTMLInputElement
        ).value = employee.employeeNumber

        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doGetEmployeeProperties`,
          {
            employeeNumber
          },
          (rawResponseJSON) => {
            employeeProperties = (
              rawResponseJSON as unknown as DoGetEmployeePropertiesResponse
            ).employeeProperties

            renderEmployeeProperties()
          }
        )
      },
      onshown(modalElement, closeModalFunction) {
        closeEmployeeModalFunction = closeModalFunction

        bulmaJS.toggleHtmlClipped()

        bulmaJS.init(modalElement)

        Attend.initializeMenuTabs(
          modalElement.querySelectorAll('.menu a'),
          modalElement.querySelectorAll('.tabs-container > article')
        )

        modalElement
          .querySelector('#form--employeeEdit')
          ?.addEventListener('submit', updateEmployee)

        const swapButtonElements =
          modalElement.querySelectorAll('.is-swap-button')

        for (const buttonElement of swapButtonElements) {
          buttonElement.addEventListener('click', swapFields)
        }

        modalElement
          .querySelector('#form--employeePropertyAdd')
          ?.addEventListener('submit', addEmployeeProperty)

        modalElement
          .querySelector('.is-delete-employee')
          ?.addEventListener('click', deleteEmployee)
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  function openEmployeeModalByClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()
    const employeeNumber = (clickEvent.currentTarget as HTMLElement).dataset
      .employeeNumber as string
    openEmployeeModal(employeeNumber)
  }

  // Add

  document
    .querySelector('#is-add-employee-button')
    ?.addEventListener('click', () => {
      let addCloseModalFunction: () => void

      function addEmployee(formEvent: Event): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doAddEmployee`,
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoAddEmployeeResponse

            if (responseJSON.success) {
              addCloseModalFunction()

              bulmaJS.alert({
                message: 'Employee added successfully.',
                okButton: {
                  callbackFunction() {
                    openEmployeeModal(responseJSON.employeeNumber)
                  }
                }
              })

              unfilteredEmployees = responseJSON.employees
              refreshFilteredEmployees()
            } else {
              bulmaJS.alert({
                title: 'Error Adding Employee',
                message:
                  'Please check to make sure that an employee does not already exist with the same employee number.',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      cityssm.openHtmlModal('employeeAdmin-addEmployee', {
        onshown(modalElement, closeModalFunction) {
          addCloseModalFunction = closeModalFunction

          bulmaJS.toggleHtmlClipped()

          const employeeNumberElement = modalElement.querySelector(
            '#employeeAdd--employeeNumber'
          ) as HTMLInputElement

          if (employeeNumberRegularExpression !== undefined) {
            employeeNumberElement.pattern =
              employeeNumberRegularExpression.source
          }

          employeeNumberElement.focus()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', addEmployee)
        },
        onremoved() {
          bulmaJS.toggleHtmlClipped()
        }
      })
    })

  // Search

  const employeeNameNumberSearchElement = document.querySelector(
    '#employeeSearch--employeeNameNumber'
  ) as HTMLInputElement
  const isActiveSearchElement = document.querySelector(
    '#employeeSearch--isActive'
  ) as HTMLSelectElement

  const employeesContainerElement = document.querySelector(
    '#container--employees'
  ) as HTMLElement

  const limit = 50
  let offset = 0

  function renderEmployees(): void {
    if (filteredEmployees.length === 0) {
      employeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no employees that meet your search criteria.</p>
        </div>`

      return
    }

    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    for (
      let index = offset;
      index < Math.min(limit + offset, filteredEmployees.length);
      index += 1
    ) {
      const employee = filteredEmployees[index]

      const panelBlockElement = document.createElement('a')
      panelBlockElement.className = 'panel-block is-block'

      if (!employee.isActive) {
        panelBlockElement.classList.add(
          'is-italic',
          'has-background-warning-light'
        )
      }

      panelBlockElement.href = '#'
      panelBlockElement.dataset.employeeNumber = employee.employeeNumber ?? ''

      panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-hard-hat" aria-hidden="true"></i>
        </div>
        <div class="column is-4">
          ${cityssm.escapeHTML(employee.employeeNumber)}
        </div>
        <div class="column">
          ${cityssm.escapeHTML(employee.employeeSurname)}, ${cityssm.escapeHTML(employee.employeeGivenName)}<br />
          <span class="is-size-7">
            ${cityssm.escapeHTML(employee.jobTitle ?? '')}
          </span>
        </div>
        </div>`

      panelBlockElement.addEventListener('click', openEmployeeModalByClick)

      panelElement.append(panelBlockElement)
    }

    employeesContainerElement.innerHTML = ''
    employeesContainerElement.append(panelElement)

    // Pager

    const pagerElement = document.createElement('div')
    pagerElement.className = 'field is-grouped is-justify-content-center'

    pagerElement.innerHTML = `<div class="control">
      <button class="button is-previous-button" data-tooltip="Previous Employees" type="button" aria-label="Previous">
        <i class="fas fa-arrow-left" aria-hidden="true"></i>
      </button>
      <button class="button is-next-button" data-tooltip="Next Employees" type="button" aria-label="Next">
        <span>Next</span>  
        <span class="icon is-small"><i class="fas fa-arrow-right" aria-hidden="true"></i></span>
      </button>
      </div>`

    if (offset === 0) {
      // eslint-disable-next-line no-extra-semi
      ;(
        pagerElement.querySelector('.is-previous-button') as HTMLButtonElement
      ).disabled = true
    } else {
      pagerElement
        .querySelector('.is-previous-button')
        ?.addEventListener('click', goToPrevious)
    }

    if (limit + offset >= filteredEmployees.length) {
      // eslint-disable-next-line no-extra-semi
      ;(
        pagerElement.querySelector('.is-next-button') as HTMLButtonElement
      ).disabled = true
    } else {
      pagerElement
        .querySelector('.is-next-button')
        ?.addEventListener('click', goToNext)
    }

    employeesContainerElement.append(pagerElement)
  }

  function goToPrevious(): void {
    offset = Math.max(offset - limit, 0)

    employeesContainerElement.scrollIntoView(true)
    window.scrollTo({ top: window.scrollY - 60 })

    renderEmployees()
  }

  function goToNext(): void {
    offset += limit
    if (offset >= filteredEmployees.length) {
      offset = 0
    }
    employeesContainerElement.scrollIntoView(true)
    window.scrollTo({ top: window.scrollY - 60 })

    renderEmployees()
  }

  function refreshFilteredEmployees(): void {
    filteredEmployees = unfilteredEmployees.filter((possibleEmployee) => {
      if (
        (isActiveSearchElement.value === '1' && !possibleEmployee.isActive) ||
        (isActiveSearchElement.value === '0' && possibleEmployee.isActive)
      ) {
        return false
      }

      const employeeSearchString =
        `${possibleEmployee.employeeGivenName} ${possibleEmployee.employeeSurname} ${possibleEmployee.employeeNumber}`.toLowerCase()

      const searchStringPieces = employeeNameNumberSearchElement.value
        .trim()
        .toLowerCase()
        .split(' ')

      for (const searchStringPiece of searchStringPieces) {
        if (!employeeSearchString.includes(searchStringPiece)) {
          return false
        }
      }

      return true
    })

    renderEmployees()
  }

  function resetOffsetAndFilterEmployees(): void {
    offset = 0
    refreshFilteredEmployees()
  }

  // Initialize page

  resetOffsetAndFilterEmployees()

  employeeNameNumberSearchElement.addEventListener(
    'keyup',
    resetOffsetAndFilterEmployees
  )
  isActiveSearchElement.addEventListener(
    'change',
    resetOffsetAndFilterEmployees
  )
})()
