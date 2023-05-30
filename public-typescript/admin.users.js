"use strict";
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const MonTY = exports.MonTY;
    let users = exports.users;
    delete exports.users;
    const availablePermissionValues = exports.availablePermissionValues;
    delete exports.availablePermissionValues;
    const usersTableBodyElement = document.querySelector('#tbody--users');
    function deleteUser(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const tableRowElement = clickEvent.currentTarget.closest('tr');
        const userName = (_a = tableRowElement.dataset.userName) !== null && _a !== void 0 ? _a : '';
        function doDelete() {
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doDeleteUser', {
                userName
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'User deleted successfully.',
                        contextualColorName: 'success'
                    });
                    tableRowElement.remove();
                }
                users = responseJSON.users;
            });
        }
        bulmaJS.confirm({
            title: 'Delete User',
            message: `Are you sure you want to delete ${userName}?<br />
        Note that if this is temporary, revoking log in permissions would be easier to restore.`,
            messageIsHtml: true,
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete User',
                callbackFunction: doDelete
            }
        });
    }
    function toggleCanLogin(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const canLoginSelectElement = clickEvent.currentTarget;
        const userName = (_a = canLoginSelectElement.closest('tr').dataset.userName) !== null && _a !== void 0 ? _a : '';
        cityssm.postJSON(MonTY.urlPrefix + '/admin/doUpdateUserCanLogin', {
            userName,
            canLogin: canLoginSelectElement.value
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                canLoginSelectElement
                    .closest('.control')
                    .querySelector('.icon').innerHTML = `<i class="fas ${canLoginSelectElement.value === '1' ? 'fa-check' : 'fa-times'}" aria-hidden="true"></i>`;
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating Permission',
                    message: 'Please try again.',
                    contextualColorName: 'danger'
                });
            }
            users = responseJSON.users;
        });
    }
    function toggleIsAdmin(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const isAdminSelectElement = clickEvent.currentTarget;
        const userName = (_a = isAdminSelectElement.closest('tr').dataset.userName) !== null && _a !== void 0 ? _a : '';
        cityssm.postJSON(MonTY.urlPrefix + '/admin/doUpdateUserIsAdmin', {
            userName,
            isAdmin: isAdminSelectElement.value
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                isAdminSelectElement
                    .closest('.control')
                    .querySelector('.icon').innerHTML = `<i class="fas ${isAdminSelectElement.value === '1' ? 'fa-check' : 'fa-times'}" aria-hidden="true"></i>`;
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating Permission',
                    message: 'Please try again.',
                    contextualColorName: 'danger'
                });
            }
            users = responseJSON.users;
        });
    }
    function setUserPermission(formEvent) {
        formEvent.preventDefault();
        const rowElement = formEvent.currentTarget.closest('tr');
        cityssm.postJSON(MonTY.urlPrefix + '/admin/doSetUserPermission', formEvent.currentTarget, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                bulmaJS.alert({
                    message: 'Permission updated successfully.',
                    contextualColorName: 'success'
                });
                rowElement.classList.remove('has-background-warning-light');
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating Permission',
                    message: 'Please try again.',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function highlightRow(changeEvent) {
        var _a;
        ;
        (_a = changeEvent.currentTarget
            .closest('tr')) === null || _a === void 0 ? void 0 : _a.classList.add('has-background-warning-light');
    }
    function openUserPermissionsModal(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        let permissionsModalElement;
        const userName = (_a = clickEvent.currentTarget.closest('tr').dataset
            .userName) !== null && _a !== void 0 ? _a : '';
        function populatePermissionsTable() {
            var _a;
            const tableBodyElement = permissionsModalElement.querySelector('tbody');
            for (const [permissionKey, permissionValues] of Object.entries(availablePermissionValues)) {
                const tableRowElement = document.createElement('tr');
                tableRowElement.dataset.permissionKey = permissionKey;
                let iconClass = 'fa-cog';
                switch (permissionKey.slice(permissionKey.lastIndexOf('.') + 1)) {
                    case 'canView': {
                        iconClass = 'fa-eye';
                        break;
                    }
                    case 'canUpdate': {
                        iconClass = 'fa-pencil-alt';
                        break;
                    }
                    case 'canManage': {
                        iconClass = 'fa-tools';
                        break;
                    }
                }
                tableRowElement.innerHTML = `<td class="is-vcentered">${permissionKey}</td>
          <td>
            <form>
              <input name="userName" value="${userName}" type="hidden" />
              <input name="permissionKey" value="${permissionKey}" type="hidden" />
              <div class="field has-addons">
                <div class="control has-icons-left is-expanded">
                  <div class="select is-fullwidth">
                    <select name="permissionValue">
                      <option value="">(Not Set)</option>
                    </select>
                  </div>
                  <span class="icon is-left">
                    <i class="fas ${iconClass}" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="control">
                  <button class="button is-success" type="submit" aria-label="Save Changes">
                    <i class="fas fa-save" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </form>
          </td>`;
                const selectElement = tableRowElement.querySelector('select');
                for (const permissionValue of permissionValues) {
                    selectElement.insertAdjacentHTML('beforeend', `<option value="${permissionValue}">${permissionValue}</option>`);
                }
                selectElement.addEventListener('change', highlightRow);
                (_a = tableRowElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', setUserPermission);
                tableBodyElement.append(tableRowElement);
            }
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doGetUserPermissions', {
                userName
            }, (rawResponseJSON) => {
                var _a, _b;
                const responseJSON = rawResponseJSON;
                let formIndex = 0;
                for (const [permissionKey, permissionValue] of Object.entries(responseJSON.userPermissions)) {
                    const tableRowElement = tableBodyElement.querySelector(`tr[data-permission-key="${permissionKey}"]`);
                    if (tableRowElement === null) {
                        formIndex += 1;
                        const formId = 'form--permissionValue-' + formIndex.toString();
                        tableBodyElement.insertAdjacentHTML('beforeend', `<tr data-permission-key="${permissionKey}">
                    <td class="is-vcentered is-italic">${permissionKey}</td>
                    <td>
                      <form id="${formId}">
                        <input name="userName" value="${userName}" type="hidden" />
                        <input name="permissionKey" value="${permissionKey}" type="hidden" />
                        <div class="field has-addons">
                          <div class="control is-expanded">
                            <div class="select is-fullwidth">
                              <select name="permissionValue">
                                <option value="">(Not Set)</option>
                                <option value="${permissionValue}" selected>${permissionValue}</option>
                              </select>
                            </div>
                          </div>
                          <div class="control">
                            <button class="button is-success" type="submit">
                              <i class="fas fa-save" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </td>
                  </tr>`);
                        (_a = tableBodyElement
                            .querySelector(`#${formId}`)) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', setUserPermission);
                    }
                    else {
                        const selectElement = tableRowElement.querySelector('select');
                        if (selectElement.querySelector(`option[value="${permissionValue}"]`) === null) {
                            selectElement.insertAdjacentHTML('beforeend', `<option>${permissionValue}</option>`);
                        }
                        selectElement.value = permissionValue;
                    }
                }
                (_b = tableBodyElement.closest('table')) === null || _b === void 0 ? void 0 : _b.classList.remove('is-hidden');
            });
        }
        cityssm.openHtmlModal('userAdmin-userPermissions', {
            onshow(modalElement) {
                bulmaJS.toggleHtmlClipped();
                cityssm.enableNavBlocker();
                permissionsModalElement = modalElement;
                modalElement.querySelector('.modal-card-title').textContent = userName;
                populatePermissionsTable();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
            }
        });
    }
    function renderUsers() {
        var _a, _b, _c, _d, _e, _f, _g;
        usersTableBodyElement.innerHTML = '';
        for (const user of users) {
            const tableRowElement = document.createElement('tr');
            tableRowElement.dataset.userName = user.userName;
            tableRowElement.innerHTML = `<td class="is-vcentered">
          ${user.userName}
            ${((_a = user.employeeSurname) !== null && _a !== void 0 ? _a : '') === ''
                ? ''
                : `<br />
                  <span class="is-size-7">
                  <i class="fas fa-hard-hat" aria-hidden="true"></i> ${(_b = user.employeeSurname) !== null && _b !== void 0 ? _b : ''}, ${(_c = user.employeeGivenName) !== null && _c !== void 0 ? _c : ''}
                  </span>`}
        </td>
        <td>
          <div class="control has-icons-left">
            <div class="select">
              <select data-field="canLogin" aria-label="Can Login">
                <option value="1" ${user.canLogin ? ' selected' : ''}>
                  Can Log In
                </option>
                <option value="0" ${user.canLogin ? '' : ' selected'}>
                  Access Denied
                </option>
              </select>
            </div>
            <span class="icon is-small is-left">
              <i class="fas ${user.canLogin ? 'fa-check' : 'fa-times'}" aria-hidden="true"></i>
            </span>
          </div>
        </td>
        <td>
          <div class="control has-icons-left">
            <div class="select">
              <select data-field="isAdmin" aria-label="Is Administrator">
                <option value="0" ${user.isAdmin ? '' : ' selected'}>
                  No Admin Access
                </option>
                <option value="1" ${user.isAdmin ? ' selected' : ''}>
                  Administrator
                </option>
              </select>
            </div>
            <span class="icon is-small is-left">
              <i class="fas ${user.isAdmin ? 'fa-check' : 'fa-times'}" aria-hidden="true"></i>
            </span>
          </div>
        </td>
        <td class="has-width-1 has-text-centered">
          <button class="button is-user-permissions-button" type="button">
            <span class="icon is-small"><i class="fas fa-th-list" aria-hidden="true"></i></span>
            <span>Permissions</span>
          </button>
        </td>
        <td class="has-width-1">
          <button class="button is-danger is-delete-button" type="button" aria-label="Delete">
            <span class="icon is-small"><i class="fas fa-trash" aria-hidden="true"></i></span>
          </button>
        </td>`;
            (_d = tableRowElement
                .querySelector('select[data-field="canLogin"]')) === null || _d === void 0 ? void 0 : _d.addEventListener('change', toggleCanLogin);
            (_e = tableRowElement
                .querySelector('select[data-field="isAdmin"]')) === null || _e === void 0 ? void 0 : _e.addEventListener('change', toggleIsAdmin);
            (_f = tableRowElement
                .querySelector('.is-user-permissions-button')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', openUserPermissionsModal);
            (_g = tableRowElement
                .querySelector('.is-delete-button')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', deleteUser);
            usersTableBodyElement.append(tableRowElement);
        }
    }
    (_a = document
        .querySelector('.is-add-user-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let addCloseModalFunction;
        function doAddUser(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/admin/doAddUser', formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    bulmaJS.alert({
                        message: 'User added successfully.',
                        contextualColorName: 'success'
                    });
                    users = responseJSON.users;
                    renderUsers();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding User',
                        message: 'Please ensure the user does not already have access, then try again.',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('userAdmin-addUser', {
            onshown(modalElement, closeModalFunction) {
                var _a;
                addCloseModalFunction = closeModalFunction;
                const userNameElement = modalElement.querySelector('#userAdd--userName');
                // Try to defeat browser auto populating
                userNameElement.value = '';
                userNameElement.focus();
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAddUser);
            }
        });
    });
    renderUsers();
})();
