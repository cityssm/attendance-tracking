import { testAdmin } from '../../../test/_globals.js'
import { logout, login } from '../../support/index.js'

describe('Admin - Table Maintenance', () => {
  beforeEach(() => {
    logout()
    login(testAdmin!)
    cy.visit('/admin/tables')
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.visit('/admin/tables')
    cy.location('pathname').should('equal', '/admin/tables')
    cy.injectAxe()
    cy.checkA11y()
  })
})
