import { testUser } from '../../../test/_globals.js';
import { logout, login, ajaxDelayMillis } from '../../support/index.js';
describe('Reports', () => {
    beforeEach(() => {
        logout();
        login(testUser);
        cy.visit('/reports');
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.visit('/reports');
        cy.location('pathname').should('equal', '/reports');
        cy.injectAxe();
        cy.checkA11y();
    });
    it('Exports all reports without parameters', () => {
        cy.get("a:not(.is-hidden)[download][href*='/reports/']").each(($reportLink) => {
            cy.wrap($reportLink).click({ force: true });
            cy.wait(ajaxDelayMillis);
        });
    });
});
