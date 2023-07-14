"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    // eslint-disable-next-line unicorn/prefer-module
    const MonTY = exports.MonTY;
    const menuTabElements = document.querySelectorAll('#menu--attendance a');
    const tabContainerElements = document.querySelectorAll('#tabs-container--attendance > article');
    MonTY.initializeMenuTabs(menuTabElements, tabContainerElements);
})();
