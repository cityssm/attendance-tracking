"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector('main').dataset.urlPrefix;
    /*
     * Unsaved Changes
     */
    let _hasUnsavedChanges = false;
    function setUnsavedChanges() {
        if (!hasUnsavedChanges()) {
            _hasUnsavedChanges = true;
            cityssm.enableNavBlocker();
        }
    }
    function clearUnsavedChanges() {
        _hasUnsavedChanges = false;
        cityssm.disableNavBlocker();
    }
    function hasUnsavedChanges() {
        return _hasUnsavedChanges;
    }
    /*
     * Menu Tabs
     */
    function initializeMenuTabs(menuTabElements, tabContainerElements) {
        function selectTab(clickEvent) {
            clickEvent.preventDefault();
            // Remove .is-active from all tabs
            for (const menuTabElement of menuTabElements) {
                menuTabElement.classList.remove('is-active');
            }
            // Set .is-active on clicked tab
            const selectedTabElement = clickEvent.currentTarget;
            selectedTabElement.classList.add('is-active');
            // Hide all but selected tab
            const selectedTabContainerId = selectedTabElement.href.slice(Math.max(0, selectedTabElement.href.indexOf('#') + 1));
            for (const tabContainerElement of tabContainerElements) {
                if (tabContainerElement.id === selectedTabContainerId) {
                    tabContainerElement.classList.remove('is-hidden');
                }
                else {
                    tabContainerElement.classList.add('is-hidden');
                }
            }
        }
        for (const menuTabElement of menuTabElements) {
            menuTabElement.addEventListener('click', selectTab);
        }
    }
    const MonTY = {
        urlPrefix,
        setUnsavedChanges,
        clearUnsavedChanges,
        hasUnsavedChanges,
        initializeMenuTabs
    };
    // eslint-disable-next-line unicorn/prefer-module
    exports.MonTY = MonTY;
})();
