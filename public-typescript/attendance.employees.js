"use strict";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const Attend = exports.Attend;
    const employees = exports.employees;
    const absencesCanView = Object.prototype.hasOwnProperty.call(exports, 'absenceRecords');
    const returnsToWorkCanView = Object.prototype.hasOwnProperty.call(exports, 'returnToWorkRecords');
    const callOutsCanView = Object.prototype.hasOwnProperty.call(exports, 'callOutLists');
    const afterHoursCanView = Object.prototype.hasOwnProperty.call(exports, 'afterHoursRecords');
    const filterElement = document.querySelector('#employees--searchFilter');
    const employeesContainerElement = document.querySelector('#container--employees');
    function insertRecord(panelElement, panelBlockElementToInsert) {
        var _a, _b;
        let inserted = false;
        const panelBlockElements = panelElement.querySelectorAll('.panel-block');
        for (const panelBlockElement of panelBlockElements) {
            if (Number.parseInt((_a = panelBlockElement.dataset.recordCreate_timeMillis) !== null && _a !== void 0 ? _a : '0', 10) <
                Number.parseInt((_b = panelBlockElementToInsert.dataset.recordCreate_timeMillis) !== null && _b !== void 0 ? _b : '0', 10)) {
                panelBlockElement.before(panelBlockElementToInsert);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            panelElement.append(panelBlockElementToInsert);
        }
    }
    function openEmployeeModal(employeeNumber) {
        let employeeModalElement;
        const employee = employees.find((possibleEmployee) => {
            return possibleEmployee.employeeNumber === employeeNumber;
        });
        function renderAttendanceRecords(records) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            const containerElement = employeeModalElement.querySelector('#container--attendanceLog');
            for (const absenceRecord of records.absenceRecords) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.recordCreate_timeMillis = new Date(absenceRecord.recordCreate_dateTime)
                    .getTime()
                    .toString();
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow has-tooltip-right" data-tooltip="Absence">
            <i class="fas fa-fw fa-sign-out-alt" aria-label="Absence"></i>
          </div>
          <div class="column">
            <strong>${new Date(absenceRecord.absenceDateTime).toLocaleDateString()}</strong>
          </div>
          <div class="column">
            <strong>${(_a = absenceRecord.absenceType) !== null && _a !== void 0 ? _a : ''}</strong><br />
            <span class="is-size-7">${(_b = absenceRecord.recordComment) !== null && _b !== void 0 ? _b : ''}</span>
          </div>
          </div>`;
                panelElement.append(panelBlockElement);
            }
            for (const returnToWorkRecord of records.returnToWorkRecords) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.recordCreate_timeMillis = new Date(returnToWorkRecord.recordCreate_dateTime)
                    .getTime()
                    .toString();
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow has-tooltip-right" data-tooltip="Return to Work">
            <i class="fas fa-fw fa-sign-in-alt" aria-label="Return to Work"></i>
          </div>
          <div class="column">
            <strong>${new Date(returnToWorkRecord.returnDateTime).toLocaleDateString()}</strong><br />
            ${(_c = returnToWorkRecord.returnShift) !== null && _c !== void 0 ? _c : ''}
          </div>
          <div class="column">
            <strong>Return to Work</strong><br />
            <span class="is-size-7">${(_d = returnToWorkRecord.recordComment) !== null && _d !== void 0 ? _d : ''}</span>
          </div>
          </div>`;
                insertRecord(panelElement, panelBlockElement);
            }
            for (const callOutRecord of records.callOutRecords) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.recordCreate_timeMillis = new Date(callOutRecord.recordCreate_dateTime)
                    .getTime()
                    .toString();
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow has-tooltip-right" data-tooltip="Call Out">
            <i class="fas fa-fw fa-phone" aria-label="Call Out"></i>
          </div>
          <div class="column">
            <strong>${new Date(callOutRecord.callOutDateTime).toLocaleDateString()}</strong><br />
            <span class="is-size-7">
              <i class="fas fa-fw ${((_e = callOutRecord.isSuccessful) !== null && _e !== void 0 ? _e : false)
                    ? ' fa-check has-text-success'
                    : ' fa-times has-text-danger'}" aria-hidden="true"></i>
              ${(_f = callOutRecord.responseType) !== null && _f !== void 0 ? _f : ''}
            </span>
          </div>
          <div class="column">
            <strong>Call Out</strong><br />
            <span class="is-size-7">
                <span class="has-tooltip-right" data-tooltip="Nature of Call Out">
                <i class="fas fa-fw fa-info-circle" aria-hidden="true"></i>
                ${(_g = callOutRecord.natureOfCallOut) !== null && _g !== void 0 ? _g : ''}
              </span><br />
              <span class="has-tooltip-right" data-tooltip="Comment">
                <i class="fas fa-fw fa-comment" aria-hidden="true"></i>
                ${(_h = callOutRecord.recordComment) !== null && _h !== void 0 ? _h : ''}
              </span>
            </span>
          </div>
          </div>`;
                insertRecord(panelElement, panelBlockElement);
            }
            if (panelElement.hasChildNodes()) {
                containerElement.innerHTML = '';
                containerElement.append(panelElement);
            }
            else {
                containerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">There are no attendance records in the past ${exports.recentDays} days.</p>
          </div>`;
            }
        }
        cityssm.openHtmlModal('attendance-employee', {
            onshow(modalElement) {
                employeeModalElement = modalElement;
                modalElement.querySelector('#container--attendanceLogEmployee').innerHTML = `<div class="columns">
            <div class="column is-5">
              <strong>Employee Number</strong><br />
              ${employee.employeeNumber}
            </div>
            <div class="column">
              <strong>Employee Name</strong><br />
              ${employee.employeeSurname}, ${employee.employeeGivenName}
            </div>
          </div>`;
                cityssm.postJSON(`${Attend.urlPrefix}/attendance/doGetAttendanceRecords`, {
                    employeeNumber
                }, (rawResponseJSON) => {
                    renderAttendanceRecords(rawResponseJSON);
                });
            },
            onshown(modalElement) {
                bulmaJS.toggleHtmlClipped();
                Attend.initializeMenuTabs(modalElement.querySelectorAll('.menu a'), modalElement.querySelectorAll('article'));
                const reportsPanelElement = modalElement.querySelector('#tab--attendanceReports .panel');
                if (absencesCanView) {
                    reportsPanelElement === null || reportsPanelElement === void 0 ? void 0 : reportsPanelElement.insertAdjacentHTML('beforeend', `<a class="panel-block" href="${Attend.urlPrefix}/reports/absenceRecords-recent-byEmployeeNumber/?employeeNumber=${employeeNumber}" download>
              <div class="columns is-mobile is-variable is-2">
                <div class="column is-narrow">
                  <i class="fas fa-2x fa-file" aria-hidden="true"></i>
                </div>
                <div class="column">
                Recent Absence Records
                </div>
              </div>
            </a>`);
                }
                if (returnsToWorkCanView) {
                    reportsPanelElement === null || reportsPanelElement === void 0 ? void 0 : reportsPanelElement.insertAdjacentHTML('beforeend', `<a class="panel-block" href="${Attend.urlPrefix}/reports/returnToWorkRecords-recent-byEmployeeNumber/?employeeNumber=${employeeNumber}" download>
              <div class="columns is-mobile is-variable is-2">
                <div class="column is-narrow">
                  <i class="fas fa-2x fa-file" aria-hidden="true"></i>
                </div>
                <div class="column">
                Recent Return to Work Records
                </div>
              </div>
            </a>`);
                }
                if (callOutsCanView) {
                    reportsPanelElement === null || reportsPanelElement === void 0 ? void 0 : reportsPanelElement.insertAdjacentHTML('beforeend', `<a class="panel-block" href="${Attend.urlPrefix}/reports/callOutRecords-recent-byEmployeeNumber/?employeeNumber=${employeeNumber}" download>
              <div class="columns is-mobile is-variable is-2">
                <div class="column is-narrow">
                  <i class="fas fa-2x fa-file" aria-hidden="true"></i>
                </div>
                <div class="column">
                Recent Call Out Records
                </div>
              </div>
            </a>`);
                }
                if (afterHoursCanView) {
                    reportsPanelElement === null || reportsPanelElement === void 0 ? void 0 : reportsPanelElement.insertAdjacentHTML('beforeend', `<a class="panel-block" href="${Attend.urlPrefix}/reports/afterHoursRecords-recent-byEmployeeNumber/?employeeNumber=${employeeNumber}" download>
              <div class="columns is-mobile is-variable is-2">
                <div class="column is-narrow">
                  <i class="fas fa-2x fa-file" aria-hidden="true"></i>
                </div>
                <div class="column">
                Recent After Hours Records
                </div>
              </div>
            </a>`);
                }
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openEmployeeModalByClick(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const employeeNumber = (_a = clickEvent.currentTarget.dataset.employeeNumber) !== null && _a !== void 0 ? _a : '';
        openEmployeeModal(employeeNumber);
    }
    function renderEmployees() {
        var _a;
        if (employees.length === 0) {
            employeesContainerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active employees to report.</p>
        </div>`;
            return;
        }
        const searchStringPieces = filterElement.value
            .trim()
            .toLowerCase()
            .split(' ');
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        // eslint-disable-next-line no-labels
        employeeLoop: for (const employee of employees) {
            const employeeSearchString = `${employee.employeeNumber} ${employee.employeeGivenName} ${employee.employeeSurname}`.toLowerCase();
            for (const searchStringPiece of searchStringPieces) {
                if (!employeeSearchString.includes(searchStringPiece)) {
                    // eslint-disable-next-line no-labels
                    continue employeeLoop;
                }
            }
            const panelBlockElement = document.createElement('a');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.dataset.employeeNumber = employee.employeeNumber;
            panelBlockElement.href = '#';
            panelBlockElement.innerHTML = `<div class="columns is-mobile is-variable is-1">
        <div class="column is-narrow">
          <i class="fas fa-hard-hat" aria-hidden="true"></i>
        </div>
        <div class="column is-4">
          <strong>${employee.employeeNumber}</strong>
        </div>
        <div class="column">
          <strong>${employee.employeeSurname}, ${employee.employeeGivenName}</strong><br />
          <span class="is-size-7">${(_a = employee.jobTitle) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        </div>`;
            panelBlockElement.addEventListener('click', openEmployeeModalByClick);
            panelElement.append(panelBlockElement);
        }
        if (!panelElement.hasChildNodes()) {
            employeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no active employees that meet the search criteria.</p>
        </div>`;
            return;
        }
        employeesContainerElement.innerHTML = '';
        employeesContainerElement.append(panelElement);
    }
    renderEmployees();
    filterElement.addEventListener('keyup', renderEmployees);
})();
