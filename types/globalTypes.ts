import type * as recordTypes from './recordTypes'

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
  callOutLists: recordTypes.CallOutList[]
  openCallOutList: (
    listId: string,
    onUpdateCallbackFunction?: () => void
  ) => void
}
