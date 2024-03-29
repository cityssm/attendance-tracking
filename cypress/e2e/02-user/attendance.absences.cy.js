import { testUser } from '../../../test/_globals.js';
import { login, logout } from '../../support/index.js';
describe('Attendance - Absences', () => {
    beforeEach(() => {
        logout();
        login(testUser);
        cy.visit('/attendance');
        cy.location('pathname').should('equal', '/attendance');
        cy.get('.menu-list a[href="#tab--absences"]')
            .click()
            .should('have.class', 'is-active');
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    it('Adds an absence request', () => {
        cy.get('#tab--absences [data-cy="add-call-in"]').click();
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('#container--employees a[data-employee-number]')
            .first()
            .then(($element) => {
            const employeeNumber = $element.data('employee-number');
            cy.get('.modal input[name="employeeNumber"]')
                .should('have.focus')
                .clear()
                .type(employeeNumber);
            cy.wait(250);
            cy.get('.modal input[name="employeeName"]')
                .should('have.prop', 'value')
                .should('not.be.empty');
            cy.get('.modal input[name="callInType"][value="absence"]').click({
                force: true
            });
            cy.get('.modal fieldset[data-call-in-type="absence"] select[name="absenceTypeKey"]').select(1);
            cy.get('.modal textarea[name="recordComment"]')
                .clear()
                .type('Test Comment');
        });
        cy.get('.modal form').submit();
        cy.get('.modal').should('not.exist');
    });
    it('Removes an absence request', () => {
        cy.get('#container--absences [data-record-id] button[data-cy="delete"]')
            .first()
            .click();
        cy.get('.modal button[data-cy="ok"]').click();
        cy.get('.modal [role="alert"]').contains('success');
    });
});
