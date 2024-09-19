import { computed, ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const themes = ['light', 'dark', 'system'] as const

export type Theme = (typeof themes)[number]

const systemThemeMedia = window.matchMedia('(prefers-color-scheme: light)')

const useUISettingsStore = defineStore(
  'uiSettings',
  () => {
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

    // -------------------------

    const lightPrimaryColor = ref<string>('#1677ff')
    const darkPrimaryColor = ref<string>('#1677ff')
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

    watchEffect(() => {
      const root = document.documentElement
      root.style.setProperty('--color-primary', primaryColor.value)
      root.style.setProperty('--plyr-color-main', primaryColor.value)
    })

    return { theme, realTheme, primaryColor, lightPrimaryColor, darkPrimaryColor }
  },
  {
    persist: true,
  },
)

export default useUISettingsStore
