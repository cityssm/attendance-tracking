import { testAdmin } from '../../../test/_globals.js'
import { logout, login } from '../../support/index.js'

describe('Admin - User Maintenance', () => {
  beforeEach(() => {
    logout()
    login(testAdmin!)
    cy.visit('/admin/users')
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.visit('/admin/users')
    cy.location('pathname').should('equal', '/admin/users')
    cy.injectAxe()
    cy.checkA11y()
  })
})
