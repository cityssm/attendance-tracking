import { testAdmin } from '../../../test/_globals.js'
import type { ConfigTemporaryUserCredentials } from '../../../types/configTypes.js'
import { logout, login } from '../../support/index.js'

describe('Admin - Table Maintenance', () => {
  beforeEach(() => {
    logout()
    login(testAdmin as ConfigTemporaryUserCredentials)
    cy.visit('/admin/tables')
    cy.location('pathname').should('equal', '/admin/tables')
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.visit('/admin/tables')
    cy.injectAxe()
    cy.checkA11y()
  })

  describe('Absence Types', () => {
    const tabSelector = '#tab--absenceTypes'

    const newAbsenceType = `Absence Type - ${Date.now().toString()}`
    const updateAbsenceType = `${newAbsenceType} - updated`

    beforeEach(() => {
      cy.get(`.tabs a[href="${tabSelector}"]`).click()
    })

    it('Adds a new absence type', () => {
      cy.injectAxe()
      cy.checkA11y()

      cy.get(`${tabSelector} button[data-cy="add"]`).click()

      cy.get('.modal').should('exist')
      cy.get('html').should('have.class', 'is-clipped')

      cy.injectAxe()
      cy.checkA11y()

      cy.get('.modal input[name="absenceType"]')
        .should('have.focus')
        .clear()
        .type(newAbsenceType)

      cy.get('.modal form').submit()

      cy.get('.modal [role="alert"]').contains('success')

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()

      cy.get('#container--absenceTypes input[name="absenceType"]')
        .first()
        .should('have.value', newAbsenceType)
    })

    it('Updates an existing absence type', () => {
      cy.get('#container--absenceTypes input[name="absenceType"]')
        .first()
        .should('have.value', newAbsenceType)
        .clear()
        .type(updateAbsenceType)
        .closest('tr')
        .find('button[data-cy="save"]')
        .click()

      cy.get('.modal [role="alert"]').contains('success')

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()
    })

    it('Moves an existing absence type', () => {
      cy.log('Move from first down to second position')

      cy.get('#container--absenceTypes input[name="absenceType"]')
        .first()
        .should('have.value', updateAbsenceType)
        .closest('tr')
        .find('button[data-direction="down"]')
        .click()

      cy.wait(250)

      cy.log('Move from second up to first position')

      cy.get('#container--absenceTypes tbody tr')
        .eq(1)
        .find('input[name="absenceType"]')
        .should('have.value', updateAbsenceType)
        .closest('tr')
        .find('button[data-direction="up"]')
        .click()

      cy.wait(250)

      cy.log('Move from first down to bottom')

      cy.get('#container--absenceTypes input[name="absenceType"]')
        .eq(0)
        .should('have.value', updateAbsenceType)
        .closest('tr')
        .find('button[data-direction="down"]')
        .click({ shiftKey: true })

      cy.wait(250)

      cy.log('Move from bottom up to top')

      cy.get('#container--absenceTypes input[name="absenceType"]')
        .last()
        .should('have.value', updateAbsenceType)
        .closest('tr')
        .find('button[data-direction="up"]')
        .click({ shiftKey: true })

      cy.wait(250)

      cy.log('Ensure at top')

      cy.get('#container--absenceTypes input[name="absenceType"]')
        .first()
        .should('have.value', updateAbsenceType)
    })

    it('Exports absence types', () => {
      cy.get(`${tabSelector} a[download][href*="/reports/"]`).each(
        ($reportLink) => {
          cy.wrap($reportLink).click({ force: true })
          cy.wait(1000)
        }
      )
    })

    it('Deletes an absence type', () => {
      cy.get('#container--absenceTypes input[name="absenceType"]')
        .first()
        .should('have.value', updateAbsenceType)
        .closest('tr')
        .find('button[data-cy="delete"]')
        .click()

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()

      cy.wait(250)

      cy.get('#container--absenceTypes input[name="absenceType"]')
        .first()
        .should('not.have.value', updateAbsenceType)
    })
  })

  describe('Call Out Response Types', () => {
    const tabSelector = '#tab--callOutResponseTypes'

    const newResponseType = `Response Type - ${Date.now().toString()}`
    const updateResponseType = `${newResponseType} - updated`

    beforeEach(() => {
      cy.get(`.tabs a[href="${tabSelector}"]`).click()
    })

    it('Adds a new response type', () => {
      cy.injectAxe()
      cy.checkA11y()

      cy.get(`${tabSelector} button[data-cy="add"]`).click()

      cy.get('.modal').should('exist')
      cy.get('html').should('have.class', 'is-clipped')

      cy.injectAxe()
      cy.checkA11y()

      cy.get('.modal input[name="responseType"]')
        .should('have.focus')
        .clear()
        .type(newResponseType)

      cy.get('.modal form').submit()

      cy.get('.modal [role="alert"]').contains('success')

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()

      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .first()
        .should('have.value', newResponseType)
    })

    it('Updates an existing response type', () => {
      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .first()
        .should('have.value', newResponseType)
        .clear()
        .type(updateResponseType)
        .closest('tr')
        .find('button[data-cy="save"]')
        .click()

      cy.get('.modal [role="alert"]').contains('success')

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()
    })

    it('Moves an existing response type', () => {
      cy.log('Move from first down to second position')

      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .first()
        .should('have.value', updateResponseType)
        .closest('tr')
        .find('button[data-direction="down"]')
        .click()

      cy.wait(250)

      cy.log('Move from second up to first position')

      cy.get('#container--callOutResponseTypes tbody tr')
        .eq(1)
        .find('input[name="responseType"]')
        .should('have.value', updateResponseType)
        .closest('tr')
        .find('button[data-direction="up"]')
        .click()

      cy.wait(250)

      cy.log('Move from first down to bottom')

      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .eq(0)
        .should('have.value', updateResponseType)
        .closest('tr')
        .find('button[data-direction="down"]')
        .click({ shiftKey: true })

      cy.wait(250)

      cy.log('Move from bottom up to top')

      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .last()
        .should('have.value', updateResponseType)
        .closest('tr')
        .find('button[data-direction="up"]')
        .click({ shiftKey: true })

      cy.wait(250)

      cy.log('Ensure at top')

      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .first()
        .should('have.value', updateResponseType)
    })

    it('Exports response types', () => {
      cy.get(`${tabSelector} a[download][href*="/reports/"]`).each(
        ($reportLink) => {
          cy.wrap($reportLink).click({ force: true })
          cy.wait(1000)
        }
      )
    })

    it('Deletes a response type', () => {
      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .first()
        .should('have.value', updateResponseType)
        .closest('tr')
        .find('button[data-cy="delete"]')
        .click()

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()

      cy.wait(250)

      cy.get('#container--callOutResponseTypes input[name="responseType"]')
        .first()
        .should('not.have.value', updateResponseType)
    })
  })

  describe('After Hours Reasons', () => {
    const tabSelector = '#tab--afterHoursReasons'

    const newReason = `Reason - ${Date.now().toString()}`
    const updateReason = `${newReason} - updated`

    beforeEach(() => {
      cy.get(`.tabs a[href="${tabSelector}"]`).click()
    })

    it('Adds a new reason', () => {
      cy.injectAxe()
      cy.checkA11y()

      cy.get(`${tabSelector} button[data-cy="add"]`).click()

      cy.get('.modal').should('exist')
      cy.get('html').should('have.class', 'is-clipped')

      cy.injectAxe()
      cy.checkA11y()

      cy.get('.modal input[name="afterHoursReason"]')
        .should('have.focus')
        .clear()
        .type(newReason)

      cy.get('.modal form').submit()

      cy.get('.modal [role="alert"]').contains('success')

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()

      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .first()
        .should('have.value', newReason)
    })

    it('Updates an existing reason', () => {
      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .first()
        .should('have.value', newReason)
        .clear()
        .type(updateReason)
        .closest('tr')
        .find('button[data-cy="save"]')
        .click()

      cy.get('.modal [role="alert"]').contains('success')

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()
    })

    it('Moves an existing reason', () => {
      cy.log('Move from first down to second position')

      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .first()
        .should('have.value', updateReason)
        .closest('tr')
        .find('button[data-direction="down"]')
        .click()

      cy.wait(250)

      cy.log('Move from second up to first position')

      cy.get('#container--afterHoursReasons tbody tr')
        .eq(1)
        .find('input[name="afterHoursReason"]')
        .should('have.value', updateReason)
        .closest('tr')
        .find('button[data-direction="up"]')
        .click()

      cy.wait(250)

      cy.log('Move from first down to bottom')

      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .eq(0)
        .should('have.value', updateReason)
        .closest('tr')
        .find('button[data-direction="down"]')
        .click({ shiftKey: true })

      cy.wait(250)

      cy.log('Move from bottom up to top')

      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .last()
        .should('have.value', updateReason)
        .closest('tr')
        .find('button[data-direction="up"]')
        .click({ shiftKey: true })

      cy.wait(250)

      cy.log('Ensure at top')

      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .first()
        .should('have.value', updateReason)
    })

    it('Exports reasons', () => {
      cy.get(`${tabSelector} a[download][href*="/reports/"]`).each(
        ($reportLink) => {
          cy.wrap($reportLink).click({ force: true })
          cy.wait(1000)
        }
      )
    })

    it('Deletes a reason', () => {
      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .first()
        .should('have.value', updateReason)
        .closest('tr')
        .find('button[data-cy="delete"]')
        .click()

      cy.get('.modal [role="alert"] button[data-cy="ok"]')
        .should('have.focus')
        .click()

      cy.wait(250)

      cy.get('#container--afterHoursReasons input[name="afterHoursReason"]')
        .first()
        .should('not.have.value', updateReason)
    })
  })
})
