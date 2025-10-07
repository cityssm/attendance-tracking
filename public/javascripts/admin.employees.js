"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const Attend = exports.Attend;
    let unfilteredEmployees = exports.employees;
    delete exports.employees;
    let filteredEmployees = unfilteredEmployees;
    const employeeNumberRegularExpression = exports.employeeNumberRegularExpression;
    // Employee Modal
    const selfServiceEnabled = exports.selfService;
    function swapFields(clickEvent) {
        clickEvent.preventDefault();
        const inputElements = clickEvent.currentTarget
            .closest('.columns')
            ?.querySelectorAll('input');
        if (inputElements.length !== 2) {
            return;
        }
        const value = inputElements.item(0).value;
        inputElements.item(0).value = inputElements.item(1).value;
        inputElements.item(1).value = value;
    }
    function openEmployeeModal(employeeNumber) {
        let employeeModalElement;
        let closeEmployeeModalFunction;
        const employee = unfilteredEmployees.find((possibleEmployee) => possibleEmployee.employeeNumber === employeeNumber);
        let employeeProperties = [];
        function updateEmployeeProperty(clickEvent) {
            const rowElement = clickEvent.currentTarget.closest('tr');
            const propertyName = rowElement?.dataset.propertyName;
            const propertyValue = rowElement?.querySelector('input')?.value;
            const isSynced = rowElement?.querySelector('select')?.value;
            cityssm.postJSON(`${Attend.urlPrefix}/admin/doUpdateEmployeeProperty`, {
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
                const propertyName = rowElement?.dataset.propertyName;
                const propertyValue = rowElement?.querySelector('input')?.value;
                const isSynced = rowElement?.querySelector('select')?.value;
                cityssm.postJSON(`${Attend.urlPrefix}/admin/doDeleteEmployeeProperty`, {
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
                        rowElement?.remove();
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
            const tbodyElement = employeeModalElement.querySelector('#employeePropertyTab--current tbody');
            tbodyElement.innerHTML = '';
            for (const employeeProperty of employeeProperties) {
                const rowElement = document.createElement('tr');
                rowElement.dataset.propertyName = employeeProperty.propertyName;
                rowElement.innerHTML = `<td class="is-size-7 is-vcentered">
          ${cityssm.escapeHTML(employeeProperty.propertyName)}
          </td>
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
                rowElement
                    .querySelector('.is-update-button')
                    ?.addEventListener('click', updateEmployeeProperty);
                rowElement
                    .querySelector('.is-delete-button')
                    ?.addEventListener('click', deleteEmployeeProperty);
                tbodyElement.append(rowElement);
            }
        }
        function addEmployeeProperty(formEvent) {
            formEvent.preventDefault();
            const addPropertyFormElement = formEvent.currentTarget;
            cityssm.postJSON(`${Attend.urlPrefix}/admin/doAddEmployeeProperty`, addPropertyFormElement, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Property added successfully.',
                        contextualColorName: 'success',
                        okButton: {
                            callbackFunction() {
                                ;
                                employeeModalElement.querySelector('#employeePropertyAdd--propertyName').focus();
                            }
                        }
                    });
                    addPropertyFormElement.reset();
                    employeeProperties = responseJSON.employeeProperties ?? [];
                    renderEmployeeProperties();
                }
                else {
                    bulmaJS.alert({
                        contextualColorName: 'danger',
                        title: 'Error Adding Property',
                        message: 'The property may already be set. Please check, then try again.'
                    });
                }
            });
        }
        function updateEmployee(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${Attend.urlPrefix}/admin/doUpdateEmployee`, formEvent.currentTarget, (rawResponseJSON) => {
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
                cityssm.postJSON(`${Attend.urlPrefix}/admin/doDeleteEmployee`, {
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
                    callbackFunction: doDelete,
                    text: 'Yes, Delete Employee'
                }
            });
        }
        cityssm.openHtmlModal('employeeAdmin-employee', {
            onshow(modalElement) {
                employeeModalElement = modalElement;
                modalElement.querySelector('.modal-card-title').textContent =
                    `${employee.employeeSurname}, ${employee.employeeGivenName}`;
                modalElement.querySelector('#employeeEdit--employeeNumber').value = employee.employeeNumber;
                modalElement.querySelector('#employeeEdit--employeeNumberSpan').textContent = employee.employeeNumber;
                modalElement.querySelector('#employeeEdit--isActive').value = employee.isActive ? '1' : '0';
                modalElement.querySelector('#employeeEdit--isSynced').value = employee.isSynced ? '1' : '0';
                modalElement.querySelector('#employeeEdit--employeeSurname').value = employee.employeeSurname;
                modalElement.querySelector('#employeeEdit--employeeGivenName').value = employee.employeeGivenName;
                modalElement.querySelector('#employeeEdit--jobTitle').value = employee.jobTitle ?? '';
                modalElement.querySelector('#employeeEdit--userName').value = employee.userName ?? '';
                modalElement.querySelector('#employeeEdit--department').value = employee.department ?? '';
                if ((employee.seniorityDateTime ?? '') !== '') {
                    // eslint-disable-next-line no-extra-semi
                    ;
                    modalElement.querySelector('#employeeEdit--seniorityDateTime').valueAsDate = new Date(employee.seniorityDateTime);
                }
                // Contact Information
                // eslint-disable-next-line no-extra-semi
                ;
                modalElement.querySelector('#employeeEdit--syncContacts').value = employee.syncContacts ? '1' : '0';
                modalElement.querySelector('#employeeEdit--workContact1').value = employee.workContact1 ?? '';
                modalElement.querySelector('#employeeEdit--workContact2').value = employee.workContact2 ?? '';
                if (selfServiceEnabled) {
                    modalElement
                        .querySelector('.is-self-service-message')
                        ?.classList.remove('is-hidden');
                }
                ;
                modalElement.querySelector('#employeeEdit--homeContact1').value = employee.homeContact1 ?? '';
                modalElement.querySelector('#employeeEdit--homeContact2').value = employee.homeContact2 ?? '';
                modalElement.querySelector('#employeePropertyAdd--employeeNumber').value = employee.employeeNumber;
                cityssm.postJSON(`${Attend.urlPrefix}/admin/doGetEmployeeProperties`, {
                    employeeNumber
                }, (rawResponseJSON) => {
                    employeeProperties = rawResponseJSON.employeeProperties;
                    renderEmployeeProperties();
                });
            },
            onshown(modalElement, closeModalFunction) {
                closeEmployeeModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init(modalElement);
                Attend.initializeMenuTabs(modalElement.querySelectorAll('.menu a'), modalElement.querySelectorAll('.tabs-container > article'));
                modalElement
                    .querySelector('#form--employeeEdit')
                    ?.addEventListener('submit', updateEmployee);
                const swapButtonElements = modalElement.querySelectorAll('.is-swap-button');
                for (const buttonElement of swapButtonElements) {
                    buttonElement.addEventListener('click', swapFields);
                }
                modalElement
                    .querySelector('#form--employeePropertyAdd')
                    ?.addEventListener('submit', addEmployeeProperty);
                modalElement
                    .querySelector('.is-delete-employee')
                    ?.addEventListener('click', deleteEmployee);
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
    document
        .querySelector('#is-add-employee-button')
        ?.addEventListener('click', () => {
        let addCloseModalFunction;
        function addEmployee(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${Attend.urlPrefix}/admin/doAddEmployee`, formEvent.currentTarget, (rawResponseJSON) => {
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
                addCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                const employeeNumberElement = modalElement.querySelector('#employeeAdd--employeeNumber');
                if (employeeNumberRegularExpression !== undefined) {
                    employeeNumberElement.pattern =
                        employeeNumberRegularExpression.source;
                }
                employeeNumberElement.focus();
                modalElement
                    .querySelector('form')
                    ?.addEventListener('submit', addEmployee);
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
            panelBlockElement.dataset.employeeNumber = employee.employeeNumber ?? '';
            panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-hard-hat" aria-hidden="true"></i>
        </div>
        <div class="column is-4">
          ${cityssm.escapeHTML(employee.employeeNumber)}
        </div>
        <div class="column">
          ${cityssm.escapeHTML(employee.employeeSurname)}, ${cityssm.escapeHTML(employee.employeeGivenName)}<br />
          <span class="is-size-7">
            ${cityssm.escapeHTML(employee.jobTitle ?? '')}
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
            pagerElement
                .querySelector('.is-previous-button')
                ?.addEventListener('click', goToPrevious);
        }
        if (limit + offset >= filteredEmployees.length) {
            // eslint-disable-next-line no-extra-semi
            ;
            pagerElement.querySelector('.is-next-button').disabled = true;
        }
        else {
            pagerElement
                .querySelector('.is-next-button')
                ?.addEventListener('click', goToNext);
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
            const employeeSearchString = `${possibleEmployee.employeeGivenName} ${possibleEmployee.employeeSurname} ${possibleEmployee.employeeNumber}`.toLowerCase();
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
