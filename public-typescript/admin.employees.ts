/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
import type { BulmaJS } from '@cityssm/bulma-js/types'

import type * as recordTypes from '../types/recordTypes'
declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  let unfilteredEmployees = exports.employees as recordTypes.Employee[]
  delete exports.employees

  let filteredEmployees = unfilteredEmployees

  // Employee Modal

  function openEmployeeModal(employeeNumber: string): void {
    const employee = unfilteredEmployees.find((possibleEmployee) => {
      return possibleEmployee.employeeNumber === employeeNumber
    })!

    function updateEmployee(formEvent: Event): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        MonTY.urlPrefix + '/admin/doUpdateEmployee',
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            employees: recordTypes.Employee[]
          }

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

    cityssm.openHtmlModal('employeeAdmin-employee', {
      onshow(modalElement) {
        ;(
          modalElement.querySelector('.modal-card-title') as HTMLElement
        ).textContent =
          employee.employeeSurname + ', ' + employee.employeeGivenName
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
        ).value = employee.isActive! ? '1' : '0'

        // Main Details
        ;(
          modalElement.querySelector(
            '#employeeEdit--isSynced'
          ) as HTMLSelectElement
        ).value = employee.isSynced! ? '1' : '0'
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
            '#employeeEdit--department'
          ) as HTMLInputElement
        ).value = employee.department ?? ''

        if ((employee.seniorityDateTime ?? '') !== '') {
          ;(
            modalElement.querySelector(
              '#employeeEdit--seniorityDateTime'
            ) as HTMLInputElement
          ).valueAsDate = new Date(employee.seniorityDateTime!)
        }

        // Contact Information
        ;(
          modalElement.querySelector(
            '#employeeEdit--syncContacts'
          ) as HTMLSelectElement
        ).value = employee.syncContacts! ? '1' : '0'
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
      },
      onshown(modalElement, closeModalFunction) {
        bulmaJS.toggleHtmlClipped()

        MonTY.initializeMenuTabs(
          modalElement.querySelectorAll('.menu a'),
          modalElement.querySelectorAll('.tabs-container > article')
        )

        modalElement
          .querySelector('#form--employeeEdit')
          ?.addEventListener('submit', updateEmployee)
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  function openEmployeeModalByClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()
    const employeeNumber = (clickEvent.currentTarget as HTMLElement).dataset
      .employeeNumber!
    openEmployeeModal(employeeNumber)
  }

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
      panelBlockElement.href = '#'
      panelBlockElement.dataset.employeeNumber = employee.employeeNumber ?? ''

      panelBlockElement.innerHTML = `<div class="columns">
        <div class="column">${employee.employeeNumber}</div>
        <div class="column">
          ${employee.employeeSurname}, ${employee.employeeGivenName}<br />
          <span class="is-size-7">
            ${employee.jobTitle ?? ''}
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
      ;(
        pagerElement.querySelector('.is-previous-button') as HTMLButtonElement
      ).disabled = true
    } else {
      pagerElement
        .querySelector('.is-previous-button')
        ?.addEventListener('click', goToPrevious)
    }

    if (limit + offset >= filteredEmployees.length) {
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
    renderEmployees()
  }

  function goToNext(): void {
    offset += limit
    if (offset >= filteredEmployees.length) {
      offset = 0
    }
    renderEmployees()
  }

  function refreshFilteredEmployees(): void {
    filteredEmployees = unfilteredEmployees.filter((possibleEmployee) => {
      if (
        (isActiveSearchElement.value === '1' && !possibleEmployee.isActive!) ||
        (isActiveSearchElement.value === '0' && possibleEmployee.isActive!)
      ) {
        return false
      }

      const employeeSearchString = (
        possibleEmployee.employeeGivenName +
        ' ' +
        possibleEmployee.employeeSurname +
        ' ' +
        possibleEmployee.employeeNumber
      ).toLowerCase()

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
