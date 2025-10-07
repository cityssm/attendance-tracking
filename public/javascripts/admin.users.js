"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion, max-lines */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const Attend = exports.Attend;
    let users = exports.users;
    const userDomain = (exports.userDomain ?? '');
    const availablePermissionValues = exports.availablePermissionValues;
    const usersTableBodyElement = document.querySelector('#tbody--users');
    const canLoginFilterElement = document.querySelector('#filter--canLogin');
    function deleteUser(clickEvent) {
        clickEvent.preventDefault();
        const tableRowElement = clickEvent.currentTarget.closest('tr');
        const userName = tableRowElement.dataset.userName ?? '';
        function doDelete() {
            cityssm.postJSON(`${Attend.urlPrefix}/admin/doDeleteUser`, {
                userName
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        contextualColorName: 'success',
                        message: 'User deleted successfully.',
                    });
                    tableRowElement.remove();
                }
                users = responseJSON.users;
            });
        }
        bulmaJS.confirm({
            contextualColorName: 'warning',
            title: 'Delete User',
            message: `Are you sure you want to delete ${userName}?<br />
        Note that if this is temporary, revoking log in permissions would be easier to restore.`,
            messageIsHtml: true,
            okButton: {
                callbackFunction: doDelete,
                text: 'Yes, Delete User',
            }
        });
    }
    function toggleCanLogin(clickEvent) {
        clickEvent.preventDefault();
        const canLoginSelectElement = clickEvent.currentTarget;
        const userName = canLoginSelectElement.closest('tr').dataset
            .userName ?? '';
        cityssm.postJSON(`${Attend.urlPrefix}/admin/doUpdateUserCanLogin`, {
            userName,
            canLogin: canLoginSelectElement.value
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                ;
                (canLoginSelectElement
                    .closest('.control')
                    ?.querySelector('.icon')).innerHTML = `<i class="fas ${canLoginSelectElement.value === '1' ? 'fa-check' : 'fa-times'}" aria-hidden="true"></i>`;
                canLoginSelectElement
                    .closest('.select')
                    ?.classList.remove('is-danger', 'is-success');
                canLoginSelectElement
                    .closest('.select')
                    ?.classList.add(canLoginSelectElement.value === '1' ? 'is-success' : 'is-danger');
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
        clickEvent.preventDefault();
        const isAdminSelectElement = clickEvent.currentTarget;
        const userName = isAdminSelectElement.closest('tr').dataset
            .userName ?? '';
        cityssm.postJSON(`${Attend.urlPrefix}/admin/doUpdateUserIsAdmin`, {
            userName,
            isAdmin: isAdminSelectElement.value
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                ;
                (isAdminSelectElement
                    .closest('.control')
                    ?.querySelector('.icon')).innerHTML = `<i class="fas ${isAdminSelectElement.value === '1' ? 'fa-check' : 'fa-times'}" aria-hidden="true"></i>`;
                isAdminSelectElement
                    .closest('.select')
                    ?.classList.remove('is-danger', 'is-success');
                isAdminSelectElement
                    .closest('.select')
                    ?.classList.add(isAdminSelectElement.value === '1' ? 'is-success' : 'is-danger');
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
        cityssm.postJSON(`${Attend.urlPrefix}/admin/doSetUserPermission`, formEvent.currentTarget, (rawResponseJSON) => {
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
            users = responseJSON.users;
            renderUsers();
        });
    }
    function highlightRow(changeEvent) {
        // eslint-disable-next-line no-extra-semi
        ;
        changeEvent.currentTarget
            .closest('tr')
            ?.classList.add('has-background-warning-light');
    }
    function openUserPermissionsModal(clickEvent) {
        clickEvent.preventDefault();
        let permissionsModalElement;
        let permissionsModalCloseFunction;
        const buttonElement = clickEvent.currentTarget;
        const userName = buttonElement.closest('tr').dataset.userName ??
            '';
        function clearPermissions(clickEvent) {
            clickEvent.preventDefault();
            function doClear() {
                cityssm.postJSON(`${Attend.urlPrefix}/admin/doClearUserPermissions`, {
                    userName
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        bulmaJS.alert({
                            message: 'Permissions cleared successfully.',
                            contextualColorName: 'info'
                        });
                        permissionsModalCloseFunction();
                    }
                    else {
                        bulmaJS.alert({
                            contextualColorName: 'danger',
                            title: 'Error Clearing Permissions',
                            message: 'Please try again.',
                        });
                    }
                    users = responseJSON.users;
                    renderUsers();
                });
            }
            bulmaJS.confirm({
                contextualColorName: 'warning',
                title: 'Clear All Permissions',
                message: `Are you sure you want to clear all of the permissions associated with "${userName}"?`,
                okButton: {
                    callbackFunction: doClear,
                    text: 'Yes, Clear All Permissions',
                }
            });
        }
        function populatePermissionsTable() {
            const tableBodyElement = permissionsModalElement.querySelector('tbody');
            let uidCounter = 0;
            for (const [permissionKey, permissionValues] of Object.entries(availablePermissionValues)) {
                const tableRowElement = document.createElement('tr');
                tableRowElement.dataset.permissionKey = permissionKey;
                let iconClass;
                switch (permissionKey.slice(permissionKey.lastIndexOf('.') + 1)) {
                    case 'canManage': {
                        iconClass = 'fa-tools';
                        break;
                    }
                    case 'canUpdate': {
                        iconClass = 'fa-pencil-alt';
                        break;
                    }
                    case 'canView': {
                        iconClass = 'fa-eye';
                        break;
                    }
                    default: {
                        iconClass = 'fa-cog';
                        break;
                    }
                }
                uidCounter += 1;
                const uid = `permissionValue_${uidCounter.toString()}`;
                tableRowElement.innerHTML = `<td class="is-vcentered">
          <label for="${uid}">
            ${permissionKey}
          </label>
          </td>
          <td>
            <form>
              <input name="userName" value="${userName}" type="hidden" />
              <input name="permissionKey" value="${permissionKey}" type="hidden" />
              <div class="field has-addons">
                <div class="control has-icons-left is-expanded">
                  <div class="select is-fullwidth">
                    <select id="${uid}" name="permissionValue">
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
                tableRowElement
                    .querySelector('form')
                    ?.addEventListener('submit', setUserPermission);
                tableBodyElement.append(tableRowElement);
            }
            cityssm.postJSON(`${Attend.urlPrefix}/admin/doGetUserPermissions`, {
                userName
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                let formIndex = 0;
                for (const [permissionKey, permissionValue] of Object.entries(responseJSON.userPermissions)) {
                    const tableRowElement = tableBodyElement.querySelector(`tr[data-permission-key="${permissionKey}"]`);
                    if (tableRowElement === null) {
                        formIndex += 1;
                        const formId = `form--permissionValue-${formIndex.toString()}`;
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
                        tableBodyElement
                            .querySelector(`#${formId}`)
                            ?.addEventListener('submit', setUserPermission);
                    }
                    else {
                        const selectElement = tableRowElement.querySelector('select');
                        if (selectElement.querySelector(`option[value="${permissionValue}"]`) === null) {
                            selectElement.insertAdjacentHTML('beforeend', `<option>${permissionValue}</option>`);
                        }
                        selectElement.value = permissionValue;
                    }
                }
                tableBodyElement.closest('table')?.classList.remove('is-hidden');
            });
        }
        cityssm.openHtmlModal('userAdmin-userPermissions', {
            onshow(modalElement) {
                cityssm.enableNavBlocker();
                permissionsModalElement = modalElement;
                modalElement.querySelector('.modal-card-title').textContent = userName;
                populatePermissionsTable();
            },
            onshown(modalElement, closeModalFunction) {
                permissionsModalCloseFunction = closeModalFunction;
                bulmaJS.init(modalElement);
                buttonElement.blur();
                bulmaJS.toggleHtmlClipped();
                modalElement
                    .querySelector('.is-clear-permissions-button')
                    ?.addEventListener('click', clearPermissions);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
                buttonElement.focus();
            }
        });
    }
    function renderUsers() {
        usersTableBodyElement.innerHTML = '';
        for (const user of users) {
            if (canLoginFilterElement.checked && !user.canLogin) {
                continue;
            }
            const tableRowElement = document.createElement('tr');
            tableRowElement.dataset.userName = user.userName;
            tableRowElement.innerHTML = `<td class="is-vcentered">
          ${user.userName}
            ${(user.employeeSurname ?? '') === ''
                ? ''
                : `<br />
                  <span class="is-size-7 has-tooltip-right" data-tooltip="Employee">
                  <i class="fas fa-hard-hat" aria-hidden="true"></i> ${user.employeeSurname ?? ''}, ${user.employeeGivenName ?? ''}
                  </span>`}
        </td>
        <td>
          <div class="control has-icons-left">
            <div class="select ${user.canLogin ? 'is-success' : 'is-danger'}">
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
            <div class="select ${user.isAdmin ? 'is-success' : 'is-danger'}">
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
          <button class="button is-user-permissions-button" data-cy="permissions" type="button">
            <span class="icon is-small">
              <span class="fa-layers fa-fw">
                <i class="fas fa-th-list" aria-hidden="true"></i>
                ${(user.permissionCount ?? 0) > 0
                ? `<span class="fa-layers-counter has-background-info">${user.permissionCount}</span>`
                : ''}
              </span>
            </span>
            <span>Permissions</span>
          </button>
        </td>
        <td class="has-width-1">
          <button class="button is-danger is-delete-button" data-cy="delete" type="button" aria-label="Delete">
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
        </td>`;
            tableRowElement
                .querySelector('select[data-field="canLogin"]')
                ?.addEventListener('change', toggleCanLogin);
            tableRowElement
                .querySelector('select[data-field="isAdmin"]')
                ?.addEventListener('change', toggleIsAdmin);
            tableRowElement
                .querySelector('.is-user-permissions-button')
                ?.addEventListener('click', openUserPermissionsModal);
            tableRowElement
                .querySelector('.is-delete-button')
                ?.addEventListener('click', deleteUser);
            usersTableBodyElement.append(tableRowElement);
        }
    }
    canLoginFilterElement.addEventListener('click', renderUsers);
    document
        .querySelector('.is-add-user-button')
        ?.addEventListener('click', () => {
        let addCloseModalFunction;
        function doAddUser(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${Attend.urlPrefix}/admin/doAddUser`, formEvent.currentTarget, (rawResponseJSON) => {
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
            onshow(modalElement) {
                ;
                modalElement.querySelector('#userAdd--userDomain').textContent = `${userDomain}\\`;
            },
            onshown(modalElement, closeModalFunction) {
                addCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                const userNameElement = modalElement.querySelector('#userAdd--userName');
                // Try to defeat browser auto populating
                userNameElement.value = '';
                userNameElement.focus();
                modalElement
                    .querySelector('form')
                    ?.addEventListener('submit', doAddUser);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderUsers();
})();
