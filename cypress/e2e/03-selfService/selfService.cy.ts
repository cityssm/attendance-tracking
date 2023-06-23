/* eslint-disable node/no-unpublished-import */

import { config } from '../../../data/config.js'

import '../../support/index.js'

const selfServicePath = config.settings.selfService?.path ?? '/selfService'

describe('Self Service', () => {
  beforeEach(() => {
    cy.visit(selfServicePath)
    cy.location('pathname').should('equal', selfServicePath)
  })

  it('Has no detectable accessibility issues', () => {
    cy.injectAxe()
    cy.checkA11y()
  })
})
