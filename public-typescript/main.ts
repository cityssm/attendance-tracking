import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

import type * as globalTypes from '../types/globalTypes'

declare const cityssm: cityssmGlobal
;(() => {
  const urlPrefix = document.querySelector('main')!.dataset.urlPrefix!

  /*
   * Unsaved Changes
   */

  let _hasUnsavedChanges = false

  function setUnsavedChanges(): void {
    if (!hasUnsavedChanges()) {
      _hasUnsavedChanges = true
      cityssm.enableNavBlocker()
    }
  }

  function clearUnsavedChanges(): void {
    _hasUnsavedChanges = false
    cityssm.disableNavBlocker()
  }

  function hasUnsavedChanges(): boolean {
    return _hasUnsavedChanges
  }

  /*
   * Menu Tabs
   */

  function initializeMenuTabs(
    menuTabElements: NodeListOf<HTMLAnchorElement>,
    tabContainerElements: NodeListOf<HTMLElement>
  ): void {
    function selectTab(clickEvent: Event): void {
      clickEvent.preventDefault()

      // Remove .is-active from all tabs
      for (const menuTabElement of menuTabElements) {
        menuTabElement.classList.remove('is-active')
      }

      // Set .is-active on clicked tab
      const selectedTabElement = clickEvent.currentTarget as HTMLAnchorElement
      selectedTabElement.classList.add('is-active')

      // Hide all but selected tab
      const selectedTabContainerId = selectedTabElement.href.slice(
        Math.max(0, selectedTabElement.href.indexOf('#') + 1)
      )

      for (const tabContainerElement of tabContainerElements) {
        if (tabContainerElement.id === selectedTabContainerId) {
          tabContainerElement.classList.remove('is-hidden')
        } else {
          tabContainerElement.classList.add('is-hidden')
        }
      }
    }

    for (const menuTabElement of menuTabElements) {
      if (menuTabElement.target === '') {
        menuTabElement.addEventListener('click', selectTab)
      }
    }
  }

  const MonTY: globalTypes.MonTY = {
    urlPrefix,
    setUnsavedChanges,
    clearUnsavedChanges,
    hasUnsavedChanges,
    initializeMenuTabs
  }

  // eslint-disable-next-line unicorn/prefer-module
  exports.MonTY = MonTY
})()
