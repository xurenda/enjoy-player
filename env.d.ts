/// <reference types="vite/client" />

declare const __curVersion__: string

interface Window {
  searchInputRef: HTMLInputElement | null
  electronAPI?: {
    versions: {
      node: string
      chrome: string
      electron: string
    }
  }
}
