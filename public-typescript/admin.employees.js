"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
    let unfilteredEmployees = exports.employees;
    delete exports.employees;
    let filteredEmployees = unfilteredEmployees;
    // Employee Modal
    function openEmployeeModal(employeeNumber) {
        const employee = unfilteredEmployees.find((possibleEmployee) => {
            return possibleEmployee.employeeNumber === employeeNumber;
        });
        cityssm.openHtmlModal('employeeAdmin-employee', {
            onshow(modalElement) {
                ;
                modalElement.querySelector('.modal-card-title').textContent =
                    employee.employeeSurname + ', ' + employee.employeeGivenName;
            },
            onshown(modalElement, closeModalFunction) {
                MonTY.initializeMenuTabs(modalElement.querySelectorAll('.menu a'), modalElement.querySelectorAll('.tabs-container > article'));
            }
        });
    }
    function openEmployeeModalByClick(clickEvent) {
        clickEvent.preventDefault();
        const employeeNumber = clickEvent.currentTarget.dataset
            .employeeNumber;
        openEmployeeModal(employeeNumber);
    }
    // Search
    const employeeNameNumberSearchElement = document.querySelector('#employeeSearch--employeeNameNumber');
    const isActiveSearchElement = document.querySelector('#employeeSearch--isActive');
    const employeesContainerElement = document.querySelector('#container--employees');
    const limit = 50;
    let offset = 0;
    function renderEmployees() {
        var _a, _b, _c, _d;
        if (filteredEmployees.length === 0) {
            employeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no employees that meet your search criteria.</p>
        </div>`;
            return;
        }
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        for (let index = offset; index < Math.min(limit + offset, filteredEmployees.length); index += 1) {
            const employee = filteredEmployees[index];
            const panelBlockElement = document.createElement('a');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.href = '#';
            panelBlockElement.dataset.employeeNumber = (_a = employee.employeeNumber) !== null && _a !== void 0 ? _a : '';
            panelBlockElement.innerHTML = `<div class="columns">
        <div class="column">${employee.employeeNumber}</div>
        <div class="column">
          ${employee.employeeSurname}, ${employee.employeeGivenName}<br />
          <span class="is-size-7">
            ${(_b = employee.jobTitle) !== null && _b !== void 0 ? _b : ''}
          </span>
        </div>
        </div>`;
            panelBlockElement.addEventListener('click', openEmployeeModalByClick);
            panelElement.append(panelBlockElement);
        }
        employeesContainerElement.innerHTML = '';
        employeesContainerElement.append(panelElement);
        // Pager
        const pagerElement = document.createElement('div');
        pagerElement.className = 'field is-grouped is-justify-content-center';
        pagerElement.innerHTML = `<div class="control">
      <button class="button is-previous-button" data-tooltip="Previous Employees" type="button" aria-label="Previous">
        <i class="fas fa-arrow-left" aria-hidden="true"></i>
      </button>
      <button class="button is-next-button" data-tooltip="Next Employees" type="button" aria-label="Next">
        <span>Next</span>  
        <span class="icon is-small"><i class="fas fa-arrow-right" aria-hidden="true"></i></span>
      </button>
      </div>`;
        if (offset === 0) {
            ;
            pagerElement.querySelector('.is-previous-button').disabled = true;
        }
        else {
            (_c = pagerElement
                .querySelector('.is-previous-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', goToPrevious);
        }
        if (limit + offset >= filteredEmployees.length) {
            ;
            pagerElement.querySelector('.is-next-button').disabled = true;
        }
        else {
            (_d = pagerElement
                .querySelector('.is-next-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', goToNext);
        }
        employeesContainerElement.append(pagerElement);
    }
    function goToPrevious() {
        offset = Math.max(offset - limit, 0);
        renderEmployees();
    }
    function goToNext() {
        offset += limit;
        if (offset >= filteredEmployees.length) {
            offset = 0;
        }
        renderEmployees();
    }
    function resetOffsetAndFilterEmployees() {
        offset = 0;
        filteredEmployees = unfilteredEmployees.filter((possibleEmployee) => {
            if ((isActiveSearchElement.value === '1' && !possibleEmployee.isActive) ||
                (isActiveSearchElement.value === '0' && possibleEmployee.isActive)) {
                return false;
            }
            const employeeSearchString = (possibleEmployee.employeeGivenName +
                ' ' +
                possibleEmployee.employeeSurname +
                ' ' +
                possibleEmployee.employeeNumber).toLowerCase();
            const searchStringPieces = employeeNameNumberSearchElement.value
                .trim()
                .toLowerCase()
                .split(' ');
            for (const searchStringPiece of searchStringPieces) {
                if (!employeeSearchString.includes(searchStringPiece)) {
                    return false;
                }
            }
            return true;
        });
        renderEmployees();
    }
    // Initialize page
    resetOffsetAndFilterEmployees();
    employeeNameNumberSearchElement.addEventListener('keyup', resetOffsetAndFilterEmployees);
    isActiveSearchElement.addEventListener('change', resetOffsetAndFilterEmployees);
})();
