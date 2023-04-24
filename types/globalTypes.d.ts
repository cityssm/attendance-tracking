export interface MonTY {
    urlPrefix: string;
    setUnsavedChanges: () => void;
    clearUnsavedChanges: () => void;
    hasUnsavedChanges: () => boolean;
}
