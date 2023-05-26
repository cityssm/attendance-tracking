import 'cypress-axe';
export const logout = () => {
    cy.visit('/logout');
};
export const login = (user) => {
    cy.visit('/login');
    cy.get("form [name='userName']").type(user.user.userName);
    cy.get("form [name='password']").type(user.password);
    cy.get('form').submit();
    cy.location('pathname').should('not.contain', '/login');
    cy.get('.navbar').should('have.length', 1);
};
export const ajaxDelayMillis = 800;
