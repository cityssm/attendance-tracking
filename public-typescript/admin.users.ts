// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

// eslint-disable-next-line n/no-missing-import
import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { DoClearUserPermissionsResponse } from '../handlers/admin-post/doClearUserPermissions.js'
import type { DoGetUserPermissionsResponse } from '../handlers/admin-post/doGetUserPermissions.js'
import type { DoModifyUserResponse } from '../handlers/admin-post/doModifyUser.js'
import type { DoSetUserPermissionResponse } from '../handlers/admin-post/doSetUserPermission.js'
import type { Attend as AttendGlobal } from '../types/globalTypes.js'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const Attend = exports.Attend as AttendGlobal

  let users = exports.users as AttendUser[]
  delete exports.users

  const userDomain = (exports.userDomain ?? '') as string

  const availablePermissionValues = exports.availablePermissionValues as Record<
    string,
    string[]
  >
  delete exports.availablePermissionValues

  const usersTableBodyElement = document.querySelector(
    '#tbody--users'
  ) as HTMLTableSectionElement

  const canLoginFilterElement = document.querySelector(
    '#filter--canLogin'
  ) as HTMLInputElement

  function deleteUser(clickEvent: Event): void {
    clickEvent.preventDefault()

    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    const userName = tableRowElement.dataset.userName ?? ''

    function doDelete(): void {
      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doDeleteUser`,
        {
          userName
        },
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoModifyUserResponse

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'User deleted successfully.',
              contextualColorName: 'success'
            })

            tableRowElement.remove()
          }

          users = responseJSON.users
        }
      )
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
    })
  }

  function toggleCanLogin(clickEvent: Event): void {
    clickEvent.preventDefault()

    const canLoginSelectElement = clickEvent.currentTarget as HTMLSelectElement

    const userName =
      (canLoginSelectElement.closest('tr') as HTMLTableRowElement).dataset
        .userName ?? ''

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/doUpdateUserCanLogin`,
      {
        userName,
        canLogin: canLoginSelectElement.value
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as unknown as DoModifyUserResponse

        if (responseJSON.success) {
          // eslint-disable-next-line no-extra-semi
          ;(
            canLoginSelectElement
              .closest('.control')
              ?.querySelector('.icon') as HTMLElement
          ).innerHTML = `<i class="fas ${
            canLoginSelectElement.value === '1' ? 'fa-check' : 'fa-times'
          }" aria-hidden="true"></i>`

          canLoginSelectElement
            .closest('.select')
            ?.classList.remove('is-danger', 'is-success')

          canLoginSelectElement
            .closest('.select')
            ?.classList.add(
              canLoginSelectElement.value === '1' ? 'is-success' : 'is-danger'
            )
        } else {
          bulmaJS.alert({
            title: 'Error Updating Permission',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }

        users = responseJSON.users
      }
    )
  }

  function toggleIsAdmin(clickEvent: Event): void {
    clickEvent.preventDefault()

    const isAdminSelectElement = clickEvent.currentTarget as HTMLSelectElement

    const userName =
      (isAdminSelectElement.closest('tr') as HTMLTableRowElement).dataset
        .userName ?? ''

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/doUpdateUserIsAdmin`,
      {
        userName,
        isAdmin: isAdminSelectElement.value
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as unknown as DoModifyUserResponse

        if (responseJSON.success) {
          // eslint-disable-next-line no-extra-semi
          ;(
            isAdminSelectElement
              .closest('.control')
              ?.querySelector('.icon') as HTMLElement
          ).innerHTML = `<i class="fas ${
            isAdminSelectElement.value === '1' ? 'fa-check' : 'fa-times'
          }" aria-hidden="true"></i>`

          isAdminSelectElement
            .closest('.select')
            ?.classList.remove('is-danger', 'is-success')

          isAdminSelectElement
            .closest('.select')
            ?.classList.add(
              isAdminSelectElement.value === '1' ? 'is-success' : 'is-danger'
            )
        } else {
          bulmaJS.alert({
            title: 'Error Updating Permission',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }

        users = responseJSON.users
      }
    )
  }

  function setUserPermission(formEvent: Event): void {
    formEvent.preventDefault()

    const rowElement = (formEvent.currentTarget as HTMLElement).closest(
      'tr'
    ) as HTMLTableRowElement

    cityssm.postJSON(
      `${Attend.urlPrefix}/admin/doSetUserPermission`,
      formEvent.currentTarget,
      (rawResponseJSON) => {
        const responseJSON =
          rawResponseJSON as unknown as DoSetUserPermissionResponse

        if (responseJSON.success) {
          bulmaJS.alert({
            message: 'Permission updated successfully.',
            contextualColorName: 'success'
          })
          rowElement.classList.remove('has-background-warning-light')
        } else {
          bulmaJS.alert({
            title: 'Error Updating Permission',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }

        users = responseJSON.users
        renderUsers()
      }
    )
  }

  function highlightRow(changeEvent: Event): void {
    // eslint-disable-next-line no-extra-semi
    ;(changeEvent.currentTarget as HTMLElement)
      .closest('tr')
      ?.classList.add('has-background-warning-light')
  }

  function openUserPermissionsModal(clickEvent: Event): void {
    clickEvent.preventDefault()

    let permissionsModalElement: HTMLElement
    let permissionsModalCloseFunction: () => void

    const buttonElement = clickEvent.currentTarget as HTMLButtonElement

    const userName =
      (buttonElement.closest('tr') as HTMLTableRowElement).dataset.userName ??
      ''

    function clearPermissions(clickEvent: Event): void {
      clickEvent.preventDefault()

      function doClear(): void {
        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doClearUserPermissions`,
          {
            userName
          },
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoClearUserPermissionsResponse

            if (responseJSON.success) {
              bulmaJS.alert({
                message: 'Permissions cleared successfully.',
                contextualColorName: 'info'
              })

              permissionsModalCloseFunction()
            } else {
              bulmaJS.alert({
                title: 'Error Clearing Permissions',
                message: 'Please try again.',
                contextualColorName: 'danger'
              })
            }

            users = responseJSON.users
            renderUsers()
          }
        )
      }

      bulmaJS.confirm({
        title: 'Clear All Permissions',
        message: `Are you sure you want to clear all of the permissions associated with "${userName}"?`,
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Clear All Permissions',
          callbackFunction: doClear
        }
      })
    }

    function populatePermissionsTable(): void {
      const tableBodyElement = permissionsModalElement.querySelector(
        'tbody'
      ) as HTMLTableSectionElement

      let uidCounter = 0

      for (const [permissionKey, permissionValues] of Object.entries(
        availablePermissionValues
      )) {
        const tableRowElement = document.createElement('tr')
        tableRowElement.dataset.permissionKey = permissionKey

        let iconClass: string

        switch (permissionKey.slice(permissionKey.lastIndexOf('.') + 1)) {
          case 'canView': {
            iconClass = 'fa-eye'
            break
          }
          case 'canUpdate': {
            iconClass = 'fa-pencil-alt'
            break
          }
          case 'canManage': {
            iconClass = 'fa-tools'
            break
          }
          default: {
            iconClass = 'fa-cog'
            break
          }
        }

        uidCounter += 1
        const uid = `permissionValue_${uidCounter.toString()}`

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
          </td>`

        const selectElement = tableRowElement.querySelector(
          'select'
        ) as HTMLSelectElement

        for (const permissionValue of permissionValues) {
          selectElement.insertAdjacentHTML(
            'beforeend',
            `<option value="${permissionValue}">${permissionValue}</option>`
          )
        }

        selectElement.addEventListener('change', highlightRow)

        tableRowElement
          .querySelector('form')
          ?.addEventListener('submit', setUserPermission)

        tableBodyElement.append(tableRowElement)
      }

      cityssm.postJSON(
        `${Attend.urlPrefix}/admin/doGetUserPermissions`,
        {
          userName
        },
        (rawResponseJSON) => {
          const responseJSON =
            rawResponseJSON as unknown as DoGetUserPermissionsResponse

          let formIndex = 0

          for (const [permissionKey, permissionValue] of Object.entries(
            responseJSON.userPermissions
          )) {
            const tableRowElement = tableBodyElement.querySelector(
              `tr[data-permission-key="${permissionKey}"]`
            )

            if (tableRowElement === null) {
              formIndex += 1
              const formId = `form--permissionValue-${formIndex.toString()}`

              tableBodyElement.insertAdjacentHTML(
                'beforeend',
                `<tr data-permission-key="${permissionKey}">
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
                  </tr>`
              )

              tableBodyElement
                .querySelector(`#${formId}`)
                ?.addEventListener('submit', setUserPermission)
            } else {
              const selectElement = tableRowElement.querySelector(
                'select'
              ) as HTMLSelectElement

              if (
                selectElement.querySelector(
                  `option[value="${permissionValue}"]`
                ) === null
              ) {
                selectElement.insertAdjacentHTML(
                  'beforeend',
                  `<option>${permissionValue}</option>`
                )
              }
              selectElement.value = permissionValue
            }
          }

          tableBodyElement.closest('table')?.classList.remove('is-hidden')
        }
      )
    }

    cityssm.openHtmlModal('userAdmin-userPermissions', {
      onshow(modalElement) {
        cityssm.enableNavBlocker()

        permissionsModalElement = modalElement
        ;(
          modalElement.querySelector('.modal-card-title') as HTMLElement
        ).textContent = userName

        populatePermissionsTable()
      },
      onshown(modalElement, closeModalFunction) {
        permissionsModalCloseFunction = closeModalFunction

        bulmaJS.init(modalElement)

        buttonElement.blur()
        bulmaJS.toggleHtmlClipped()

        modalElement
          .querySelector('.is-clear-permissions-button')
          ?.addEventListener('click', clearPermissions)
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
        cityssm.disableNavBlocker()
        buttonElement.focus()
      }
    })
  }

  function renderUsers(): void {
    usersTableBodyElement.innerHTML = ''

    for (const user of users) {
      if (canLoginFilterElement.checked && !user.canLogin) {
        continue
      }

      const tableRowElement = document.createElement('tr')
      tableRowElement.dataset.userName = user.userName

      tableRowElement.innerHTML = `<td class="is-vcentered">
          ${user.userName}
            ${
              (user.employeeSurname ?? '') === ''
                ? ''
                : `<br />
                  <span class="is-size-7 has-tooltip-right" data-tooltip="Employee">
                  <i class="fas fa-hard-hat" aria-hidden="true"></i> ${
                    user.employeeSurname ?? ''
                  }, ${user.employeeGivenName ?? ''}
                  </span>`
            }
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
              <i class="fas ${
                user.canLogin ? 'fa-check' : 'fa-times'
              }" aria-hidden="true"></i>
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
              <i class="fas ${
                user.isAdmin ? 'fa-check' : 'fa-times'
              }" aria-hidden="true"></i>
            </span>
          </div>
        </td>
        <td class="has-width-1 has-text-centered">
          <button class="button is-user-permissions-button" data-cy="permissions" type="button">
            <span class="icon is-small">
              <span class="fa-layers fa-fw">
                <i class="fas fa-th-list" aria-hidden="true"></i>
                ${
                  (user.permissionCount ?? 0) > 0
                    ? `<span class="fa-layers-counter has-background-info">${user.permissionCount}</span>`
                    : ''
                }
              </span>
            </span>
            <span>Permissions</span>
          </button>
        </td>
        <td class="has-width-1">
          <button class="button is-danger is-delete-button" data-cy="delete" type="button" aria-label="Delete">
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
        </td>`

      tableRowElement
        .querySelector('select[data-field="canLogin"]')
        ?.addEventListener('change', toggleCanLogin)

      tableRowElement
        .querySelector('select[data-field="isAdmin"]')
        ?.addEventListener('change', toggleIsAdmin)

      tableRowElement
        .querySelector('.is-user-permissions-button')
        ?.addEventListener('click', openUserPermissionsModal)

      tableRowElement
        .querySelector('.is-delete-button')
        ?.addEventListener('click', deleteUser)

      usersTableBodyElement.append(tableRowElement)
    }
  }

  canLoginFilterElement.addEventListener('click', renderUsers)

  document
    .querySelector('.is-add-user-button')
    ?.addEventListener('click', () => {
      let addCloseModalFunction: () => void

      function doAddUser(formEvent: Event): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          `${Attend.urlPrefix}/admin/doAddUser`,
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON =
              rawResponseJSON as unknown as DoModifyUserResponse

            if (responseJSON.success) {
              addCloseModalFunction()

              bulmaJS.alert({
                message: 'User added successfully.',
                contextualColorName: 'success'
              })

              users = responseJSON.users
              renderUsers()
            } else {
              bulmaJS.alert({
                title: 'Error Adding User',
                message:
                  'Please ensure the user does not already have access, then try again.',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      cityssm.openHtmlModal('userAdmin-addUser', {
        onshow(modalElement) {
          ;(
            modalElement.querySelector('#userAdd--userDomain') as HTMLElement
          ).textContent = `${userDomain}\\`
        },
        onshown(modalElement, closeModalFunction) {
          addCloseModalFunction = closeModalFunction

          bulmaJS.toggleHtmlClipped()

          const userNameElement = modalElement.querySelector(
            '#userAdd--userName'
          ) as HTMLInputElement

          // Try to defeat browser auto populating
          userNameElement.value = ''

          userNameElement.focus()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', doAddUser)
        },
        onremoved() {
          bulmaJS.toggleHtmlClipped()
        }
      })
    })

  renderUsers()
})()
