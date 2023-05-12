"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
    const employees = exports.employees;
    const employeesContainerElement = document.querySelector('#container--employees');
    function renderEmployees() {
        var _a;
        if (employees.length === 0) {
            employeesContainerElement.innerHTML = `<div class="message is-warning">
        <p class="message">There are no active employees to report.</p>
        </div>`;
            return;
        }
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        for (const employee of employees) {
            const panelBlockElement = document.createElement('a');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.innerHTML = `<div class="columns">
        <div class="column">
          <strong>${employee.employeeNumber}</strong>
        </div>
        <div class="column">
          <strong>${employee.employeeSurname}, ${employee.employeeGivenName}</strong><br />
          <span class="is-size-7">${(_a = employee.jobTitle) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        </div>`;
            panelElement.append(panelBlockElement);
        }
        if (!panelElement.hasChildNodes()) {
            employeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message">There are no active employees that meet the search criteria.</p>
        </div>`;
            return;
        }
        employeesContainerElement.innerHTML = '';
        employeesContainerElement.append(panelElement);
    }
    renderEmployees();
})();
