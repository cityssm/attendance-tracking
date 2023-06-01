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
    function renderAfterHoursRecords() {
        var _a, _b;
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
        <div class="column">
          <strong>${afterHoursRecord.employeeName}</strong><br />
          <span class="is-size-7">${(_a = afterHoursRecord.employeeNumber) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Type">${afterHoursRecord.afterHoursReason}</strong><br />
          <span class="is-size-7">${(_b = afterHoursRecord.recordComment) !== null && _b !== void 0 ? _b : ''}</span>
        </div>
        </div>`;
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
                    employeeNumberElement.pattern = employeeNumberRegularExpression.source;
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
