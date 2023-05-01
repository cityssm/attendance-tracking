/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  const menuTabElements: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('#menu--attendance a')

  const tabContainerElements: NodeListOf<HTMLElement> =
    document.querySelectorAll('#tabs-container--attendance > article')

  MonTY.initializeMenuTabs(menuTabElements, tabContainerElements)
})()
