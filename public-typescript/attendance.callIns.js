"use strict";
/* eslint-disable unicorn/prefer-string-replace-all */
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
    const absenceTypes = exports.absenceTypes;
    const employees = exports.employees;
    const canUpdateAbsences = exports.absencesCanUpdate;
    const canUpdateReturnsToWork = exports.returnsToWorkCanUpdate;
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
                }
            });
        }
        cityssm.openHtmlModal('callIn-add', {
            onshow(modalElement) {
                var _a, _b;
                callInModalElement = modalElement;
                if (canUpdateAbsences) {
                    ;
                    modalElement.querySelector('#callInAdd--absenceDateTime-absence').valueAsDate = new Date();
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
    const addCallInButtonElements = document.querySelectorAll('.is-new-call-in-button');
    for (const buttonElement of addCallInButtonElements) {
        buttonElement.addEventListener('click', openCallInModal);
    }
})();
