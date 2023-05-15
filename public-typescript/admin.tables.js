"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
    /*
     * Absence Types
     */
    let absenceTypes = exports.absenceTypes;
    delete exports.absenceTypes;
    function renderAbsenceTypes() {
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
        </td>`;
            rowElement.querySelector('input').value = absenceType.absenceType;
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
