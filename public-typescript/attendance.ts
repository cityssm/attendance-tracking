import type { MonTY as MonTYGlobal } from '../types/globalTypes.js'
;(() => {
  // eslint-disable-next-line unicorn/prefer-module
  const MonTY = exports.MonTY as MonTYGlobal

  const menuTabElements: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('#menu--attendance a')

  const tabContainerElements: NodeListOf<HTMLElement> =
    document.querySelectorAll('#tabs-container--attendance > article')

  MonTY.initializeMenuTabs(menuTabElements, tabContainerElements)
})()
