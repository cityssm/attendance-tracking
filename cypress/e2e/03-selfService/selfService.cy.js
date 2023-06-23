import { testUser } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
describe('Self Service', () => {
    let selfServiceURL;
    before(() => {
        logout();
        login(testUser);
        cy.visit('/dashboard');
        cy.get('a')
            .contains('self service', { matchCase: false })
            .closest('a')
            .invoke('attr', 'href')
            .then(($href) => {
            selfServiceURL = $href;
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
});
