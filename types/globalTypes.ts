import type { CallOutList } from './recordTypes.js'

export interface Attend {
  urlPrefix: string

  setUnsavedChanges: () => void
  clearUnsavedChanges: () => void
  hasUnsavedChanges: () => boolean
  initializeMenuTabs: (
    menuTabElements: NodeListOf<HTMLAnchorElement>,
    tabContainerElements: NodeListOf<HTMLElement>
  ) => void

  togglePanelBlocks: (clickEvent: Event) => void

  callOuts?: AttendCallOuts
}

export interface AttendCallOuts {
  callOutLists: CallOutList[]
  openCallOutList: (
    listId: string,
    onUpdateCallbackFunction?: () => void
  ) => void
}
