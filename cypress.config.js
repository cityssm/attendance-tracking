import wp from '@cypress/webpack-batteries-included-preprocessor';
import { defineConfig } from 'cypress';
export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:7000/',
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: false,
        projectId: 'szu5cb',
        setupNodeEvents(on, config) {
            on('file:preprocessor', wp());
        }
    }
});
