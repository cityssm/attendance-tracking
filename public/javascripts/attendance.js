"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const Attend = exports.Attend;
    const menuTabElements = document.querySelectorAll('#menu--attendance a');
    const tabContainerElements = document.querySelectorAll('#tabs-container--attendance > article');
    Attend.initializeMenuTabs(menuTabElements, tabContainerElements);
})();
