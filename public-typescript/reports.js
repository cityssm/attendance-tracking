"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    // eslint-disable-next-line unicorn/prefer-module
    const MonTY = exports.MonTY;
    /*
     * Menu Tabs
     */
    const menuTabElements = document.querySelectorAll('#menu--reports a');
    const tabContainerElements = document.querySelectorAll('#tabs-container--reports > article');
    MonTY.initializeMenuTabs(menuTabElements, tabContainerElements);
    /*
     * Raw Exports Toggle
     */
    function togglePanelBlocks(clickEvent) {
        clickEvent.preventDefault();
        const panelBlockElements = clickEvent.currentTarget.closest('.panel').querySelectorAll('.panel-block');
        for (const panelBlockElement of panelBlockElements) {
            panelBlockElement.classList.toggle('is-hidden');
        }
    }
    const toggleAnchorElements = document.querySelectorAll('.panel a.is-panel-block-toggle');
    for (const toggleAnchorElement of toggleAnchorElements) {
        toggleAnchorElement.addEventListener('click', togglePanelBlocks);
    }
})();
