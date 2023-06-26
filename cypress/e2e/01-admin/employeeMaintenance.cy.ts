/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */

import { testAdmin } from '../../../test/_globals.js'
import type { ConfigTemporaryUserCredentials } from '../../../types/configTypes'
import type * as recordTypes from '../../../types/recordTypes'
import { logout, login } from '../../support/index.js'

describe('Admin - Employee Maintenance', () => {
  beforeEach(() => {
    logout()
    login(testAdmin as ConfigTemporaryUserCredentials)
    cy.visit('/admin/employees')
    cy.location('pathname').should('equal', '/admin/employees')
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.injectAxe()
    cy.checkA11y()
  })

  it('Adds a new employee', () => {
    cy.log('Open Add Employee Modal')

    cy.get('[data-cy="add-employee"]').click()

    cy.get('.modal').should('be.visible')
    cy.get('html').should('have.class', 'is-clipped')

    cy.injectAxe()
    cy.checkA11y()

    cy.log('Populate employee form')

    const newEmployeeNumber = Date.now().toString().slice(-6)

    cy.fixture('employee.json').then((employee: recordTypes.Employee) => {
      cy.get('.modal form input[name="employeeNumber"]')
        .should('have.focus')
        .clear()
        .type(newEmployeeNumber)

      cy.get('.modal form input[name="employeeSurname"]')
        .clear()
        .type(employee.employeeSurname)

      cy.get('.modal form input[name="employeeGivenName"]')
        .clear()
        .type(employee.employeeGivenName)
    })

    cy.get('.modal form').submit()

    cy.log('Dismiss successful message')

    cy.get('.modal').contains('success')
    cy.get('.modal [data-cy="ok"]').click()

    cy.log('Populate additional details')

    cy.get('.modal').should('be.visible')
    cy.get('html').should('have.class', 'is-clipped')

    cy.injectAxe()
    cy.checkA11y()

    cy.fixture('employee.json').then((employee: recordTypes.Employee) => {
      cy.get('.modal form input[name="employeeSurname"]').should(
        'have.value',
        employee.employeeSurname
      )

      cy.get('.modal form input[name="employeeGivenName"]').should(
        'have.value',
        employee.employeeGivenName
      )

      cy.get('.modal form input[name="jobTitle"]')
        .clear()
        .type(employee.jobTitle ?? '')

      cy.get('.modal form input[name="userName"]')
        .clear()
        .type(employee.userName ?? '')

      cy.get('.modal form input[name="department"]')
        .clear()
        .type(employee.department ?? '')

      cy.get('.modal form input[name="seniorityDateTime"]')
        .clear()
        .type((employee.seniorityDateTime as string) ?? '')

      cy.get('.modal form input[name="workContact1"]')
        .clear()
        .type((employee.workContact1 as string) ?? '')

      cy.get('.modal form input[name="workContact2"]')
        .clear()
        .type((employee.workContact2 as string) ?? '')

      cy.get('.modal form input[name="homeContact1"]')
        .clear()
        .type((employee.homeContact1 as string) ?? '')

      cy.get('.modal form input[name="homeContact2"]')
        .clear()
        .type((employee.homeContact2 as string) ?? '')

      cy.get('.modal #tab--employeeDetails form').submit()

      cy.log('Dismiss successful message')

      cy.get('.modal').contains('success')
      cy.get('.modal [data-cy="ok"]').click()

      cy.log('Close update modal')

      cy.get('.modal [data-cy="close"]').click()

      // Ensure the employee is now available

      cy.get(
        `#container--employees a[data-employee-number="${newEmployeeNumber}"]`
      ).should('exist')
    })
  })
})
