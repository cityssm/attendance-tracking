/* eslint-disable @typescript-eslint/indent */
/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
import type { BulmaJS } from '@cityssm/bulma-js/types'

import type * as recordTypes from '../types/recordTypes'

declare const bulmaJS: BulmaJS

declare const cityssm: cityssmGlobal
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  let users = exports.users as recordTypes.User[]
  delete exports.users

  const availablePermissionValues = exports.availablePermissionValues as Record<
    string,
    string[]
  >
  delete exports.availablePermissionValues

  const usersTableBodyElement = document.querySelector(
    '#tbody--users'
  ) as HTMLTableSectionElement

  function deleteUser(clickEvent: Event): void {
    clickEvent.preventDefault()

    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest(
      'tr'
    )!

    const userName = tableRowElement.dataset.userName ?? ''

    function doDelete(): void {
      cityssm.postJSON(
        MonTY.urlPrefix + '/admin/doDeleteUser',
        {
          userName
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            users: recordTypes.User[]
          }

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

    const userName = canLoginSelectElement.closest('tr')!.dataset.userName ?? ''

    cityssm.postJSON(
      MonTY.urlPrefix + '/admin/doUpdateUserCanLogin',
      {
        userName,
        canLogin: canLoginSelectElement.value
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          users: recordTypes.User[]
        }

        if (responseJSON.success) {
          canLoginSelectElement
            .closest('.control')!
            .querySelector('.icon')!.innerHTML = `<i class="fas ${
            canLoginSelectElement.value === '1' ? 'fa-check' : 'fa-times'
          }" aria-hidden="true"></i>`
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

    const userName = isAdminSelectElement.closest('tr')!.dataset.userName ?? ''

    cityssm.postJSON(
      MonTY.urlPrefix + '/admin/doUpdateUserIsAdmin',
      {
        userName,
        isAdmin: isAdminSelectElement.value
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          users: recordTypes.User[]
        }

        if (responseJSON.success) {
          isAdminSelectElement
            .closest('.control')!
            .querySelector('.icon')!.innerHTML = `<i class="fas ${
            isAdminSelectElement.value === '1' ? 'fa-check' : 'fa-times'
          }" aria-hidden="true"></i>`
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

    cityssm.postJSON(
      MonTY.urlPrefix + '/admin/doSetUserPermission',
      formEvent.currentTarget,
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
        }

        if (responseJSON.success) {
          bulmaJS.alert({
            message: 'Permission updated successfully.',
            contextualColorName: 'success'
          })
        } else {
          bulmaJS.alert({
            title: 'Error Updating Permission',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  function openUserPermissionsModal(clickEvent: Event): void {
    clickEvent.preventDefault()

    let permissionsModalElement: HTMLElement

    const userName =
      (clickEvent.currentTarget as HTMLElement).closest('tr')!.dataset
        .userName ?? ''

    function populatePermissionsTable(): void {
      const tableBodyElement = permissionsModalElement.querySelector('tbody')!

      for (const [permissionKey, permissionValues] of Object.entries(
        availablePermissionValues
      )) {
        const tableRowElement = document.createElement('tr')
        tableRowElement.dataset.permissionKey = permissionKey

        tableRowElement.innerHTML = `<td class="is-vcentered">${permissionKey}</td>
          <td>
            <form>
              <input name="userName" value="${userName}" type="hidden" />
              <input name="permissionKey" value="${permissionKey}" type="hidden" />
              <div class="field has-addons">
                <div class="control is-expanded">
                  <div class="select is-fullwidth">
                    <select name="permissionValue">
                      <option value="">(Not Set)</option>
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
          </td>`

        for (const permissionValue of permissionValues) {
          tableRowElement
            .querySelector('select')
            ?.insertAdjacentHTML(
              'beforeend',
              `<option value="${permissionValue}">${permissionValue}</option>`
            )
        }

        tableRowElement
          .querySelector('form')
          ?.addEventListener('submit', setUserPermission)

        tableBodyElement.append(tableRowElement)
      }

      cityssm.postJSON(
        MonTY.urlPrefix + '/admin/doGetUserPermissions',
        {
          userName
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            userPermissions: Record<string, string>
          }

          let formIndex = 0

          for (const [permissionKey, permissionValue] of Object.entries(
            responseJSON.userPermissions
          )) {
            const tableRowElement = tableBodyElement.querySelector(
              `tr[data-permission-key="${permissionKey}"]`
            )

            if (tableRowElement === null) {
              formIndex += 1
              const formId = 'form--permissionValue-' + formIndex.toString()

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
              const selectElement = tableRowElement.querySelector('select')!

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
        bulmaJS.toggleHtmlClipped()

        permissionsModalElement = modalElement

        modalElement.querySelector('.modal-card-title')!.textContent = userName

        populatePermissionsTable()
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  function renderUsers(): void {
    usersTableBodyElement.innerHTML = ''

    for (const user of users) {
      const tableRowElement = document.createElement('tr')
      tableRowElement.dataset.userName = user.userName

      tableRowElement.innerHTML = `<td class="is-vcentered">
          ${user.userName}
            ${
              (user.employeeSurname ?? '') === ''
                ? ''
                : `<br />
                  <span class="is-size-7">
                  <i class="fas fa-hard-hat" aria-hidden="true"></i> ${
                    user.employeeSurname ?? ''
                  }, ${user.employeeGivenName ?? ''}
                  </span>`
            }
          
        </td>
        <td>
          <div class="control has-icons-left">
            <div class="select">
              <select data-field="canLogin">
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
            <div class="select">
              <select data-field="isAdmin">
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
          <button class="button is-user-permissions-button" type="button">
            <span class="icon is-small"><i class="fas fa-th-list" aria-hidden="true"></i></span>
            <span>Permissions</span>
          </button>
        </td>
        <td class="has-width-1">
          <button class="button is-danger is-delete-button" type="button" aria-label="Delete">
            <span class="icon is-small"><i class="fas fa-trash" aria-hidden="true"></i></span>
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

  document
    .querySelector('.is-add-user-button')
    ?.addEventListener('click', () => {
      let addCloseModalFunction: () => void

      function doAddUser(formEvent: Event): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          MonTY.urlPrefix + '/admin/doAddUser',
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              success: boolean
              users: recordTypes.User[]
            }

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
        onshown(modalElement, closeModalFunction) {
          addCloseModalFunction = closeModalFunction

          const userNameElement = modalElement.querySelector('#userAdd--userName') as HTMLInputElement

          // Try to defeat browser auto populating
          userNameElement.value = ''

          userNameElement.focus()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', doAddUser)
        }
      })
    })

  renderUsers()
})()
