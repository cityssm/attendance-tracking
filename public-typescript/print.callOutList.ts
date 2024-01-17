;(() => {
  const sortKeyToggleCheckboxElement = document.querySelector(
    '#option--showSortKey'
  ) as HTMLInputElement
  const sortKeyCellElements = document.querySelectorAll('.column--sortKey')

  function toggleShowSortKey(): void {
    for (const sortKeyCellElement of sortKeyCellElements) {
      if (sortKeyToggleCheckboxElement.checked) {
        sortKeyCellElement.classList.remove('is-hidden')
      } else {
        sortKeyCellElement.classList.add('is-hidden')
      }
    }
  }

  sortKeyToggleCheckboxElement.addEventListener('click', toggleShowSortKey)
  toggleShowSortKey()
})()
