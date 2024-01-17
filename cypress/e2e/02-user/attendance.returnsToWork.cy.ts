// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable promise/always-return, promise/catch-or-return */

import { testUser } from '../../../test/_globals.js'
import type { ConfigTemporaryUserCredentials } from '../../../types/configTypes.js'
import { login, logout } from '../../support/index.js'

describe('Attendance - Returns to Work', () => {
  beforeEach(() => {
    logout()
    login(testUser as ConfigTemporaryUserCredentials)
    cy.visit('/attendance')
    cy.location('pathname').should('equal', '/attendance')
    cy.get('.menu-list a[href="#tab--returnsToWork"]')
      .click()
      .should('have.class', 'is-active')
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.injectAxe()
    cy.checkA11y()
  })

  it('Adds a return to work record', () => {
    // Open the add modal

    cy.get('#tab--returnsToWork [data-cy="add-call-in"]').click()

    cy.get('.modal').should('exist')
    cy.get('html').should('have.class', 'is-clipped')

    cy.injectAxe()
    cy.checkA11y()

    cy.get('#container--employees a[data-employee-number]')
      .first()
      .then(($element) => {
        const employeeNumber = $element.data('employee-number') as string

        cy.get('.modal input[name="employeeNumber"]')
          .should('have.focus')
          .clear()
          .type(employeeNumber)

        cy.wait(250)

        cy.get('.modal input[name="employeeName"]')
          .should('have.prop', 'value')
          .should('not.be.empty')

        cy.get('.modal input[name="callInType"][value="returnToWork"]').click({
          force: true
        })

        cy.get('.modal input[name="returnShift"]').clear().type('Days')

        cy.get('.modal textarea[name="recordComment"]')
          .clear()
          .type('Test Comment')
      })

    cy.get('.modal form').submit()

    // Ensure the modal closed

    cy.get('.modal').should('not.exist')
  })

  it('Removes a return to work record', () => {
    cy.get('#container--returnsToWork [data-record-id] button[data-cy="delete"]')
      .first()
      .click()

    cy.get('.modal button[data-cy="ok"]').click()

    cy.get('.modal [role="alert"]').contains('success')
  })
})
