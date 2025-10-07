import type { Attend as AttendGlobal } from '../../types/globalTypes.js'
;(() => {
  const Attend = exports.Attend as AttendGlobal

  const menuTabElements: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('#menu--attendance a')

  const tabContainerElements: NodeListOf<HTMLElement> =
    document.querySelectorAll('#tabs-container--attendance > article')

  Attend.initializeMenuTabs(menuTabElements, tabContainerElements)
})()
