import { testAdmin } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
describe('Self Service', () => {
    let selfServiceURL;
    let employeeNumber;
    let lastFourDigits;
    let lastFourDigitsBad;
    before(() => {
        logout();
        login(testAdmin);
        cy.visit('/dashboard');
        cy.get('a')
            .contains('self service', { matchCase: false })
            .closest('a')
            .then(($anchor) => {
            selfServiceURL = $anchor.attr('href') ?? '';
            employeeNumber = $anchor.data('employeeNumber');
            lastFourDigits = $anchor.data('lastFourDigits');
            lastFourDigitsBad = $anchor.data('lastFourDigitsBad');
        });
        cy.log(selfServiceURL);
    });
    beforeEach(() => {
        cy.visit(selfServiceURL);
        cy.location('pathname').should('equal', selfServiceURL);
    });
    it('Has no detectable accessibility issues', () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    it('Logs in and out successfully', () => {
        cy.get('#employee--employeeNumber').clear().type(employeeNumber);
        cy.get('#employee--homeContact_lastFourDigits').clear().type(lastFourDigits);
        cy.get('#employee--nextButton').click();
        cy.get('#tab--employee').should('have.class', 'is-hidden');
        cy.get('#tab--employeeOptions').should('not.have.class', 'is-hidden');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('#employeeOptionsTab--menu a').each(($option) => {
            cy.wrap($option).click();
            cy.injectAxe();
            cy.checkA11y();
            cy.get('.is-back-to-options-button').first().click();
        });
        cy.get('.is-sign-out-button').first().click();
        cy.get('#tab--employeeOptions').should('have.class', 'is-hidden');
        cy.get('#tab--employee').should('not.have.class', 'is-hidden');
        cy.get('#employee--employeeNumber').should('have.value', '');
    });
    it('Blocks invalid login', () => {
        cy.get('#employee--employeeNumber').clear().type(employeeNumber);
        cy.get('#employee--homeContact_lastFourDigits')
            .clear()
            .type(lastFourDigitsBad);
        cy.get('#employee--nextButton').click();
        cy.get('#tab--employee').should('not.have.class', 'is-hidden');
        cy.get('#tab--employeeOptions').should('have.class', 'is-hidden');
        cy.get('#employee--message').should('not.be.empty');
    });
    it('Resets form after two minutes of inactivity', () => {
        cy.get('#employee--employeeNumber').clear().type(employeeNumber);
        cy.get('#employee--homeContact_lastFourDigits').clear().type(lastFourDigits);
        cy.get('#employee--nextButton').click();
        cy.get('#tab--employee').should('have.class', 'is-hidden');
        cy.get('#tab--employeeOptions').should('not.have.class', 'is-hidden');
        cy.log('Waiting two minutes...');
        cy.wait(2 * 60 * 1000 + 1000);
        cy.get('#tab--employeeOptions').should('have.class', 'is-hidden');
        cy.get('#tab--employee').should('not.have.class', 'is-hidden');
        cy.get('#employee--employeeNumber').should('have.value', '');
    });
});
