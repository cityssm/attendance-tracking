import type { MonTY as MonTYGlobal } from '../types/globalTypes.js'
;(() => {
  // eslint-disable-next-line unicorn/prefer-module
  const MonTY = exports.MonTY as MonTYGlobal

  /*
   * Menu Tabs
   */

  const menuTabElements: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('#menu--reports a')

  const tabContainerElements: NodeListOf<HTMLElement> =
    document.querySelectorAll('#tabs-container--reports > article')

  MonTY.initializeMenuTabs(menuTabElements, tabContainerElements)

  /*
   * Raw Exports Toggle
   */

  function togglePanelBlocks(clickEvent: Event): void {
    clickEvent.preventDefault()

    const panelBlockElements = (clickEvent.currentTarget as HTMLElement)
      .closest('.panel')!
      .querySelectorAll('.panel-block')!

    for (const panelBlockElement of panelBlockElements) {
      panelBlockElement.classList.toggle('is-hidden')
    }
  }

  const toggleAnchorElements = document.querySelectorAll(
    '.panel a.is-panel-block-toggle'
  )

  for (const toggleAnchorElement of toggleAnchorElements) {
    toggleAnchorElement.addEventListener('click', togglePanelBlocks)
  }
})()
