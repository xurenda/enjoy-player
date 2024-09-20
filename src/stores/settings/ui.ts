import { computed, ref, watch, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import useDebounceRef from '@/hooks/useDebounceRef'

export const themes = ['light', 'dark', 'system'] as const
export type Theme = (typeof themes)[number]
const systemThemeMedia = window.matchMedia('(prefers-color-scheme: light)')

export const maxWidthRange: [number, number] = [100, 1000]
const defaultWidthRange: [number, number] = [200, 500]
const defaultNavWidth = 250
const defaultEpisodesWidth = 250

export const listViewTypes = ['list', 'gallery'] as const
export type ListViewTypes = (typeof listViewTypes)[number]

export const episodesPositions = ['right', 'bottom'] as const
export type EpisodesPositions = (typeof episodesPositions)[number]

const useUISettingsStore = defineStore(
  'uiSettings',
  () => {
    // #region ------------ theme -------------
    const theme = ref<Theme>('system')
    const systemTheme = ref<Exclude<Theme, 'system'>>(systemThemeMedia.matches ? 'light' : 'dark')
    systemThemeMedia.onchange = (e: any) => {
      const isLight = e.target.matches as boolean
      systemTheme.value = isLight ? 'light' : 'dark'
    }
    const realTheme = computed<Exclude<Theme, 'system'>>(() => {
      if (theme.value === 'system') {
        return systemTheme.value
      }
      return theme.value
    })

    watchEffect(() => {
      switch (realTheme.value) {
        case 'light':
          document.documentElement.classList.remove('dark')
          break
        case 'dark':
          document.documentElement.classList.add('dark')
          break
      }
    })
    // #endregion

    // #region ----------- primary color --------------
    const lightPrimaryColor = useDebounceRef<string>('#1677ff')
    const darkPrimaryColor = useDebounceRef<string>('#1677ff')
    const lockPrimaryColor = ref(false)
    const primaryColor = computed(() => {
      switch (realTheme.value) {
        case 'light':
          return lightPrimaryColor.value
        case 'dark':
          return darkPrimaryColor.value
        default:
          return lightPrimaryColor.value
      }
    })

    watch(lightPrimaryColor, () => {
      if (lockPrimaryColor.value) {
        darkPrimaryColor.value = lightPrimaryColor.value
      }
    })

    watch(darkPrimaryColor, () => {
      if (lockPrimaryColor.value) {
        lightPrimaryColor.value = darkPrimaryColor.value
      }
    })

    watchEffect(() => {
      const root = document.documentElement
      root.style.setProperty('--color-primary', primaryColor.value)
      root.style.setProperty('--plyr-color-main', primaryColor.value)
    })
    // #endregion

    // #region ----------- nav --------------
    const navShow = ref(false)
    const _navWidth = ref(defaultNavWidth)
    const navWidthRange = ref<[number, number]>(defaultWidthRange)
    const navWidth = computed({
      get() {
        const w = _navWidth.value
        return navShow.value ? w : 0
      },
      set(val) {
        if (val < navWidthRange.value[0] || val > navWidthRange.value[1]) return
        _navWidth.value = val
      },
    })
    watchEffect(() => {
      const [min, max] = navWidthRange.value
      if (_navWidth.value < min) {
        _navWidth.value = min
      }
      if (_navWidth.value > max) {
        _navWidth.value = max
      }
    })
    const settingsShow = ref(false)
    // #endregion

    // #region --------- list ---------
    const listViewType = ref<ListViewTypes>('gallery')
    // #endregion

    // #region --------- episodes ---------
    const episodesPosition = ref<EpisodesPositions>('right')
    const _episodesWidth = ref(defaultEpisodesWidth)
    const episodesWidthRange = useDebounceRef<[number, number]>(defaultWidthRange)
    const episodesWidth = computed({
      get() {
        return _episodesWidth.value
      },
      set(val) {
        if (val < episodesWidthRange.value[0] || val > episodesWidthRange.value[1]) return
        _episodesWidth.value = val
      },
    })
    watchEffect(() => {
      const [min, max] = episodesWidthRange.value
      if (_episodesWidth.value < min) {
        _episodesWidth.value = min
      }
      if (_episodesWidth.value > max) {
        _episodesWidth.value = max
      }
    })
    // #endregion

    return {
      theme,
      realTheme,
      primaryColor,
      lightPrimaryColor,
      darkPrimaryColor,
      lockPrimaryColor,
      navShow,
      navWidth,
      _navWidth,
      navWidthRange,
      settingsShow,
      listViewType,
      episodesPosition,
      _episodesWidth,
      episodesWidth,
      episodesWidthRange,
    }
  },
  {
    persist: {
      omit: ['settingsShow'],
    },
  },
)

export default useUISettingsStore
