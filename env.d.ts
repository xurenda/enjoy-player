/// <reference types="vite/client" />

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
