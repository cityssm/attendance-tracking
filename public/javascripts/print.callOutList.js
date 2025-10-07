;
(() => {
    function toggleColumn(inputElement, cellElements) {
        for (const cellElement of cellElements) {
            cellElement.classList.toggle('is-hidden', !inputElement.checked);
        }
    }
    /*
     * Row Number Toggle
     */
    const rowNumberToggleCheckboxElement = document.querySelector('#option--showRowNumber');
    const rowNumberCellElements = document.querySelectorAll('.column--rowNumber');
    function toggleShowRowNumber() {
        toggleColumn(rowNumberToggleCheckboxElement, rowNumberCellElements);
    }
    rowNumberToggleCheckboxElement.addEventListener('click', toggleShowRowNumber);
    toggleShowRowNumber();
    /*
     * Sort Key Toggle
     */
    const sortKeyToggleCheckboxElement = document.querySelector('#option--showSortKey');
    const sortKeyCellElements = document.querySelectorAll('.column--sortKey');
    function toggleShowSortKey() {
        toggleColumn(sortKeyToggleCheckboxElement, sortKeyCellElements);
    }
    sortKeyToggleCheckboxElement.addEventListener('click', toggleShowSortKey);
    toggleShowSortKey();
})();
