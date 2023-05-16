"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
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
            rowElement.querySelector('input').value = absenceType.absenceType;
            (_a = rowElement
                .querySelector('.is-update-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', updateAbsenceType);
            rowElement.querySelector('.is-up-button').addEventListener('click', moveAbsenceType);
            rowElement.querySelector('.is-down-button').addEventListener('click', moveAbsenceType);
            (_b = rowElement
                .querySelector('.is-delete-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteAbsenceType);
            tableBodyElement.append(rowElement);
        }
    }
    renderAbsenceTypes();
    /*
     * Call Out Response Types
     */
    let callOutResponseTypes = exports.callOutResponseTypes;
    delete exports.callOutResponseTypes;
})();
