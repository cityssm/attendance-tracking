import { testUser } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
const newCallOutListName = `Test Call Out List - ${Date.now().toString()}`;
describe('Attendance - Call Out Lists', () => {
    beforeEach(() => {
        logout();
        login(testUser);
        cy.visit('/attendance');
        cy.location('pathname').should('equal', '/attendance');
        cy.get('.menu-list a[href="#tab--callOuts"]')
            .click()
            .should('have.class', 'is-active');
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    it('Creates a call out list', () => {
        cy.get('#tab--callOuts [data-cy="add-call-out-list"]').click();
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('.modal input[name="listName"]')
            .should('have.focus')
            .clear()
            .type(newCallOutListName);
        cy.get('.modal textarea[name="listDescription"]')
            .clear()
            .type('Test Description');
        cy.get('.modal form').submit();
    });
    it('Updates a call out list', () => {
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`).click();
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('.modal .menu-list a[href="#tab--callOuts-details"]')
            .click()
            .should('have.class', 'is-active');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Unlock form');
        const formSelector = '.modal #form--callOutListEdit';
        cy.get(`${formSelector} fieldset`).should('have.attr', 'disabled');
        cy.get(`${formSelector} button[data-cy="unlock"]`).click();
        cy.get(`${formSelector} fieldset`).should('not.have.attr', 'disabled');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Make changes');
        cy.get(`${formSelector} input[name="listName"]`).should('have.value', newCallOutListName);
        cy.get(`${formSelector} select[name="allowSelfSignUp"]`).select('1');
        cy.get(`${formSelector} input[name="selfSignUpKey"]`)
            .clear()
            .type('abcd');
        cy.get(`${formSelector} select[name="sortKeyFunction"]`).select(1);
        cy.log('Update list');
        cy.get(formSelector).submit();
        cy.get('.modal [role="alert"]').contains('success');
        cy.get('.modal [role="alert"] button[data-cy="ok"]').click();
    });
    it('Adds call out list members', () => {
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`).click();
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Switch to Member section');
        cy.get('.modal .menu-list a[href="#tab--callOuts-members"]')
            .click()
            .should('have.class', 'is-active');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Switch to Current Members tab, no members');
        cy.get('.modal .tabs a[href="#tab--callOutMembers-current"]').click();
        cy.injectAxe();
        cy.checkA11y();
        cy.get('#container--callOutListMembers a[data-employee-number]').should('not.exist');
        cy.log('Switch to Manage Members tab');
        cy.get('.modal .tabs a[href="#tab--callOutMembers-manage"]').click();
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Add an available employee');
        cy.get('.modal #container--callOutListAvailableEmployees a[data-employee-number]')
            .first()
            .click()
            .should('not.exist');
        cy.log('Switch to Current Members tab, should have members');
        cy.get('.modal .tabs a[href="#tab--callOutMembers-current"]').click();
        cy.injectAxe();
        cy.checkA11y();
        cy.get('#container--callOutListMembers a[data-employee-number]').should('exist');
    });
    it('Adds a call out record', () => {
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`).click();
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Switch to Member section');
        cy.get('.modal .menu-list a[href="#tab--callOuts-members"]')
            .click()
            .should('have.class', 'is-active');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Switch to Current Members tab');
        cy.get('.modal .tabs a[href="#tab--callOutMembers-current"]').click();
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Open employee modal');
        cy.get('#container--callOutListMembers a[data-employee-number]')
            .first()
            .click();
        cy.injectAxe();
        cy.checkA11y();
        const formSelector = '#form--callOutRecordAdd';
        cy.get(`${formSelector} input[name="callOutHours"]`).clear().type('8');
        cy.get(`${formSelector} select[name="responseTypeId"]`).select(1);
        cy.get(`${formSelector} textarea[name="recordComment"]`)
            .clear()
            .type('Test comment');
        cy.get(formSelector).submit();
        cy.get('.modal [role="alert"]').contains('success');
        cy.get('.modal [role="alert"] [data-cy="ok"').click();
        cy.get(`${formSelector} input[name="callOutHours"]`).should('not.have.value');
    });
    it('Adds call out list to user favourites', () => {
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`)
            .closest('[data-list-id]')
            .find('button[data-is-favourite="0"]')
            .click();
        cy.get('.modal').should('not.exist');
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`)
            .closest('[data-list-id]')
            .find('button[data-is-favourite="1"]')
            .should('exist');
    });
    it('Removes call out list to user favourites', () => {
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`)
            .closest('[data-list-id]')
            .find('button[data-is-favourite="1"]')
            .click();
        cy.get('.modal').should('not.exist');
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`)
            .closest('[data-list-id]')
            .find('button[data-is-favourite="0"]')
            .should('exist');
    });
    it('Prints a call out list', () => {
        cy.get(`#callOuts--searchResults a[data-cy="${newCallOutListName}"]`).click();
        cy.get('.modal').should('exist');
        cy.get('html').should('have.class', 'is-clipped');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Switch to Reports section');
        cy.get('.modal .menu-list a[href="#tab--callOuts-reports"]')
            .click()
            .should('have.class', 'is-active');
        cy.injectAxe();
        cy.checkA11y();
        cy.log('Click the report links');
        cy.get('#reportingLink--callOutListReport').click();
        cy.get("#tab--callOuts-reports a[download][href*='/reports/']").each(($reportLink) => {
            cy.wrap($reportLink).click({ force: true });
            cy.wait(2000);
        });
    });
});
