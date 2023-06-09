"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const urlPrefix = exports.urlPrefix;
    // Employee Tab
    const employeeMessageContainerElement = document.querySelector('#employee--message');
    const employeeNumberElement = document.querySelector('#employee--employeeNumber');
    function employeeKeyUp(event) {
        if (event.key === 'Enter') {
            validateEmployee();
        }
        else if (event.key !== 'Shift' && event.key !== 'Tab') {
            employeeMessageContainerElement.innerHTML = '';
        }
    }
    employeeNumberElement.addEventListener('keyup', employeeKeyUp);
    const employeeHomeContactLastFourDigitsElement = document.querySelector('#employee--homeContact_lastFourDigits');
    employeeHomeContactLastFourDigitsElement.addEventListener('keyup', employeeKeyUp);
    function validateEmployee() {
        employeeMessageContainerElement.innerHTML = `<p class="has-text-centered">
      <i class="fas fa-4x fa-cog fa-spin" aria-hidden="true"></i><br />
      <em>Loading employee...</em>
      </p>`;
        if (!employeeNumberElement.checkValidity()) {
            employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
        <p class="message-body">
        Please enter a valid <strong>Employee Number</strong>.
        </p>
        </div>`;
            employeeNumberElement.focus();
            return;
        }
        if (!employeeHomeContactLastFourDigitsElement.checkValidity()) {
            employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
        <p class="message-body">
        Please enter a valid <strong>Last Four Digits</strong>.
        </p>
        </div>`;
            employeeHomeContactLastFourDigitsElement.focus();
            return;
        }
        cityssm.postJSON(urlPrefix + '/doValidateEmployee', {
            employeeNumber: employeeNumberElement.value,
            employeeHomeContactLastFourDigits: employeeHomeContactLastFourDigitsElement.value
        }, (rawResponseJSON) => {
            var _a, _b, _c, _d;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                employeeMessageContainerElement.innerHTML = '';
                (_a = document.querySelector('#tab--employee')) === null || _a === void 0 ? void 0 : _a.classList.add('is-hidden');
                document.querySelector('#employeeOptions--employeeName').textContent = (_b = responseJSON.employeeName) !== null && _b !== void 0 ? _b : '';
                (_c = document
                    .querySelector('#tab--employeeOptions')) === null || _c === void 0 ? void 0 : _c.classList.remove('is-hidden');
            }
            else {
                employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
            <p class="message-body">
            <strong>${(_d = responseJSON.errorMessage) !== null && _d !== void 0 ? _d : ''}</strong><br />
            If errors persist, please contact a manager for assistance.</p>
            </div>`;
            }
        });
    }
    (_a = document
        .querySelector('#employee--nextButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', validateEmployee);
    // Select Employee Option
    // Call Out List Add
})();
