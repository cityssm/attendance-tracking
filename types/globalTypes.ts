export interface MonTY {
  urlPrefix: string

  setUnsavedChanges: () => void
  clearUnsavedChanges: () => void
  hasUnsavedChanges: () => boolean
  initializeMenuTabs: (
    menuTabElements: NodeListOf<HTMLAnchorElement>,
    tabContainerElements: NodeListOf<HTMLElement>
  ) => void
}
