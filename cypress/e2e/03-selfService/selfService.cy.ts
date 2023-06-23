/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable node/no-unpublished-import */

import { testUser } from '../../../test/_globals.js'
import type { ConfigTemporaryUserCredentials } from '../../../types/configTypes'
import { logout, login } from '../../support/index.js'

describe('Self Service', () => {
  let selfServiceURL: string

  before(() => {
    logout()
    login(testUser as ConfigTemporaryUserCredentials)
    cy.visit('/dashboard')

    cy.get('a')
      .contains('self service', { matchCase: false })
      .closest('a')
      .invoke('attr', 'href')
      .then(($href) => {
        selfServiceURL = $href as string
      })

    cy.log(selfServiceURL)
  })

  beforeEach(() => {
    cy.visit(selfServiceURL)
    cy.location('pathname').should('equal', selfServiceURL)
  })

  it('Has no detectable accessibility issues', () => {
    cy.injectAxe()
    cy.checkA11y()
  })
})
