import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const navWidthRange = [200, 500]
export const defaultNavWidth = 250

export const useNavStore = defineStore('nav', () => {
  const show = ref(false)
  const width = ref(defaultNavWidth)
  const toggle = () => (show.value = !show.value)
  const computedWidth = computed({
    get() {
      const w = width.value
      return show.value ? w : 0
    },
    set(val) {
      if (val < navWidthRange[0] || val > navWidthRange[1]) return
      width.value = val
    },
  })

  return { show, width: computedWidth, toggle }
})
