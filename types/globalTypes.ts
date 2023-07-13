import type { CallOutList } from './recordTypes.js'

export interface MonTY {
  urlPrefix: string

  setUnsavedChanges: () => void
  clearUnsavedChanges: () => void
  hasUnsavedChanges: () => boolean
  initializeMenuTabs: (
    menuTabElements: NodeListOf<HTMLAnchorElement>,
    tabContainerElements: NodeListOf<HTMLElement>
  ) => void

  callOuts?: MonTYCallOuts
}

export interface MonTYCallOuts {
  callOutLists: CallOutList[]
  openCallOutList: (
    listId: string,
    onUpdateCallbackFunction?: () => void
  ) => void
}
