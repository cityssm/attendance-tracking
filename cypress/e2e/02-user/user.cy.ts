import { testUser } from '../../../test/_globals.js'
import { logout, login } from '../../support/index.js'

describe('Read Only User', () => {
  beforeEach(() => {
    logout()
    login(testUser!)
  })

  afterEach(logout)

  it('Has a Read Only User dashboard', () => {
    cy.visit('/dashboard')

    cy.log('Has no detectable accessibility issues')
    cy.injectAxe()
    cy.checkA11y()

    cy.log('Has no links to admin areas')
    cy.get("a[href*='/admin']").should('not.exist')
  })

  it('Redirects to Dashboard when attempting to access the login page while authenticated', () => {
    cy.visit('/login')
    cy.wait(200)
    cy.location('pathname').should('equal', '/dashboard/')
  })
})
