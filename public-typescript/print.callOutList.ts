;(() => {
  function toggleColumn(
    inputElement: HTMLInputElement,
    cellElements: NodeListOf<Element>
  ): void {
    for (const cellElement of cellElements) {
      if (inputElement.checked) {
        cellElement.classList.remove('is-hidden')
      } else {
        cellElement.classList.add('is-hidden')
      }
    }
  }

  /*
   * Row Number Toggle
   */

  const rowNumberToggleCheckboxElement = document.querySelector(
    '#option--showRowNumber'
  ) as HTMLInputElement

  const rowNumberCellElements = document.querySelectorAll('.column--rowNumber')

  function toggleShowRowNumber(): void {
    toggleColumn(rowNumberToggleCheckboxElement, rowNumberCellElements)
  }

  rowNumberToggleCheckboxElement.addEventListener('click', toggleShowRowNumber)
  toggleShowRowNumber()

  /*
   * Sort Key Toggle
   */

  const sortKeyToggleCheckboxElement = document.querySelector(
    '#option--showSortKey'
  ) as HTMLInputElement

  const sortKeyCellElements = document.querySelectorAll('.column--sortKey')

  function toggleShowSortKey(): void {
    toggleColumn(sortKeyToggleCheckboxElement, sortKeyCellElements)
  }

  sortKeyToggleCheckboxElement.addEventListener('click', toggleShowSortKey)
  toggleShowSortKey()
})()
