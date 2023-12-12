"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    // eslint-disable-next-line unicorn/prefer-module
    const Attend = exports.Attend;
    /*
     * Menu Tabs
     */
    const menuTabElements = document.querySelectorAll('#menu--reports a');
    const tabContainerElements = document.querySelectorAll('#tabs-container--reports > article');
    Attend.initializeMenuTabs(menuTabElements, tabContainerElements);
    /*
     * Raw Exports Toggle
     */
    const toggleAnchorElements = document.querySelectorAll('.panel a.is-panel-block-toggle');
    for (const toggleAnchorElement of toggleAnchorElements) {
        toggleAnchorElement.addEventListener('click', Attend.togglePanelBlocks);
    }
})();
