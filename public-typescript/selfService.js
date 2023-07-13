"use strict";
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const urlPrefix = exports.urlPrefix;
    /*
     * Employee Tab
     */
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
            var _a, _b, _c, _d, _e, _f;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                employeeMessageContainerElement.innerHTML = '';
                (_a = document.querySelector('#tab--employee')) === null || _a === void 0 ? void 0 : _a.classList.add('is-hidden');
                document.querySelector('#employeeOptions--employeeName').textContent = (_b = responseJSON.employeeName) !== null && _b !== void 0 ? _b : '';
                (_c = document
                    .querySelector('#tab--employeeOptions')) === null || _c === void 0 ? void 0 : _c.classList.remove('is-hidden');
                (_d = document
                    .querySelector('#employeeOptionsTab--menu')) === null || _d === void 0 ? void 0 : _d.classList.remove('is-hidden');
            }
            else {
                if ((_e = responseJSON.isAbuser) !== null && _e !== void 0 ? _e : false) {
                    window.location.reload();
                }
                employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
            <p class="message-body">
            <strong>${(_f = responseJSON.errorMessage) !== null && _f !== void 0 ? _f : ''}</strong><br />
            If errors persist, please contact a manager for assistance.</p>
            </div>`;
            }
        });
    }
    (_a = document
        .querySelector('#employee--nextButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', validateEmployee);
    /*
     * Sign Out
     */
    function signOut(clickEvent) {
        var _a;
        if (clickEvent !== undefined) {
            clickEvent.preventDefault();
        }
        // Hide all tabs
        const panelTabElements = document.querySelectorAll('.panel-tab, .employeeOptionsTab');
        for (const panelTabElement of panelTabElements) {
            panelTabElement.classList.add('is-hidden');
        }
        employeeNumberElement.value = '';
        employeeHomeContactLastFourDigitsElement.value = '';
        employeeMessageContainerElement.innerHTML = '';
        (_a = document.querySelector('#tab--employee')) === null || _a === void 0 ? void 0 : _a.classList.remove('is-hidden');
    }
    const signOutButtonElements = document.querySelectorAll('.is-sign-out-button');
    for (const signOutButtonElement of signOutButtonElements) {
        signOutButtonElement.addEventListener('click', signOut);
    }
    function monitorInactivity() {
        let time;
        window.addEventListener('load', resetTimer);
        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keydown', resetTimer);
        function resetTimer() {
            window.clearTimeout(time);
            time = window.setTimeout(signOut, 2 * 60 * 1000); // 2 minutes
        }
    }
    window.addEventListener('load', monitorInactivity);
    /*
     * Select Employee Option
     */
    function selectEmployeeOptionTab(clickEvent) {
        var _a, _b;
        clickEvent.preventDefault();
        const tabHash = clickEvent.currentTarget.hash;
        (_a = document
            .querySelector('#employeeOptionsTab--menu')) === null || _a === void 0 ? void 0 : _a.classList.add('is-hidden');
        // Chage to switch if more options are added
        if (tabHash === '#employeeOptionsTab--callOutListAdd') {
            loadCallOutLists();
        }
        (_b = document.querySelector(tabHash)) === null || _b === void 0 ? void 0 : _b.classList.remove('is-hidden');
    }
    const employeeOptionTabElements = document.querySelectorAll('#employeeOptionsTab--menu a.panel-block');
    for (const employeeOptionTabElement of employeeOptionTabElements) {
        employeeOptionTabElement.addEventListener('click', selectEmployeeOptionTab);
    }
    function backToOptions(clickEvent) {
        var _a;
        if (clickEvent !== undefined) {
            clickEvent.preventDefault();
        }
        // Hide all tabs
        const panelTabElements = document.querySelectorAll('.employeeOptionsTab');
        for (const panelTabElement of panelTabElements) {
            panelTabElement.classList.add('is-hidden');
        }
        (_a = document
            .querySelector('#employeeOptionsTab--menu')) === null || _a === void 0 ? void 0 : _a.classList.remove('is-hidden');
    }
    const backToOptionsElements = document.querySelectorAll('.is-back-to-options-button');
    for (const backToOptionsElement of backToOptionsElements) {
        backToOptionsElement.addEventListener('click', backToOptions);
    }
    /*
     * Call Out List Add
     */
    function addEmployeeToCallOutList(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const buttonElement = clickEvent.currentTarget;
        buttonElement.disabled = true;
        buttonElement.classList.add('is-loading');
        const panelBlockElement = buttonElement.closest('.panel-block');
        const listId = (_a = panelBlockElement.dataset.listId) !== null && _a !== void 0 ? _a : '';
        let selfSignUpKey = '';
        const selfSignUpKeyElement = panelBlockElement.querySelector('#callOutListAdd--selfSignUpKey_' + listId);
        if (selfSignUpKeyElement !== null) {
            selfSignUpKey = selfSignUpKeyElement.value;
            if (selfSignUpKey === '') {
                ;
                selfSignUpKeyElement.focus();
                buttonElement.disabled = false;
                buttonElement.classList.remove('is-loading');
                return;
            }
        }
        cityssm.postJSON(urlPrefix + '/doAddEmployeeToCallOutList', {
            employeeNumber: employeeNumberElement.value,
            employeeHomeContactLastFourDigits: employeeHomeContactLastFourDigitsElement.value,
            listId,
            selfSignUpKey
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                panelBlockElement.querySelector('.is-add-button-container').innerHTML =
                    '<i class="fas fa-check" aria-hidden="true"></i> Added to List';
            }
            else {
                bulmaJS.alert({
                    title: 'Error Adding Employee to List',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : 'Unknown error.  Please try again',
                    contextualColorName: 'danger'
                });
                buttonElement.disabled = false;
                buttonElement.classList.remove('is-loading');
            }
        });
    }
    function loadCallOutLists() {
        const containerElement = document.querySelector('#container--callOutListAdd');
        containerElement.innerHTML = `<p class="has-text-centered">
      <i class="fas fa-4x fa-cog fa-spin" aria-hidden="true"></i><br />
      <em>Loading call out lists...</em>
      </p>`;
        cityssm.postJSON(urlPrefix + '/doGetAvailableCallOutLists', {
            employeeNumber: employeeNumberElement.value,
            employeeHomeContactLastFourDigits: employeeHomeContactLastFourDigitsElement.value
        }, (rawResponseJSON) => {
            var _a, _b, _c;
            const responseJSON = rawResponseJSON;
            if (responseJSON.callOutLists.length === 0) {
                containerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">
            There are no call out lists that you are eligible to sign up for.
          </p>
          </div>`;
                return;
            }
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            for (const callOutList of responseJSON.callOutLists) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className =
                    'panel-block is-justify-content-space-between';
                panelBlockElement.dataset.listId = callOutList.listId;
                panelBlockElement.innerHTML = `<div>
            <strong>${callOutList.listName}</strong><br />
            ${(_a = callOutList.listDescription) !== null && _a !== void 0 ? _a : ''}
            </div>
            <div class="is-add-button-container"></div>`;
                if ((_b = callOutList.hasSelfSignUpKey) !== null && _b !== void 0 ? _b : true) {
                    panelBlockElement.querySelector('.is-add-button-container').innerHTML = `<div class="field has-addons">
                <div class="control has-icons-left">
                  <input class="input"
                    id="callOutListAdd--selfSignUpKey_${callOutList.listId}"
                    name="selfSignUpKey_${callOutList.listId}"
                    type="text"
                    placeholder="Sign Up Key"
                    maxlength="10"
                    aria-label="Sign Up Key"
                    required />
                  <span class="icon is-small is-left">
                    <i class="fas fa-key" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="control">
                  <button class="button is-success is-add-button" type="button">
                    <span class="icon"><i class="fas fa-plus" aria-hidden="true"></i></span>
                    <span>Add to List</span>
                  </button>
                </div>
              </div>`;
                }
                else {
                    panelBlockElement.querySelector('.is-add-button-container').innerHTML = `<button class="button is-success is-add-button" type="button">
                <span class="icon"><i class="fas fa-plus" aria-hidden="true"></i></span>
                <span>Add to List</span>
              </button>`;
                }
                (_c = panelBlockElement
                    .querySelector('.is-add-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', addEmployeeToCallOutList);
                panelElement.append(panelBlockElement);
            }
            containerElement.innerHTML = '';
            containerElement.append(panelElement);
        });
    }
})();
