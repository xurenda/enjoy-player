import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const api = ref('https://cjhwba.com/api.php/provide/vod/')

  return { api }
})
