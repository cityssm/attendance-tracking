import { testAdmin } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
describe('Admin - User Maintenance', () => {
    beforeEach(() => {
        logout();
        login(testAdmin);
        cy.visit('/admin/users');
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.visit('/admin/users');
        cy.location('pathname').should('equal', '/admin/users');
        cy.injectAxe();
        cy.checkA11y();
    });
    const newUserName = Date.now().toString();
    it('Adds a new user', () => {
        cy.get('button[data-cy="add"]').click({ force: true });
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('.modal input[name="userName"]')
            .should('have.focus')
            .clear()
            .type(newUserName);
        cy.get('.modal form').submit();
        cy.get('.modal [role="alert"]').contains('success');
        cy.get('.modal [role="alert"] button[data-cy="ok"]').click();
    });
    it('Can toggle "Can Log In"', () => {
        cy.get(`#tbody--users tr[data-user-name="${newUserName}"] select[data-field="canLogin"]`)
            .select(0)
            .wait(250)
            .select(1);
    });
    it('Can toggle "Is Admin"', () => {
        cy.get(`#tbody--users tr[data-user-name="${newUserName}"] select[data-field="isAdmin"]`)
            .select(1)
            .wait(250)
            .select(0);
    });
    it('Can update permissions', () => {
        cy.get(`#tbody--users tr[data-user-name="${newUserName}"] button[data-cy="permissions"]`).click();
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('.modal tr[data-permission-key]')
            .first()
            .should('not.have.class', 'has-background-warning-light')
            .find('select')
            .select(1)
            .closest('tr')
            .should('have.class', 'has-background-warning-light')
            .find('form')
            .submit()
            .closest('tr')
            .should('not.have.class', 'has-background-warning-light');
        cy.get('.modal [role="alert"]').contains('success');
        cy.get('.modal [role="alert"] button[data-cy="ok"]').click();
    });
    it('Removes a user', () => {
        cy.get(`#tbody--users tr[data-user-name="${newUserName}"] button[data-cy="delete"]`).click({ force: true });
        cy.get('.modal [role="alert"] button[data-cy="ok"]').click();
        cy.get('.modal [role="alert"]').contains('success');
        cy.get('.modal [role="alert"] button[data-cy="ok"]').click();
    });
});
