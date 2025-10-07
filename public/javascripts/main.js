"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector('main')?.dataset.urlPrefix;
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
                    if (tabContainerElement.closest('.modal') === null) {
                        window.scrollTo({ top: 0 });
                    }
                    else {
                        tabContainerElement.scrollIntoView(true);
                    }
                }
                else {
                    tabContainerElement.classList.add('is-hidden');
                }
            }
        }
        for (const menuTabElement of menuTabElements) {
            if (menuTabElement.target === '') {
                menuTabElement.addEventListener('click', selectTab);
            }
        }
    }
    /*
     * Panel Block Toggle
     */
    function togglePanelBlocks(clickEvent) {
        clickEvent.preventDefault();
        const panelBlockElements = clickEvent.currentTarget.closest('.panel').querySelectorAll('.panel-block');
        for (const panelBlockElement of panelBlockElements) {
            panelBlockElement.classList.toggle('is-hidden');
        }
    }
    const Attend = {
        urlPrefix,
        setUnsavedChanges,
        clearUnsavedChanges,
        hasUnsavedChanges,
        initializeMenuTabs,
        togglePanelBlocks
    };
    // eslint-disable-next-line unicorn/prefer-module
    exports.Attend = Attend;
})();
