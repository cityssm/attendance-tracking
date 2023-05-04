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

    cityssm.openHtmlModal('employeeAdmin-employee', {
      onshow(modalElement) {
        ;(
          modalElement.querySelector('.modal-card-title') as HTMLElement
        ).textContent =
          employee.employeeSurname + ', ' + employee.employeeGivenName
      },
      onshown(modalElement, closeModalFunction) {
        MonTY.initializeMenuTabs(
          modalElement.querySelectorAll('.menu a'),
          modalElement.querySelectorAll('.tabs-container > article')
        )
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

  function resetOffsetAndFilterEmployees(): void {
    offset = 0

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
