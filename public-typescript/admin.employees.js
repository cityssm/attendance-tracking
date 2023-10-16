"use strict";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const MonTY = exports.MonTY;
    let unfilteredEmployees = exports.employees;
    delete exports.employees;
    let filteredEmployees = unfilteredEmployees;
    const employeeNumberRegularExpression = exports.employeeNumberRegularExpression;
    // Employee Modal
    function openEmployeeModal(employeeNumber) {
        let employeeModalElement;
        let closeEmployeeModalFunction;
        const employee = unfilteredEmployees.find((possibleEmployee) => {
            return possibleEmployee.employeeNumber === employeeNumber;
        });
        let employeeProperties = [];
        function updateEmployeeProperty(clickEvent) {
            var _a, _b;
            const rowElement = clickEvent.currentTarget.closest('tr');
            const propertyName = rowElement === null || rowElement === void 0 ? void 0 : rowElement.dataset.propertyName;
            const propertyValue = (_a = rowElement === null || rowElement === void 0 ? void 0 : rowElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.value;
            const isSynced = (_b = rowElement === null || rowElement === void 0 ? void 0 : rowElement.querySelector('select')) === null || _b === void 0 ? void 0 : _b.value;
            cityssm.postJSON(`${MonTY.urlPrefix}/admin/doUpdateEmployeeProperty`, {
                employeeNumber,
                propertyName,
                propertyValue,
                isSynced
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Property updated successfully.',
                        contextualColorName: 'success'
                    });
                    employeeProperties = responseJSON.employeeProperties;
                }
            });
        }
        function deleteEmployeeProperty(clickEvent) {
            const rowElement = clickEvent.currentTarget.closest('tr');
            function doDelete() {
                var _a, _b;
                const propertyName = rowElement === null || rowElement === void 0 ? void 0 : rowElement.dataset.propertyName;
                const propertyValue = (_a = rowElement === null || rowElement === void 0 ? void 0 : rowElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.value;
                const isSynced = (_b = rowElement === null || rowElement === void 0 ? void 0 : rowElement.querySelector('select')) === null || _b === void 0 ? void 0 : _b.value;
                cityssm.postJSON(`${MonTY.urlPrefix}/admin/doDeleteEmployeeProperty`, {
                    employeeNumber,
                    propertyName,
                    propertyValue,
                    isSynced
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        bulmaJS.alert({
                            message: 'Property deleted successfully.',
                            contextualColorName: 'success'
                        });
                        employeeProperties = responseJSON.employeeProperties;
                        rowElement === null || rowElement === void 0 ? void 0 : rowElement.remove();
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Delete Employee Property',
                message: 'Are you sure you want to remove this employee property?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Delete Property',
                    callbackFunction: doDelete
                }
            });
        }
        function renderEmployeeProperties() {
            var _a, _b;
            const tbodyElement = employeeModalElement.querySelector('#employeePropertyTab--current tbody');
            tbodyElement.innerHTML = '';
            for (const employeeProperty of employeeProperties) {
                const rowElement = document.createElement('tr');
                rowElement.dataset.propertyName = employeeProperty.propertyName;
                rowElement.innerHTML = `<td class="is-size-7 is-vcentered">${employeeProperty.propertyName}</td>
          <td>
            <div class="control">
              <input class="input is-small" name="propertyValue" type="text" maxlength="500" />
            </div>
          </td>
          <td>
            <div class="control">
            <div class="select is-small is-fullwidth">
              <select name="isSynced">
                <option value="1">Synced</option>
                <option value="0">Not Synced</option>
              </select>
            </div>
            </div>
          </td>
          <td class="has-text-right">
          <div class="field is-grouped is-justify-content-flex-end">
            <div class="control">
            <button class="button is-update-button is-success is-small" data-tooltip="Save" type="button" aria-label="Save">
              <i class="fas fa-save" aria-hidden="true"></i>
            </button>
            </div>
            <div class="control">
            <button class="button is-delete-button is-danger is-small" data-tooltip="Delete" type="button" aria-label="Delete">
              <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
            </div>
          </div>
          </td>`;
                rowElement.querySelector('input').value =
                    employeeProperty.propertyValue;
                rowElement.querySelector('select').value =
                    employeeProperty.isSynced ? '1' : '0';
                (_a = rowElement
                    .querySelector('.is-update-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', updateEmployeeProperty);
                (_b = rowElement
                    .querySelector('.is-delete-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteEmployeeProperty);
                tbodyElement.append(rowElement);
            }
        }
        function addEmployeeProperty(formEvent) {
            formEvent.preventDefault();
            const addPropertyFormElement = formEvent.currentTarget;
            cityssm.postJSON(`${MonTY.urlPrefix}/admin/doAddEmployeeProperty`, addPropertyFormElement, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Property added successfully.',
                        contextualColorName: 'success',
                        okButton: {
                            callbackFunction() {
                                // eslint-disable-next-line no-extra-semi
                                ;
                                employeeModalElement.querySelector('#employeePropertyAdd--propertyName').focus();
                            }
                        }
                    });
                    addPropertyFormElement.reset();
                    employeeProperties = (_a = responseJSON.employeeProperties) !== null && _a !== void 0 ? _a : [];
                    renderEmployeeProperties();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding Property',
                        message: 'The property may already be set. Please check, then try again.',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        function updateEmployee(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${MonTY.urlPrefix}/admin/doUpdateEmployee`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Employee updated successfully.',
                        contextualColorName: 'success'
                    });
                    unfilteredEmployees = responseJSON.employees;
                    refreshFilteredEmployees();
                }
            });
        }
        function deleteEmployee(clickEvent) {
            clickEvent.preventDefault();
            function doDelete() {
                cityssm.postJSON(MonTY.urlPrefix + '/admin/doDeleteEmployee', {
                    employeeNumber
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        closeEmployeeModalFunction();
                        bulmaJS.alert({
                            message: 'Employee deleted successfully',
                            contextualColorName: 'info'
                        });
                        unfilteredEmployees = responseJSON.employees;
                        refreshFilteredEmployees();
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Delete Employee',
                message: `Are you sure you want to delete this employee?<br />
          Note that if the employee is found in a subsequent syncing process, they may be restored.`,
                messageIsHtml: true,
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Employee',
                    callbackFunction: doDelete
                }
            });
        }
        cityssm.openHtmlModal('employeeAdmin-employee', {
            onshow(modalElement) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                employeeModalElement = modalElement;
                modalElement.querySelector('.modal-card-title').textContent = `${employee.employeeSurname}, ${employee.employeeGivenName}`;
                modalElement.querySelector('#employeeEdit--employeeNumber').value = employee.employeeNumber;
                modalElement.querySelector('#employeeEdit--employeeNumberSpan').textContent = employee.employeeNumber;
                modalElement.querySelector('#employeeEdit--isActive').value = employee.isActive ? '1' : '0';
                modalElement.querySelector('#employeeEdit--isSynced').value = employee.isSynced ? '1' : '0';
                modalElement.querySelector('#employeeEdit--employeeSurname').value = employee.employeeSurname;
                modalElement.querySelector('#employeeEdit--employeeGivenName').value = employee.employeeGivenName;
                modalElement.querySelector('#employeeEdit--jobTitle').value = (_a = employee.jobTitle) !== null && _a !== void 0 ? _a : '';
                modalElement.querySelector('#employeeEdit--userName').value = (_b = employee.userName) !== null && _b !== void 0 ? _b : '';
                modalElement.querySelector('#employeeEdit--department').value = (_c = employee.department) !== null && _c !== void 0 ? _c : '';
                if (((_d = employee.seniorityDateTime) !== null && _d !== void 0 ? _d : '') !== '') {
                    // eslint-disable-next-line no-extra-semi
                    ;
                    modalElement.querySelector('#employeeEdit--seniorityDateTime').valueAsDate = new Date(employee.seniorityDateTime);
                }
                // Contact Information
                // eslint-disable-next-line no-extra-semi
                ;
                modalElement.querySelector('#employeeEdit--syncContacts').value = employee.syncContacts ? '1' : '0';
                modalElement.querySelector('#employeeEdit--workContact1').value = (_e = employee.workContact1) !== null && _e !== void 0 ? _e : '';
                modalElement.querySelector('#employeeEdit--workContact2').value = (_f = employee.workContact2) !== null && _f !== void 0 ? _f : '';
                modalElement.querySelector('#employeeEdit--homeContact1').value = (_g = employee.homeContact1) !== null && _g !== void 0 ? _g : '';
                modalElement.querySelector('#employeeEdit--homeContact2').value = (_h = employee.homeContact2) !== null && _h !== void 0 ? _h : '';
                modalElement.querySelector('#employeePropertyAdd--employeeNumber').value = employee.employeeNumber;
                cityssm.postJSON(`${MonTY.urlPrefix}/admin/doGetEmployeeProperties`, {
                    employeeNumber
                }, (rawResponseJSON) => {
                    employeeProperties = rawResponseJSON.employeeProperties;
                    renderEmployeeProperties();
                });
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b, _c;
                closeEmployeeModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init(modalElement);
                MonTY.initializeMenuTabs(modalElement.querySelectorAll('.menu a'), modalElement.querySelectorAll('.tabs-container > article'));
                (_a = modalElement
                    .querySelector('#form--employeeEdit')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateEmployee);
                (_b = modalElement
                    .querySelector('#form--employeePropertyAdd')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', addEmployeeProperty);
                (_c = modalElement
                    .querySelector('.is-delete-employee')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', deleteEmployee);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openEmployeeModalByClick(clickEvent) {
        clickEvent.preventDefault();
        const employeeNumber = clickEvent.currentTarget.dataset
            .employeeNumber;
        openEmployeeModal(employeeNumber);
    }
    // Add
    (_a = document
        .querySelector('#is-add-employee-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let addCloseModalFunction;
        function addEmployee(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${MonTY.urlPrefix}/admin/doAddEmployee`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    bulmaJS.alert({
                        message: 'Employee added successfully.',
                        okButton: {
                            callbackFunction() {
                                openEmployeeModal(responseJSON.employeeNumber);
                            }
                        }
                    });
                    unfilteredEmployees = responseJSON.employees;
                    refreshFilteredEmployees();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding Employee',
                        message: 'Please check to make sure that an employee does not already exist with the same employee number.',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('employeeAdmin-addEmployee', {
            onshown(modalElement, closeModalFunction) {
                var _a;
                addCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                const employeeNumberElement = modalElement.querySelector('#employeeAdd--employeeNumber');
                if (employeeNumberRegularExpression !== undefined) {
                    employeeNumberElement.pattern =
                        employeeNumberRegularExpression.source;
                }
                employeeNumberElement.focus();
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', addEmployee);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
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
            if (!employee.isActive) {
                panelBlockElement.classList.add('is-italic', 'has-background-warning-light');
            }
            panelBlockElement.href = '#';
            panelBlockElement.dataset.employeeNumber = (_a = employee.employeeNumber) !== null && _a !== void 0 ? _a : '';
            panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-hard-hat" aria-hidden="true"></i>
        </div>
        <div class="column is-4">${employee.employeeNumber}</div>
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
            // eslint-disable-next-line no-extra-semi
            ;
            pagerElement.querySelector('.is-previous-button').disabled = true;
        }
        else {
            (_c = pagerElement
                .querySelector('.is-previous-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', goToPrevious);
        }
        if (limit + offset >= filteredEmployees.length) {
            // eslint-disable-next-line no-extra-semi
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
        employeesContainerElement.scrollIntoView(true);
        window.scrollTo({ top: window.scrollY - 60 });
        renderEmployees();
    }
    function goToNext() {
        offset += limit;
        if (offset >= filteredEmployees.length) {
            offset = 0;
        }
        employeesContainerElement.scrollIntoView(true);
        window.scrollTo({ top: window.scrollY - 60 });
        renderEmployees();
    }
    function refreshFilteredEmployees() {
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
    function resetOffsetAndFilterEmployees() {
        offset = 0;
        refreshFilteredEmployees();
    }
    // Initialize page
    resetOffsetAndFilterEmployees();
    employeeNameNumberSearchElement.addEventListener('keyup', resetOffsetAndFilterEmployees);
    isActiveSearchElement.addEventListener('change', resetOffsetAndFilterEmployees);
})();
