import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const navWidthRange = [200, 500]
export const defaultNavWidth = 250

export const listViewTypes = ['list', 'gallery'] as const

export type ListViewTypes = (typeof listViewTypes)[number]

const useSettingsStore = defineStore(
  'settings',
  () => {
    // --------- nav ---------
    const navShow = ref(false)
    const _navWidth = ref(defaultNavWidth)
    const toggleNav = () => (navShow.value = !navShow.value)
    const navWidth = computed({
      get() {
        const w = _navWidth.value
        return navShow.value ? w : 0
      },
      set(val) {
        if (val < navWidthRange[0] || val > navWidthRange[1]) return
        _navWidth.value = val
      },
    })

    // --------- list ---------
    const listViewType = ref<ListViewTypes>('list')

    return { navShow, navWidth, _navWidth, toggleNav, listViewType }
  },
  {
    persist: {
      omit: ['navShow'],
    },
  },
)

export default useSettingsStore
