"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
    const absenceTypes = exports.absenceTypes;
    const employees = exports.employees;
    const canUpdateAbsences = exports.absencesCanUpdate;
    const canUpdateReturnsToWork = exports.returnsToWorkCanUpdate;
    let absenceRecords = exports.absenceRecords;
    let returnToWorkRecords = exports.returnToWorkRecords;
    function renderAbsenceRecords() {
        var _a, _b, _c;
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
        for (const absenceRecord of absenceRecords) {
            const absenceDate = new Date(absenceRecord.absenceDateTime);
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            if (Date.now() - absenceDate.getTime() <= 86400 * 1000) {
                panelBlockElement.classList.add('has-background-success-light');
            }
            panelBlockElement.innerHTML = `<div class="columns">
        <div class="column is-narrow">
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Date">
            ${absenceDate.toLocaleDateString()}
          </strong>
        </div>
        <div class="column">
          <strong>${absenceRecord.employeeName}</strong><br />
          <span class="is-size-7">${(_a = absenceRecord.employeeNumber) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        <div class="column">
          <strong data-tooltip="Absence Type">${(_b = absenceRecord.absenceType) !== null && _b !== void 0 ? _b : absenceRecord.absenceTypeKey}</strong><br />
          <span class="is-size-7">${(_c = absenceRecord.recordComment) !== null && _c !== void 0 ? _c : ''}</span>
        </div>
        </div>`;
            panelElement.append(panelBlockElement);
        }
        containerElement.innerHTML = '';
        containerElement.append(panelElement);
    }
    function renderReturnToWorkRecords() {
        var _a, _b, _c;
        const containerElement = document.querySelector('#container--returnsToWork');
        if (containerElement === null) {
            return;
        }
        if (absenceRecords.length === 0) {
            containerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no recent return to work records to show.</p>
        </div>`;
            return;
        }
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        for (const returnToWorkRecord of returnToWorkRecords) {
            const returnDate = new Date(returnToWorkRecord.returnDateTime);
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            if (Date.now() - returnDate.getTime() <= 86400 * 1000) {
                panelBlockElement.classList.add('has-background-success-light');
            }
            panelBlockElement.innerHTML = `<div class="columns">
        <div class="column is-narrow">
          <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
        </div>
        <div class="column">
          <strong data-tooltip="Return Date">${returnDate.toLocaleDateString()}</strong>
        </div>
        <div class="column">
          <strong>${returnToWorkRecord.employeeName}</strong><br />
          <span class="is-size-7">${(_a = returnToWorkRecord.employeeNumber) !== null && _a !== void 0 ? _a : ''}</span>
        </div>
        <div class="column">
          <strong data-tooltip="Return Shift">${(_b = returnToWorkRecord.returnShift) !== null && _b !== void 0 ? _b : '(No Shift)'}</strong><br />
          <span class="is-size-7">${(_c = returnToWorkRecord.recordComment) !== null && _c !== void 0 ? _c : ''}</span>
        </div>
        </div>`;
            panelElement.append(panelBlockElement);
        }
        containerElement.innerHTML = '';
        containerElement.append(panelElement);
    }
    function openCallInModal(clickEvent) {
        let callInModalElement;
        let callInCloseModalFunction;
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
                employeeNameElement.value = (matchingEmployees[0].employeeGivenName +
                    ' ' +
                    matchingEmployees[0].employeeSurname).trim();
            }
        }
        function toggleCallInType() {
            const callInTypeRadioElements = callInModalElement.querySelectorAll('input[name="callInType"]');
            for (const radioElement of callInTypeRadioElements) {
                const labelButtonElement = radioElement.closest('label');
                const fieldsetElement = callInModalElement.querySelector(`fieldset[data-call-in-type="${radioElement.value}"]`);
                if (radioElement.checked) {
                    labelButtonElement.classList.add('is-link');
                    labelButtonElement.querySelector('.icon').innerHTML =
                        '<i class="fas fa-check" aria-hidden="true"></i>';
                    fieldsetElement.disabled = false;
                    fieldsetElement.classList.remove('is-hidden');
                }
                else {
                    labelButtonElement.classList.remove('is-link');
                    labelButtonElement.querySelector('.icon').innerHTML =
                        '<i class="fas fa-minus" aria-hidden="true"></i>';
                    fieldsetElement.classList.add('is-hidden');
                    fieldsetElement.disabled = true;
                }
            }
        }
        function recordCallIn(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doRecordCallIn', formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    callInCloseModalFunction();
                    switch (responseJSON.callInType) {
                        case 'absence': {
                            absenceRecords = responseJSON.absenceRecords;
                            renderAbsenceRecords();
                            break;
                        }
                        case 'returnToWork': {
                            returnToWorkRecords = responseJSON.returnToWorkRecords;
                            renderReturnToWorkRecords();
                            break;
                        }
                    }
                }
            });
        }
        cityssm.openHtmlModal('callIn-add', {
            onshow(modalElement) {
                var _a, _b;
                callInModalElement = modalElement;
                if (canUpdateAbsences) {
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
                if (!canUpdateReturnsToWork) {
                    (_b = modalElement
                        .querySelector('#callInAdd--callInType_returnToWork')) === null || _b === void 0 ? void 0 : _b.remove();
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b, _c, _d;
                callInCloseModalFunction = closeModalFunction;
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', recordCallIn);
                (_b = modalElement
                    .querySelector('#callInAdd--employeeNumber')) === null || _b === void 0 ? void 0 : _b.addEventListener('keyup', populateEmployeeName);
                (_c = modalElement
                    .querySelector('#callInAdd--callInType_absence')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', toggleCallInType);
                (_d = modalElement
                    .querySelector('#callInAdd--callInType_returnToWork')) === null || _d === void 0 ? void 0 : _d.addEventListener('change', toggleCallInType);
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
