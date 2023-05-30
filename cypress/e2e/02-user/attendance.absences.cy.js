import { testUser } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
describe('Attendance - Absences', () => {
    beforeEach(() => {
        logout();
        login(testUser);
        cy.visit('/attendance');
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.visit('/attendance');
        cy.location('pathname').should('equal', '/attendance');
        cy.injectAxe();
        cy.checkA11y();
    });
});
