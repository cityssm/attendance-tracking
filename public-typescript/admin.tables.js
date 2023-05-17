"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b;
    const MonTY = exports.MonTY;
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
        var _a, _b;
        const containerElement = document.querySelector('#container--absenceTypes');
        if (absenceTypes.length === 0) {
            containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active absence types.</p>
        </div>`;
            return;
        }
        containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fullwidth">
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
        <input class="input" name="absenceType" maxlength="100" required />
        </td>
        <td>
          <button class="button is-success is-update-button" type="button" aria-label="Update Absence Type">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button is-up-button" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button is-down-button" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger is-delete-button" type="button" aria-label="Delete Absence Type">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </td>`;
            const inputElement = rowElement.querySelector('input');
            inputElement.value = absenceType.absenceType;
            inputElement.addEventListener('change', setRowBackgroundColor);
            (_a = rowElement
                .querySelector('.is-update-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', updateAbsenceType);
            rowElement.querySelector('.is-up-button').addEventListener('click', moveAbsenceType);
            rowElement.querySelector('.is-down-button').addEventListener('click', moveAbsenceType);
            (_b = rowElement
                .querySelector('.is-delete-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteAbsenceType);
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
                var _a;
                bulmaJS.toggleHtmlClipped();
                addCloseModalFunction = closeModalFunction;
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', addAbsenceType);
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
        var _a, _b, _c;
        const containerElement = document.querySelector('#container--callOutResponseTypes');
        if (absenceTypes.length === 0) {
            containerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no active response types.</p>
        </div>`;
            return;
        }
        containerElement.innerHTML = `<table class="table is-striped is-hoverable is-fullwidth">
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
        <input class="input" name="responseType" maxlength="100" required />
        </td>
        <td>
          <div class="select is-fullwidth">
            <select name="isSuccessful" required>
              <option value="1">Successful</option>
              <option value="0">Unsuccessful</option>
            </select>
          </div>
        </td>
        <td>
          <button class="button is-success is-update-button" type="button" aria-label="Update Response Type">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <div class="field has-addons">
            <div class="control">
              <button class="button is-up-button" data-direction="up" type="button" aria-label="Move Up">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
            <div class="control">
              <button class="button is-down-button" data-direction="down" type="button" aria-label="Move Down">
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
        <button class="button is-danger is-delete-button" type="button" aria-label="Delete Response Type">
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
            (_b = rowElement
                .querySelector('.is-update-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', updateCallOutResponseType);
            rowElement.querySelector('.is-up-button').addEventListener('click', moveCallOutResponseType);
            rowElement.querySelector('.is-down-button').addEventListener('click', moveCallOutResponseType);
            (_c = rowElement
                .querySelector('.is-delete-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', deleteCallOutResponseType);
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
                var _a;
                bulmaJS.toggleHtmlClipped();
                addCloseModalFunction = closeModalFunction;
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', addCallOutResponseType);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderCallOutResponseTypes();
})();
