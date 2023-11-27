"use strict";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
    const absenceTypes = exports.absenceTypes;
    const employees = exports.employees;
    const employeeNumberRegularExpression = exports.employeeNumberRegularExpression;
    // const updateDays = exports.updateDays as number
    const canUpdateAbsences = exports.absencesCanUpdate;
    // const canManageAbsences = exports.absencesCanManage as boolean
    const canUpdateReturnsToWork = exports.returnsToWorkCanUpdate;
    // const canManageReturnsToWork = exports.returnsToWorkCanManage as boolean
    let absenceRecords = exports.absenceRecords;
    let returnToWorkRecords = exports.returnToWorkRecords;
    function deleteAbsenceRecord(clickEvent) {
        const recordId = clickEvent.currentTarget.closest('.panel-block').dataset.recordId;
        function doDelete() {
            cityssm.postJSON(`${MonTY.urlPrefix}/attendance/doDeleteAbsenceRecord`, {
                recordId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Absence record deleted successfully.',
                        contextualColorName: 'success'
                    });
                    absenceRecords = responseJSON.absenceRecords;
                    renderAbsenceRecords();
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
            title: 'Delete Absence Record',
            message: 'Are you sure you want to delete this absence record?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Record',
                callbackFunction: doDelete
            }
        });
    }
    function renderAbsenceRecords() {
        var _a, _b, _c, _d, _e;
        const containerElement = document.querySelector('#container--absences');
        if (containerElement === null) {
            return;
        }
        if (absenceRecords.length === 0) {
            containerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no recent absence records to show.</p>
        </div>`;
            return;
        }
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        let todayCount = 0;
        for (const absenceRecord of absenceRecords) {
            const absenceDate = new Date(absenceRecord.absenceDateTime);
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.dataset.recordId = absenceRecord.recordId;
            panelBlockElement.tabIndex = 0;
            if (Date.now() - absenceDate.getTime() <= 86400 * 1000) {
                panelBlockElement.classList.add('has-background-success-light');
                todayCount += 1;
            }
            panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
        </div>
        <div class="column is-3">
          <strong data-tooltip="Absence Date">
            ${absenceDate.toLocaleDateString()}
          </strong>
        </div>
        <div class="column is-4">
          <strong>${absenceRecord.employeeName}</strong><br />
          <span class="is-size-7">${(_a = absenceRecord.employeeNumber) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Type">${(_b = absenceRecord.absenceType) !== null && _b !== void 0 ? _b : absenceRecord.absenceTypeKey}</strong><br />
          <span class="is-size-7">${(_c = absenceRecord.recordComment) !== null && _c !== void 0 ? _c : ''}</span>
        </div>
        </div>`;
            if (absenceRecord.canUpdate) {
                (_d = panelBlockElement.querySelector('.columns')) === null || _d === void 0 ? void 0 : _d.insertAdjacentHTML('beforeend', `<div class="column is-narrow">
            <button class="button is-small is-inverted is-danger has-tooltip-left is-delete-button" data-tooltip="Delete Record" data-cy="delete" type="button" aria-label="Delete Record">
              <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
          </div>`);
                (_e = panelBlockElement
                    .querySelector('.is-delete-button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', deleteAbsenceRecord);
            }
            panelElement.append(panelBlockElement);
        }
        containerElement.innerHTML = '';
        containerElement.append(panelElement);
        document.querySelector('#menu--attendance a[href="#tab--absences"] .tag').textContent = todayCount.toString();
    }
    function deleteReturnToWorkRecord(clickEvent) {
        const recordId = clickEvent.currentTarget.closest('.panel-block').dataset.recordId;
        function doDelete() {
            cityssm.postJSON(`${MonTY.urlPrefix}/attendance/doDeleteReturnToWorkRecord`, {
                recordId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Return to work record deleted successfully.',
                        contextualColorName: 'success'
                    });
                    returnToWorkRecords = responseJSON.returnToWorkRecords;
                    renderReturnToWorkRecords();
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
            title: 'Delete Return to Work Record',
            message: 'Are you sure you want to delete this return to work record?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Record',
                callbackFunction: doDelete
            }
        });
    }
    function renderReturnToWorkRecords() {
        var _a, _b, _c, _d, _e;
        const containerElement = document.querySelector('#container--returnsToWork');
        if (containerElement === null) {
            return;
        }
        if (returnToWorkRecords.length === 0) {
            containerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no recent return to work records to show.</p>
        </div>`;
            return;
        }
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        let todayCount = 0;
        for (const returnToWorkRecord of returnToWorkRecords) {
            const returnDate = new Date(returnToWorkRecord.returnDateTime);
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.dataset.recordId = returnToWorkRecord.recordId;
            panelBlockElement.tabIndex = 0;
            if (Date.now() - returnDate.getTime() <= 86400 * 1000) {
                panelBlockElement.classList.add('has-background-success-light');
                todayCount += 1;
            }
            panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
        </div>
        <div class="column is-3">
          <strong data-tooltip="Return Date">${returnDate.toLocaleDateString()}</strong>
        </div>
        <div class="column is-4">
          <strong>${returnToWorkRecord.employeeName}</strong><br />
          <span class="is-size-7">${(_a = returnToWorkRecord.employeeNumber) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        <div class="column">
          <strong data-tooltip="Return Shift">${(_b = returnToWorkRecord.returnShift) !== null && _b !== void 0 ? _b : '(No Shift)'}</strong><br />
          <span class="is-size-7">${(_c = returnToWorkRecord.recordComment) !== null && _c !== void 0 ? _c : ''}</span>
        </div>
        </div>`;
            if (returnToWorkRecord.canUpdate) {
                (_d = panelBlockElement.querySelector('.columns')) === null || _d === void 0 ? void 0 : _d.insertAdjacentHTML('beforeend', `<div class="column is-narrow">
              <button class="button is-small is-inverted is-danger has-tooltip-left is-delete-button" data-tooltip="Delete Record" data-cy="delete" type="button" aria-label="Delete Record">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>`);
                (_e = panelBlockElement
                    .querySelector('.is-delete-button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', deleteReturnToWorkRecord);
            }
            panelElement.append(panelBlockElement);
        }
        containerElement.innerHTML = '';
        containerElement.append(panelElement);
        document.querySelector('#menu--attendance a[href="#tab--returnsToWork"] .tag').textContent = todayCount.toString();
    }
    function openCallInModal(clickEvent) {
        var _a;
        let callInModalElement;
        let callInCloseModalFunction;
        const callInType = (_a = clickEvent.currentTarget.dataset.callInType) !== null && _a !== void 0 ? _a : '';
        let previousEmployeeNumberPiece = '';
        function populateEmployeeName() {
            const employeeNumberElement = callInModalElement.querySelector('#callInAdd--employeeNumber');
            const employeeNumberPiece = employeeNumberElement.value.toLowerCase();
            if (employeeNumberPiece === previousEmployeeNumberPiece) {
                return;
            }
            previousEmployeeNumberPiece = employeeNumberPiece;
            const employeeNameElement = callInModalElement.querySelector('#callInAdd--employeeName');
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
                employeeNameElement.value =
                    `${matchingEmployees[0].employeeGivenName} ${matchingEmployees[0].employeeSurname}`.trim();
            }
        }
        function toggleCallInType() {
            const callInTypeRadioElements = callInModalElement.querySelectorAll('input[name="callInType"]');
            for (const radioElement of callInTypeRadioElements) {
                const labelButtonElement = radioElement.closest('label');
                const fieldsetElement = callInModalElement.querySelector(`fieldset[data-call-in-type="${radioElement.value}"]`);
                if (radioElement.checked) {
                    labelButtonElement.classList.add('is-link');
                    labelButtonElement.querySelector('.icon').innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
                    fieldsetElement.disabled = false;
                    fieldsetElement.classList.remove('is-hidden');
                }
                else {
                    labelButtonElement.classList.remove('is-link');
                    labelButtonElement.querySelector('.icon').innerHTML = '<i class="fas fa-minus" aria-hidden="true"></i>';
                    fieldsetElement.classList.add('is-hidden');
                    fieldsetElement.disabled = true;
                }
            }
        }
        function recordCallIn(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${MonTY.urlPrefix}/attendance/doRecordCallIn`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    callInCloseModalFunction();
                    if (responseJSON.callInType === 'absence') {
                        absenceRecords = responseJSON.absenceRecords;
                        renderAbsenceRecords();
                    }
                    else if (responseJSON.callInType === 'returnToWork') {
                        returnToWorkRecords = responseJSON.returnToWorkRecords;
                        renderReturnToWorkRecords();
                    }
                }
            });
        }
        cityssm.openHtmlModal('callIn-add', {
            onshow(modalElement) {
                var _a, _b;
                callInModalElement = modalElement;
                if (canUpdateAbsences) {
                    // eslint-disable-next-line no-extra-semi
                    ;
                    modalElement.querySelector('#callInAdd--absenceDateString-absence').valueAsDate = new Date();
                    const absenceTypeElement = modalElement.querySelector('#callInAdd--absenceTypeKey-absence');
                    for (const absenceType of absenceTypes) {
                        const optionElement = document.createElement('option');
                        optionElement.value = absenceType.absenceTypeKey;
                        optionElement.textContent = absenceType.absenceType;
                        absenceTypeElement.append(optionElement);
                    }
                }
                else {
                    (_a = modalElement.querySelector('#callInAdd--callInType_absence')) === null || _a === void 0 ? void 0 : _a.remove();
                }
                if (canUpdateReturnsToWork) {
                    // eslint-disable-next-line no-extra-semi
                    ;
                    modalElement.querySelector('#callInAdd--returnDateString-returnToWork').valueAsDate = new Date();
                }
                else {
                    (_b = modalElement
                        .querySelector('#callInAdd--callInType_returnToWork')) === null || _b === void 0 ? void 0 : _b.remove();
                }
                if (callInType !== '') {
                    // eslint-disable-next-line no-extra-semi
                    ;
                    modalElement.querySelector(`#callInAdd--callInType_${callInType}`).checked = true;
                    toggleCallInType();
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b, _c;
                callInCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', recordCallIn);
                const employeeNumberElement = modalElement.querySelector('#callInAdd--employeeNumber');
                if (employeeNumberRegularExpression !== undefined) {
                    employeeNumberElement.pattern = employeeNumberRegularExpression.source;
                }
                employeeNumberElement.focus();
                employeeNumberElement.addEventListener('keyup', populateEmployeeName);
                (_b = modalElement
                    .querySelector('#callInAdd--callInType_absence')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', toggleCallInType);
                (_c = modalElement
                    .querySelector('#callInAdd--callInType_returnToWork')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', toggleCallInType);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    if (canUpdateAbsences || canUpdateReturnsToWork) {
        const addCallInButtonElements = document.querySelectorAll('.is-new-call-in-button');
        for (const buttonElement of addCallInButtonElements) {
            buttonElement.addEventListener('click', openCallInModal);
        }
    }
    renderAbsenceRecords();
    renderReturnToWorkRecords();
})();
