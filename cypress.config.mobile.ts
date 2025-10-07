import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:7000/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    projectId: 'szu5cb',

    env: {
      TEST_DATABASES: 'true'
    },
    // iPhone 12/13 viewport
    viewportWidth: 425,
    viewportHeight: 926
  }
})
