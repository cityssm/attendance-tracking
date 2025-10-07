import type { Attend as AttendGlobal } from '../../types/globalTypes.js'

declare const exports: {
  Attend: AttendGlobal
}
;(() => {
  const Attend = exports.Attend

  /*
   * Menu Tabs
   */

  const menuTabElements: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('#menu--reports a')

  const tabContainerElements: NodeListOf<HTMLElement> =
    document.querySelectorAll('#tabs-container--reports > article')

  Attend.initializeMenuTabs(menuTabElements, tabContainerElements)

  /*
   * Raw Exports Toggle
   */

  const toggleAnchorElements = document.querySelectorAll(
    '.panel a.is-panel-block-toggle'
  )

  for (const toggleAnchorElement of toggleAnchorElements) {
    toggleAnchorElement.addEventListener('click', Attend.togglePanelBlocks)
  }
})()
