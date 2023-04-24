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
    const MonTY = {
        urlPrefix,
        setUnsavedChanges,
        clearUnsavedChanges,
        hasUnsavedChanges
    };
    // eslint-disable-next-line unicorn/prefer-module
    exports.MonTY = MonTY;
})();
