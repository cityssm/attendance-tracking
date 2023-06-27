import { testAdmin } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
function addEmployee() {
    cy.location('pathname').should('equal', '/admin/employees');
    cy.get('.modal').should('not.exist');
    const newEmployeeNumber = Date.now().toString().slice(-8);
    cy.log('Open Add Employee Modal');
    cy.get('[data-cy="add-employee"]').click();
    cy.get('.modal').should('be.visible');
    cy.get('html').should('have.class', 'is-clipped');
    cy.injectAxe();
    cy.checkA11y();
    cy.log('Populate employee form');
    cy.fixture('employee.json').then((employee) => {
        cy.get('.modal form input[name="employeeNumber"]')
            .should('have.focus')
            .clear()
            .type(newEmployeeNumber);
        cy.get('.modal form input[name="employeeSurname"]')
            .clear()
            .type(employee.employeeSurname);
        cy.get('.modal form input[name="employeeGivenName"]')
            .clear()
            .type(employee.employeeGivenName);
    });
    cy.get('.modal form').submit();
    cy.log('Dismiss successful message');
    cy.get('.modal').contains('success');
    cy.get('.modal [data-cy="ok"]').click();
    cy.log('Populate additional details');
    cy.get('.modal').should('be.visible');
    cy.get('html').should('have.class', 'is-clipped');
    cy.injectAxe();
    cy.checkA11y();
    cy.fixture('employee.json').then((employee) => {
        cy.get('.modal form input[name="employeeSurname"]').should('have.value', employee.employeeSurname);
        cy.get('.modal form input[name="employeeGivenName"]').should('have.value', employee.employeeGivenName);
        cy.get('.modal form input[name="jobTitle"]')
            .clear()
            .type(employee.jobTitle ?? '');
        cy.get('.modal form input[name="userName"]')
            .clear()
            .type(employee.userName ?? '');
        cy.get('.modal form input[name="department"]')
            .clear()
            .type(employee.department ?? '');
        cy.get('.modal form input[name="seniorityDateTime"]')
            .clear()
            .type(employee.seniorityDateTime ?? '');
        cy.get('.modal form input[name="workContact1"]')
            .clear()
            .type(employee.workContact1 ?? '');
        cy.get('.modal form input[name="workContact2"]')
            .clear()
            .type(employee.workContact2 ?? '');
        cy.get('.modal form input[name="homeContact1"]')
            .clear()
            .type(employee.homeContact1 ?? '');
        cy.get('.modal form input[name="homeContact2"]')
            .clear()
            .type(employee.homeContact2 ?? '');
        cy.get('.modal #tab--employeeDetails form').submit();
        cy.log('Dismiss successful message');
        cy.get('.modal').contains('success');
        cy.get('.modal [data-cy="ok"]').click();
        cy.log('Close update modal');
        cy.get('.modal [data-cy="close"]').click();
        cy.get(`#container--employees a[data-employee-number="${newEmployeeNumber}"]`).should('exist');
        cy.wrap(newEmployeeNumber).as('employeeNumber');
    });
}
describe('Admin - Employee Maintenance', () => {
    beforeEach(() => {
        logout();
        login(testAdmin);
        cy.visit('/admin/employees');
        cy.location('pathname').should('equal', '/admin/employees');
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    it('Adds three new employees, then deletes one', () => {
        for (let index = 0; index < 3; index += 1) {
            addEmployee();
        }
        cy.log('Open last created employee');
        cy.get('@employeeNumber').then((employeeNumber) => {
            cy.get(`#container--employees a[data-employee-number="${employeeNumber}"]`).click();
            cy.get('.modal').should('be.visible');
            cy.get('html').should('have.class', 'is-clipped');
            cy.log('Find delete option in dropdown');
            cy.get('.modal button[data-cy="options"]').click();
            cy.get('.modal a[data-cy="delete-employee"]').click();
            cy.get('.modal [role="alert"] button[data-cy="ok"]').click();
            cy.log('Dismiss successful message');
            cy.get('.modal').contains('success');
            cy.get('.modal [data-cy="ok"]').click();
        });
    });
});
