;
(() => {
    const sortKeyToggleCheckboxElement = document.querySelector('#option--showSortKey');
    const sortKeyCellElements = document.querySelectorAll('.column--sortKey');
    function toggleShowSortKey() {
        for (const sortKeyCellElement of sortKeyCellElements) {
            if (sortKeyToggleCheckboxElement.checked) {
                sortKeyCellElement.classList.remove('is-hidden');
            }
            else {
                sortKeyCellElement.classList.add('is-hidden');
            }
        }
    }
    sortKeyToggleCheckboxElement.addEventListener('click', toggleShowSortKey);
    toggleShowSortKey();
})();
