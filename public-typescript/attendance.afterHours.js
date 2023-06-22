"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const MonTY = exports.MonTY;
    const afterHoursReasons = exports.afterHoursReasons;
    const employees = exports.employees;
    let afterHoursRecords = exports.afterHoursRecords;
    const employeeNumberRegularExpression = exports.employeeNumberRegularExpression;
    // const canUpdateAfterHours = exports.afterHoursCanUpdate as boolean
    function deleteAfterHoursRecord(clickEvent) {
        const recordId = clickEvent.currentTarget.closest('.panel-block').dataset.recordId;
        function doDelete() {
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doDeleteAfterHoursRecord', {
                recordId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'After hours record deleted successfully.',
                        contextualColorName: 'success'
                    });
                    afterHoursRecords = responseJSON.afterHoursRecords;
                    renderAfterHoursRecords();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Deleting Record',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Delete After Hours Record',
            message: 'Are you sure you want to delete this after hours record?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Record',
                callbackFunction: doDelete
            }
        });
    }
    function renderAfterHoursRecords() {
        var _a, _b, _c, _d;
        const containerElement = document.querySelector('#container--afterHours');
        if (containerElement === null) {
            return;
        }
        if (afterHoursRecords.length === 0) {
            containerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no recent after hours records to show.</p>
        </div>`;
            return;
        }
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        let todayCount = 0;
        for (const afterHoursRecord of afterHoursRecords) {
            const attendanceDateTime = new Date(afterHoursRecord.attendanceDateTime);
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.dataset.recordId = afterHoursRecord.recordId;
            if (Date.now() - attendanceDateTime.getTime() <= 86400 * 1000) {
                panelBlockElement.classList.add('has-background-success-light');
                todayCount += 1;
            }
            panelBlockElement.tabIndex = 0;
            panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-clock" aria-hidden="true"></i>
        </div>
        <div class="column is-3">
          <strong data-tooltip="Attendance Date">
            ${attendanceDateTime.toLocaleDateString()}
            </strong><br />
            <span class="is-size-7">${attendanceDateTime.toLocaleTimeString()}</span>
        </div>
        <div class="column is-4">
          <strong>${afterHoursRecord.employeeName}</strong><br />
          <span class="is-size-7">${(_a = afterHoursRecord.employeeNumber) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Type">${afterHoursRecord.afterHoursReason}</strong><br />
          <span class="is-size-7">${(_b = afterHoursRecord.recordComment) !== null && _b !== void 0 ? _b : ''}</span>
        </div>
        </div>`;
            if (afterHoursRecord.canUpdate) {
                (_c = panelBlockElement.querySelector('.columns')) === null || _c === void 0 ? void 0 : _c.insertAdjacentHTML('beforeend', `<div class="column is-narrow">
              <button class="button is-small is-inverted is-danger is-delete-button" data-cy="delete" type="button" aria-label="Delete Record">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>`);
                (_d = panelBlockElement
                    .querySelector('.is-delete-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', deleteAfterHoursRecord);
            }
            panelElement.append(panelBlockElement);
        }
        containerElement.innerHTML = '';
        containerElement.append(panelElement);
        document.querySelector('#menu--attendance a[href="#tab--afterHours"] .tag').textContent = todayCount.toString();
    }
    (_a = document
        .querySelector('.is-new-after-hours-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let afterHoursModalElement;
        let afterHoursCloseModalFunction;
        let previousEmployeeNumberPiece = '';
        function populateEmployeeName() {
            const employeeNumberElement = afterHoursModalElement.querySelector('#afterHoursAdd--employeeNumber');
            const employeeNumberPiece = employeeNumberElement.value.toLowerCase();
            if (employeeNumberPiece === previousEmployeeNumberPiece) {
                return;
            }
            previousEmployeeNumberPiece = employeeNumberPiece;
            const employeeNameElement = afterHoursModalElement.querySelector('#afterHoursAdd--employeeName');
            employeeNameElement.value = '';
            const matchingEmployees = employees.filter((possibleEmployee) => {
                return (employeeNumberPiece.length >=
                    possibleEmployee.employeeNumber.length / 2 &&
                    possibleEmployee.employeeNumber
                        .toLowerCase()
                        .endsWith(employeeNumberPiece));
            });
            if (matchingEmployees.length === 1) {
                employeeNumberElement.value = matchingEmployees[0].employeeNumber;
                previousEmployeeNumberPiece =
                    matchingEmployees[0].employeeNumber.toLowerCase();
                employeeNameElement.value = (matchingEmployees[0].employeeGivenName +
                    ' ' +
                    matchingEmployees[0].employeeSurname).trim();
            }
        }
        function recordAfterHours(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doAddAfterHoursRecord', formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    afterHoursCloseModalFunction();
                    bulmaJS.alert({
                        message: 'After hours attendance recorded successfully.'
                    });
                    afterHoursRecords = responseJSON.afterHoursRecords;
                    renderAfterHoursRecords();
                }
            });
        }
        cityssm.openHtmlModal('afterHours-add', {
            onshow(modalElement) {
                afterHoursModalElement = modalElement;
                const afterHoursReasonElement = modalElement.querySelector('#afterHoursAdd--afterHoursReasonId');
                for (const reason of afterHoursReasons) {
                    const optionElement = document.createElement('option');
                    optionElement.value = reason.afterHoursReasonId.toString();
                    optionElement.textContent = reason.afterHoursReason;
                    afterHoursReasonElement.append(optionElement);
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                afterHoursCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', recordAfterHours);
                const employeeNumberElement = modalElement.querySelector('#afterHoursAdd--employeeNumber');
                if (employeeNumberRegularExpression !== undefined) {
                    employeeNumberElement.pattern =
                        employeeNumberRegularExpression.source;
                }
                employeeNumberElement.focus();
                employeeNumberElement.addEventListener('keyup', populateEmployeeName);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderAfterHoursRecords();
})();
