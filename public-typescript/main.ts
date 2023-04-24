import type * as globalTypes from '../types/globalTypes'

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

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

  const MonTY: globalTypes.MonTY = {
    urlPrefix,
    setUnsavedChanges,
    clearUnsavedChanges,
    hasUnsavedChanges
  }

  // eslint-disable-next-line unicorn/prefer-module
  exports.MonTY = MonTY
})()
