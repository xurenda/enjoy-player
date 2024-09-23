/// <reference types="vite/client" />

interface Window {
  curVersion: string
  searchInputRef: HTMLInputElement | null
  electronAPI?: {
    versions: {
      node: string
      chrome: string
      electron: string
    }
  }
}
