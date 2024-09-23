import { computed, ref, watch, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import useDebounceRef from '@/hooks/useDebounceRef'
import { getColor, toRGBColor } from '@/utils/color'

export const themes = ['light', 'dark', 'system'] as const
export type Theme = (typeof themes)[number]
const systemThemeMedia = window.matchMedia('(prefers-color-scheme: light)')
const defaultPrimaryColor = '#1677ff'

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
    const lightPrimaryColor = useDebounceRef<string>(defaultPrimaryColor)
    const darkPrimaryColor = useDebounceRef<string>(defaultPrimaryColor)
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
      let colorArr = getColor(primaryColor.value)
      if (!colorArr) {
        colorArr = getColor(defaultPrimaryColor)
      }
      const RGBcolor = toRGBColor(colorArr!)
      root.style.setProperty('--color-primary-arr', colorArr!.join(' '))
      root.style.setProperty('--color-primary', RGBcolor)
      root.style.setProperty('--plyr-color-main', RGBcolor)
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
    watch(navWidthRange, () => {
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
    watch(episodesWidthRange, () => {
      const [min, max] = episodesWidthRange.value
      if (_episodesWidth.value < min) {
        _episodesWidth.value = min
      }
      if (_episodesWidth.value > max) {
        _episodesWidth.value = max
      }
    })
    // #endregion

    const importSettings = (data: Record<string, any>) => {
      if (themes.includes(data.theme)) {
        theme.value = data.theme
      }
      const lColor = getColor(data.lightPrimaryColor)
      if (lColor) {
        lightPrimaryColor.value = toRGBColor(lColor)
      }
      const dColor = getColor(data.darkPrimaryColor)
      if (dColor) {
        darkPrimaryColor.value = toRGBColor(dColor)
      }
      if (typeof data.lockPrimaryColor === 'boolean') {
        lockPrimaryColor.value = data.lockPrimaryColor
      }
      if (typeof data.navShow === 'boolean') {
        navShow.value = data.navShow
      }
      if (
        Array.isArray(data.navWidthRange) &&
        data.navWidthRange.length >= 2 &&
        typeof data.navWidthRange[0] === 'number' &&
        typeof data.navWidthRange[1] === 'number' &&
        data.navWidthRange[0] <= data.navWidthRange[1] &&
        data.navWidthRange[0] >= maxWidthRange[0] &&
        data.navWidthRange[1] <= maxWidthRange[1]
      ) {
        navWidthRange.value = [data.navWidthRange[0], data.navWidthRange[1]]
      }
      if (
        typeof data._navWidth === 'number' &&
        data._navWidth >= navWidthRange.value[0] &&
        data._navWidth <= navWidthRange.value[1]
      ) {
        _navWidth.value = data._navWidth
      }
      if (listViewTypes.includes(data.listViewType)) {
        listViewType.value = data.listViewType
      }
      if (episodesPositions.includes(data.episodesPosition)) {
        episodesPosition.value = data.episodesPosition
      }
      if (
        Array.isArray(data.episodesWidthRange) &&
        data.episodesWidthRange.length >= 2 &&
        typeof data.episodesWidthRange[0] === 'number' &&
        typeof data.episodesWidthRange[1] === 'number' &&
        data.episodesWidthRange[0] <= data.episodesWidthRange[1] &&
        data.episodesWidthRange[0] >= maxWidthRange[0] &&
        data.episodesWidthRange[1] <= maxWidthRange[1]
      ) {
        episodesWidthRange.value = [data.episodesWidthRange[0], data.episodesWidthRange[1]]
      }
      if (
        typeof data._episodesWidth === 'number' &&
        data._episodesWidth >= episodesWidthRange.value[0] &&
        data._episodesWidth <= episodesWidthRange.value[1]
      ) {
        _episodesWidth.value = data._episodesWidth
      }
    }

    const resetSettings = () => {
      theme.value = 'system'
      lightPrimaryColor.value = defaultPrimaryColor
      darkPrimaryColor.value = defaultPrimaryColor
      lockPrimaryColor.value = false
      navShow.value = false
      navWidthRange.value = defaultWidthRange
      _navWidth.value = defaultNavWidth
      listViewType.value = 'gallery'
      episodesPosition.value = 'right'
      episodesWidthRange.value = defaultWidthRange
      _episodesWidth.value = defaultEpisodesWidth
    }

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
      importSettings,
      resetSettings,
    }
  },
  {
    persist: {
      omit: ['settingsShow'],
    },
  },
)

export default useUISettingsStore
