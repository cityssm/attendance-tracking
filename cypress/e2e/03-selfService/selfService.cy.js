import { testAdmin } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
const selector_employeeNumber = '#employee--employeeNumber';
const selector_homeContactLastFourDigits = '#employee--homeContact_lastFourDigits';
const selector_nextButton = '#employee--nextButton';
const select_employeeTab = '#tab--employee';
const select_employeeOptionsTab = '#tab--employeeOptions';
describe('Self Service', () => {
    let selfServiceURL = '';
    let employeeNumber = '';
    let lastFourDigits = '';
    let lastFourDigitsBad = '';
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
        cy.get(selector_employeeNumber).clear().type(employeeNumber);
        cy.get(selector_homeContactLastFourDigits).clear().type(lastFourDigits);
        cy.get(selector_nextButton).click();
        cy.get(select_employeeTab).should('have.class', 'is-hidden');
        cy.get(select_employeeOptionsTab).should('not.have.class', 'is-hidden');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('#employeeOptionsTab--menu a').each(($option) => {
            cy.wrap($option).click();
            cy.injectAxe();
            cy.checkA11y();
            cy.get('.is-back-to-options-button').first().click();
        });
        cy.get('.is-sign-out-button').first().click();
        cy.get(select_employeeOptionsTab).should('have.class', 'is-hidden');
        cy.get(select_employeeTab).should('not.have.class', 'is-hidden');
        cy.get(selector_employeeNumber).should('have.value', '');
    });
    it('Blocks invalid login', () => {
        cy.get(selector_employeeNumber).clear().type(employeeNumber);
        cy.get(selector_homeContactLastFourDigits).clear().type(lastFourDigitsBad);
        cy.get(selector_nextButton).click();
        cy.get(select_employeeTab).should('not.have.class', 'is-hidden');
        cy.get(select_employeeOptionsTab).should('have.class', 'is-hidden');
        cy.get('#employee--message').should('not.be.empty');
    });
    it('Resets form after two minutes of inactivity', () => {
        cy.get(selector_employeeNumber).clear().type(employeeNumber);
        cy.get(selector_homeContactLastFourDigits).clear().type(lastFourDigits);
        cy.get(selector_nextButton).click();
        cy.get(select_employeeTab).should('have.class', 'is-hidden');
        cy.get(select_employeeOptionsTab).should('not.have.class', 'is-hidden');
        cy.log('Waiting two minutes...');
        cy.wait(2 * 60 * 1000 + 1000);
        cy.get(select_employeeOptionsTab).should('have.class', 'is-hidden');
        cy.get(select_employeeTab).should('not.have.class', 'is-hidden');
        cy.get(selector_employeeNumber).should('have.value', '');
    });
});
