/* eslint-disable node/no-unpublished-import */

import 'cypress-axe'

import type * as configTypes from '../../types/configTypes'

export const logout = (): void => {
  cy.visit('/logout')
}

export const login = (user: configTypes.ConfigTemporaryUserCredentials): void => {
  cy.visit('/login')

  /*
  cy.get('.message').contains('Testing', {
    matchCase: false
  })
  */

  cy.get("form [name='userName']").type(user.user.userName)
  cy.get("form [name='password']").type(user.password)

  cy.get('form').submit()

  cy.location('pathname').should('not.contain', '/login')

  // Logged in pages have a navbar
  cy.get('.navbar').should('have.length', 1)
}

export const ajaxDelayMillis = 800
