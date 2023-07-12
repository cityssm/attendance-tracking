"use strict";
/* eslint-disable unicorn/prefer-query-selector */
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b, _c;
    const MonTY = exports.MonTY;
    const updateButtonClassName = 'is-update-button';
    const upButtonClassName = 'is-up-button';
    const downButtonClassName = 'is-down-button';
    const deleteButtonClassName = 'is-delete-button';
    function setRowBackgroundColor(changeEvent) {
        ;
        changeEvent.currentTarget
            .closest('tr')
            .classList.add('has-background-warning-light');
    }
    let absenceTypes = exports.absenceTypes;
    delete exports.absenceTypes;
    function updateAbsenceType(clickEvent) {
        const rowElement = clickEvent.currentTarget.closest('tr');
        const absenceTypeKey = rowElement.dataset.absenceTypeKey;
        const absenceType = rowElement.querySelector('input').value;
        cityssm.postJSON(MonTY.urlPrefix + '/admin/doUpdateAbsenceType', {
            absenceTypeKey,
            absenceType
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                bulmaJS.alert({
                    message: 'Absence type updated successfully.'
                });
                rowElement.classList.remove('has-background-warning-light');
            }
        });
    }
    function moveAbsenceType(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const tableRowElement = buttonElement.closest('tr');
        const absenceTypeKey = tableRowElement.dataset.absenceTypeKey;
        cityssm.postJSON(MonTY.urlPrefix +
            '/admin/' +
            (buttonElement.dataset.direction === 'up'
                ? 'doMoveAbsenceTypeUp'
                : 'doMoveAbsenceTypeDown'), {
            absenceTypeKey,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                absenceTypes = responseJSON.absenceTypes;
                renderAbsenceTypes();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Moving Absence Type',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function deleteAbsenceType(clickEvent) {
        const rowElement = clickEvent.currentTarget.closest('tr');
        const absenceTypeKey = rowElement.dataset.absenceTypeKey;
        function doDelete() {
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doDeleteAbsenceType', {
                absenceTypeKey
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    absenceTypes = responseJSON.absenceTypes;
                    renderAbsenceTypes();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Deleting Absence Type',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Delete Absence Type',
            message: 'Are you sure you want to delete this absence type?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Absence Type',
                callbackFunction: doDelete
            }
        });
    }
    function renderAbsenceTypes() {
        const containerElement = document.querySelector('#container--absenceTypes');
        if (absenceTypes.length === 0) {
            containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active absence types.</p>
        </div>`;
            return;
        }
        containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fade-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Absence Type</th>
          <th class="has-width-1">
            <span class="is-sr-only">Update Absence Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Move Absence Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Delete Absence Type</span>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
      </table>`;
        const tableBodyElement = containerElement.querySelector('tbody');
        for (const absenceType of absenceTypes) {
            const rowElement = document.createElement('tr');
            rowElement.dataset.absenceTypeKey = absenceType.absenceTypeKey;
            rowElement.innerHTML = `<td>
        <input class="input" name="absenceType" maxlength="100" aria-label="Absence Type" required />
        </td>
        <td>
          <button class="button is-success ${updateButtonClassName}" data-cy="save" type="button" aria-label="Update Absence Type">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button ${upButtonClassName}" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button ${downButtonClassName}" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger ${deleteButtonClassName}" data-cy="delete" type="button" aria-label="Delete Absence Type">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`;
            const inputElement = rowElement.querySelector('input');
            inputElement.value = absenceType.absenceType;
            inputElement.addEventListener('change', setRowBackgroundColor);
            rowElement
                .getElementsByClassName(updateButtonClassName)[0]
                .addEventListener('click', updateAbsenceType);
            rowElement.getElementsByClassName(upButtonClassName)[0].addEventListener('click', moveAbsenceType);
            rowElement.getElementsByClassName(downButtonClassName)[0].addEventListener('click', moveAbsenceType);
            rowElement
                .getElementsByClassName(deleteButtonClassName)[0]
                .addEventListener('click', deleteAbsenceType);
            tableBodyElement.append(rowElement);
        }
    }
    (_a = document
        .querySelector('#tab--absenceTypes .is-add-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let addCloseModalFunction;
        function addAbsenceType(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doAddAbsenceType', formEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    bulmaJS.alert({
                        message: 'Absence type added successfully.',
                        contextualColorName: 'success'
                    });
                    absenceTypes = responseJSON.absenceTypes;
                    renderAbsenceTypes();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding Absence Type',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('tableAdmin-addAbsenceType', {
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                bulmaJS.toggleHtmlClipped();
                addCloseModalFunction = closeModalFunction;
                (_a = modalElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
                (_b = modalElement
                    .querySelector('form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', addAbsenceType);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderAbsenceTypes();
    let callOutResponseTypes = exports.callOutResponseTypes;
    delete exports.callOutResponseTypes;
    function updateCallOutResponseType(clickEvent) {
        const rowElement = clickEvent.currentTarget.closest('tr');
        const responseTypeId = rowElement.dataset.responseTypeId;
        const responseType = rowElement.querySelector('input').value;
        const isSuccessful = rowElement.querySelector('select').value;
        cityssm.postJSON(MonTY.urlPrefix + '/admin/doUpdateCallOutResponseType', {
            responseTypeId,
            responseType,
            isSuccessful
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                bulmaJS.alert({
                    message: 'Response type updated successfully.'
                });
                rowElement.classList.remove('has-background-warning-light');
            }
        });
    }
    function moveCallOutResponseType(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const tableRowElement = buttonElement.closest('tr');
        const responseTypeId = tableRowElement.dataset.responseTypeId;
        cityssm.postJSON(MonTY.urlPrefix +
            '/admin/' +
            (buttonElement.dataset.direction === 'up'
                ? 'doMoveCallOutResponseTypeUp'
                : 'doMoveCallOutResponseTypeDown'), {
            responseTypeId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                callOutResponseTypes = responseJSON.callOutResponseTypes;
                renderCallOutResponseTypes();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Moving Response Type',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function deleteCallOutResponseType(clickEvent) {
        const rowElement = clickEvent.currentTarget.closest('tr');
        const responseTypeId = rowElement.dataset.responseTypeId;
        function doDelete() {
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doDeleteCallOutResponseType', {
                responseTypeId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    callOutResponseTypes = responseJSON.callOutResponseTypes;
                    renderCallOutResponseTypes();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Deleting Response Type',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Delete Response Type',
            message: 'Are you sure you want to delete this response type?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Response Type',
                callbackFunction: doDelete
            }
        });
    }
    function renderCallOutResponseTypes() {
        var _a;
        const containerElement = document.querySelector('#container--callOutResponseTypes');
        if (absenceTypes.length === 0) {
            containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active response types.</p>
        </div>`;
            return;
        }
        containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fade-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Response Type</th>
          <th>Is Successful</th>
          <th class="has-width-1">
            <span class="is-sr-only">Update Response Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Move Response Type</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Delete Response Type</span>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
      </table>`;
        const tableBodyElement = containerElement.querySelector('tbody');
        for (const callOutResponseType of callOutResponseTypes) {
            const rowElement = document.createElement('tr');
            rowElement.dataset.responseTypeId =
                callOutResponseType.responseTypeId.toString();
            rowElement.innerHTML = `<td>
        <input class="input" name="responseType" maxlength="100" aria-label="Call Out Response Type" required />
        </td>
        <td>
          <div class="select is-fullwidth">
            <select name="isSuccessful" aria-label="Is Successful" required>
              <option value="1">Successful</option>
              <option value="0">Unsuccessful</option>
            </select>
          </div>
        </td>
        <td>
          <button class="button is-success ${updateButtonClassName}" data-cy="save" type="button" aria-label="Update Response Type">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button ${upButtonClassName}" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button ${downButtonClassName}" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger ${deleteButtonClassName}" data-cy="delete" type="button" aria-label="Delete Response Type">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`;
            const inputElement = rowElement.querySelector('input');
            inputElement.value = callOutResponseType.responseType;
            inputElement.addEventListener('change', setRowBackgroundColor);
            (_a = rowElement
                .querySelector('select')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', setRowBackgroundColor);
            if (!callOutResponseType.isSuccessful) {
                rowElement.querySelector('select').value = '0';
            }
            rowElement
                .getElementsByClassName(updateButtonClassName)[0]
                .addEventListener('click', updateCallOutResponseType);
            rowElement.getElementsByClassName(upButtonClassName)[0].addEventListener('click', moveCallOutResponseType);
            rowElement.getElementsByClassName(downButtonClassName)[0].addEventListener('click', moveCallOutResponseType);
            rowElement
                .getElementsByClassName(deleteButtonClassName)[0]
                .addEventListener('click', deleteCallOutResponseType);
            tableBodyElement.append(rowElement);
        }
    }
    (_b = document
        .querySelector('#tab--callOutResponseTypes .is-add-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        let addCloseModalFunction;
        function addCallOutResponseType(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doAddCallOutResponseType', formEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    bulmaJS.alert({
                        message: 'Response type added successfully.',
                        contextualColorName: 'success'
                    });
                    callOutResponseTypes = responseJSON.callOutResponseTypes;
                    renderCallOutResponseTypes();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding Response Type',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('tableAdmin-addCallOutResponseType', {
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                bulmaJS.toggleHtmlClipped();
                addCloseModalFunction = closeModalFunction;
                (_a = modalElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
                (_b = modalElement
                    .querySelector('form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', addCallOutResponseType);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderCallOutResponseTypes();
    let afterHoursReasons = exports.afterHoursReasons;
    delete exports.afterHoursReasons;
    function updateAfterHoursReason(clickEvent) {
        const rowElement = clickEvent.currentTarget.closest('tr');
        const afterHoursReasonId = rowElement.dataset.afterHoursReasonId;
        const afterHoursReason = rowElement.querySelector('input').value;
        cityssm.postJSON(MonTY.urlPrefix + '/admin/doUpdateAfterHoursReason', {
            afterHoursReasonId,
            afterHoursReason
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                bulmaJS.alert({
                    message: 'Reason updated successfully.'
                });
                rowElement.classList.remove('has-background-warning-light');
            }
        });
    }
    function moveAfterHoursReason(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const tableRowElement = buttonElement.closest('tr');
        const afterHoursReasonId = tableRowElement.dataset.afterHoursReasonId;
        cityssm.postJSON(MonTY.urlPrefix +
            '/admin/' +
            (buttonElement.dataset.direction === 'up'
                ? 'doMoveAfterHoursReasonUp'
                : 'doMoveAfterHoursReasonDown'), {
            afterHoursReasonId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                afterHoursReasons = responseJSON.afterHoursReasons;
                renderAfterHoursReasons();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Moving Reason',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function deleteAfterHoursReason(clickEvent) {
        const rowElement = clickEvent.currentTarget.closest('tr');
        const afterHoursReasonId = rowElement.dataset.afterHoursReasonId;
        function doDelete() {
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doDeleteAfterHoursReason', {
                afterHoursReasonId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    afterHoursReasons = responseJSON.afterHoursReasons;
                    renderAfterHoursReasons();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Deleting Reason',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Delete Reason',
            message: 'Are you sure you want to delete this after hours reason?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Reason',
                callbackFunction: doDelete
            }
        });
    }
    function renderAfterHoursReasons() {
        const containerElement = document.querySelector('#container--afterHoursReasons');
        if (absenceTypes.length === 0) {
            containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active active hours reasons.</p>
        </div>`;
            return;
        }
        containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fade-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Reason</th>
          <th class="has-width-1">
            <span class="is-sr-only">Update Reason</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Move Reason</span>
          </th>
          <th class="has-width-1">
            <span class="is-sr-only">Delete Reason</span>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
      </table>`;
        const tableBodyElement = containerElement.querySelector('tbody');
        for (const afterHoursReason of afterHoursReasons) {
            const rowElement = document.createElement('tr');
            rowElement.dataset.afterHoursReasonId =
                afterHoursReason.afterHoursReasonId.toString();
            rowElement.innerHTML = `<td>
        <input class="input" name="afterHoursReason" maxlength="100" aria-label="After Hours Reason" required />
        </td>
        <td>
          <button class="button is-success ${updateButtonClassName}" data-cy="save" type="button" aria-label="Update Reason">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button ${upButtonClassName}" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button ${downButtonClassName}" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger ${deleteButtonClassName}" data-cy="delete" type="button" aria-label="Delete Reason">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`;
            const inputElement = rowElement.querySelector('input');
            inputElement.value = afterHoursReason.afterHoursReason;
            inputElement.addEventListener('change', setRowBackgroundColor);
            rowElement
                .getElementsByClassName(updateButtonClassName)[0]
                .addEventListener('click', updateAfterHoursReason);
            rowElement.getElementsByClassName(upButtonClassName)[0].addEventListener('click', moveAfterHoursReason);
            rowElement.getElementsByClassName(downButtonClassName)[0].addEventListener('click', moveAfterHoursReason);
            rowElement
                .getElementsByClassName(deleteButtonClassName)[0]
                .addEventListener('click', deleteAfterHoursReason);
            tableBodyElement.append(rowElement);
        }
    }
    (_c = document
        .querySelector('#tab--afterHoursReasons .is-add-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        let addCloseModalFunction;
        function addAfterHoursReason(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doAddAfterHoursReason', formEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    bulmaJS.alert({
                        message: 'Reason added successfully.',
                        contextualColorName: 'success'
                    });
                    afterHoursReasons = responseJSON.afterHoursReasons;
                    renderAfterHoursReasons();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding Reason',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('tableAdmin-addAfterHoursReason', {
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                bulmaJS.toggleHtmlClipped();
                addCloseModalFunction = closeModalFunction;
                (_a = modalElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
                (_b = modalElement
                    .querySelector('form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', addAfterHoursReason);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderAfterHoursReasons();
})();
