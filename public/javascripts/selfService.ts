import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { CallOutList } from '../../types/recordTypes.js'

declare const bulmaJS: BulmaJS
declare const cityssm: cityssmGlobal
;(() => {
  // eslint-disable-next-line unicorn/prefer-module
  const urlPrefix = exports.urlPrefix as string

  /*
   * Employee Tab
   */

  const employeeMessageContainerElement = document.querySelector(
    '#employee--message'
  ) as HTMLElement

  const employeeNumberElement = document.querySelector(
    '#employee--employeeNumber'
  ) as HTMLInputElement

  function employeeKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      validateEmployee()
    } else if (event.key !== 'Shift' && event.key !== 'Tab') {
      employeeMessageContainerElement.innerHTML = ''
    }
  }

  employeeNumberElement.addEventListener('keyup', employeeKeyUp)

  const employeeHomeContactLastFourDigitsElement = document.querySelector(
    '#employee--homeContact_lastFourDigits'
  ) as HTMLInputElement

  employeeHomeContactLastFourDigitsElement.addEventListener(
    'keyup',
    employeeKeyUp
  )

  function validateEmployee(): void {
    employeeMessageContainerElement.innerHTML = `<p class="has-text-centered">
      <i class="fas fa-4x fa-cog fa-spin" aria-hidden="true"></i><br />
      <em>Loading employee...</em>
      </p>`

    if (!employeeNumberElement.checkValidity()) {
      employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
        <p class="message-body">
        Please enter a valid <strong>Employee Number</strong>.
        </p>
        </div>`

      employeeNumberElement.focus()

      return
    }

    if (!employeeHomeContactLastFourDigitsElement.checkValidity()) {
      employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
        <p class="message-body">
        Please enter a valid <strong>Last Four Digits</strong>.
        </p>
        </div>`

      employeeHomeContactLastFourDigitsElement.focus()

      return
    }

    cityssm.postJSON(
      `${urlPrefix}/doValidateEmployee`,
      {
        employeeNumber: employeeNumberElement.value,
        employeeHomeContactLastFourDigits:
          employeeHomeContactLastFourDigitsElement.value
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          isAbuser?: boolean
          errorMessage?: string
          employeeName?: string
        }

        if (responseJSON.success) {
          employeeMessageContainerElement.innerHTML = ''
          document.querySelector('#tab--employee')?.classList.add('is-hidden')
          ;(
            document.querySelector(
              '#employeeOptions--employeeName'
            ) as HTMLElement
          ).textContent = responseJSON.employeeName ?? ''

          document
            .querySelector('#tab--employeeOptions')
            ?.classList.remove('is-hidden')

          document
            .querySelector('#employeeOptionsTab--menu')
            ?.classList.remove('is-hidden')
        } else {
          if (responseJSON.isAbuser ?? false) {
            window.location.reload()
          }

          employeeMessageContainerElement.innerHTML = `<div class="message is-danger">
            <p class="message-body">
            <strong>${responseJSON.errorMessage ?? ''}</strong><br />
            If errors persist, please contact a manager for assistance.</p>
            </div>`
        }
      }
    )
  }

  document
    .querySelector('#employee--nextButton')
    ?.addEventListener('click', validateEmployee)

  /*
   * Sign Out
   */

  function signOut(clickEvent?: Event): void {
    if (clickEvent !== undefined) {
      clickEvent.preventDefault()
    }

    // Hide all tabs

    const panelTabElements = document.querySelectorAll(
      '.panel-tab, .employeeOptionsTab'
    )

    for (const panelTabElement of panelTabElements) {
      panelTabElement.classList.add('is-hidden')
    }

    employeeNumberElement.value = ''
    employeeHomeContactLastFourDigitsElement.value = ''
    employeeMessageContainerElement.innerHTML = ''

    document.querySelector('#tab--employee')?.classList.remove('is-hidden')
  }

  const signOutButtonElements = document.querySelectorAll('.is-sign-out-button')

  for (const signOutButtonElement of signOutButtonElements) {
    signOutButtonElement.addEventListener('click', signOut)
  }

  function monitorInactivity(): void {
    let time: NodeJS.Timeout
    window.addEventListener('load', resetTimer)
    document.addEventListener('mousemove', resetTimer)
    document.addEventListener('keydown', resetTimer)

    function resetTimer(): void {
      globalThis.clearTimeout(time)
      time = globalThis.setTimeout(signOut, 2 * 60 * 1000) // 2 minutes
    }
  }

  window.addEventListener('load', monitorInactivity)

  /*
   * Select Employee Option
   */

  function selectEmployeeOptionTab(clickEvent: Event): void {
    clickEvent.preventDefault()

    const tabHash = (clickEvent.currentTarget as HTMLAnchorElement).hash

    document
      .querySelector('#employeeOptionsTab--menu')
      ?.classList.add('is-hidden')

    // Chage to switch if more options are added
    if (tabHash === '#employeeOptionsTab--callOutListAdd') {
      loadCallOutLists()
    }

    document.querySelector(tabHash)?.classList.remove('is-hidden')
  }

  const employeeOptionTabElements = document.querySelectorAll(
    '#employeeOptionsTab--menu a.panel-block'
  )

  for (const employeeOptionTabElement of employeeOptionTabElements) {
    employeeOptionTabElement.addEventListener('click', selectEmployeeOptionTab)
  }

  function backToOptions(clickEvent?: Event): void {
    if (clickEvent !== undefined) {
      clickEvent.preventDefault()
    }

    // Hide all tabs

    const panelTabElements = document.querySelectorAll('.employeeOptionsTab')

    for (const panelTabElement of panelTabElements) {
      panelTabElement.classList.add('is-hidden')
    }

    document
      .querySelector('#employeeOptionsTab--menu')
      ?.classList.remove('is-hidden')
  }

  const backToOptionsElements = document.querySelectorAll(
    '.is-back-to-options-button'
  )

  for (const backToOptionsElement of backToOptionsElements) {
    backToOptionsElement.addEventListener('click', backToOptions)
  }

  /*
   * Call Out List Add
   */

  function addEmployeeToCallOutList(clickEvent: Event): void {
    clickEvent.preventDefault()

    const buttonElement = clickEvent.currentTarget as HTMLButtonElement
    buttonElement.disabled = true
    buttonElement.classList.add('is-loading')

    const panelBlockElement = buttonElement.closest(
      '.panel-block'
    ) as HTMLElement

    const listId = panelBlockElement.dataset.listId ?? ''

    let selfSignUpKey = ''

    const selfSignUpKeyElement = panelBlockElement.querySelector(
      `#callOutListAdd--selfSignUpKey_${listId}`
    )

    if (selfSignUpKeyElement !== null) {
      selfSignUpKey = (selfSignUpKeyElement as HTMLInputElement).value
      if (selfSignUpKey === '') {
        // eslint-disable-next-line no-extra-semi
        ;(selfSignUpKeyElement as HTMLInputElement).focus()

        buttonElement.disabled = false
        buttonElement.classList.remove('is-loading')
        return
      }
    }

    cityssm.postJSON(
      `${urlPrefix}/doAddEmployeeToCallOutList`,
      {
        employeeNumber: employeeNumberElement.value,
        employeeHomeContactLastFourDigits:
          employeeHomeContactLastFourDigitsElement.value,
        listId,
        selfSignUpKey
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
        }

        if (responseJSON.success) {
          // eslint-disable-next-line no-extra-semi
          ;(
            panelBlockElement.querySelector(
              '.is-add-button-container'
            ) as HTMLElement
          ).innerHTML =
            '<i class="fas fa-check" aria-hidden="true"></i> Added to List'
        } else {
          bulmaJS.alert({
            title: 'Error Adding Employee to List',
            message:
              responseJSON.errorMessage ?? 'Unknown error.  Please try again',
            contextualColorName: 'danger'
          })

          buttonElement.disabled = false
          buttonElement.classList.remove('is-loading')
        }
      }
    )
  }

  function loadCallOutLists(): void {
    const containerElement = document.querySelector(
      '#container--callOutListAdd'
    ) as HTMLElement

    containerElement.innerHTML = `<p class="has-text-centered">
      <i class="fas fa-4x fa-cog fa-spin" aria-hidden="true"></i><br />
      <em>Loading call out lists...</em>
      </p>`

    cityssm.postJSON(
      `${urlPrefix}/doGetAvailableCallOutLists`,
      {
        employeeNumber: employeeNumberElement.value,
        employeeHomeContactLastFourDigits:
          employeeHomeContactLastFourDigitsElement.value
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          callOutLists: CallOutList[]
        }

        if (responseJSON.callOutLists.length === 0) {
          containerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">
            There are no call out lists that you are eligible to sign up for.
          </p>
          </div>`

          return
        }

        const panelElement = document.createElement('div')
        panelElement.className = 'panel'

        for (const callOutList of responseJSON.callOutLists) {
          const panelBlockElement = document.createElement('div')
          panelBlockElement.className =
            'panel-block is-justify-content-space-between'
          panelBlockElement.dataset.listId = callOutList.listId

          panelBlockElement.innerHTML = `<div>
            <strong>${cityssm.escapeHTML(callOutList.listName)}</strong><br />
            ${cityssm.escapeHTML(callOutList.listDescription ?? '')}
            </div>
            <div class="is-add-button-container"></div>`

          if (callOutList.hasSelfSignUpKey ?? true) {
            ;(
              panelBlockElement.querySelector(
                '.is-add-button-container'
              ) as HTMLElement
            ).innerHTML = `<div class="field has-addons">
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
              </div>`
          } else {
            ;(
              panelBlockElement.querySelector(
                '.is-add-button-container'
              ) as HTMLElement
            ).innerHTML = `<button class="button is-success is-add-button" type="button">
                <span class="icon"><i class="fas fa-plus" aria-hidden="true"></i></span>
                <span>Add to List</span>
              </button>`
          }

          panelBlockElement
            .querySelector('.is-add-button')
            ?.addEventListener('click', addEmployeeToCallOutList)

          panelElement.append(panelBlockElement)
        }

        containerElement.innerHTML = ''
        containerElement.append(panelElement)
      }
    )
  }
})()
