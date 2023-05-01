"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const MonTY = exports.MonTY;
    const menuTabElements = document.querySelectorAll('#menu--attendance a');
    const tabContainerElements = document.querySelectorAll('#tabs-container--attendance > article');
    MonTY.initializeMenuTabs(menuTabElements, tabContainerElements);
})();
