/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
;(() => {
  const MonTY = exports.MonTY as globalTypes.MonTY

  const menuTabElements: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('#menu--reports a')

  const tabContainerElements: NodeListOf<HTMLElement> =
    document.querySelectorAll('#tabs-container--reports > article')

  MonTY.initializeMenuTabs(menuTabElements, tabContainerElements)
})()
