import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { availableLocales, getLocaleFromNavigator } from '@/i18n'
import { useI18n } from 'vue-i18n'

const useBasicSettingsStore = defineStore(
  'basicSettings',
  () => {
    const locale = ref(getLocaleFromNavigator().key)
    const i18n = useI18n()

    watchEffect(() => {
      i18n.locale.value = locale.value
    })

    const importSettings = (data: Record<string, any>) => {
      if (availableLocales.find(i => i.key === data.locale)) {
        locale.value = data.locale
      }
    }

    const resetSettings = () => {
      locale.value = getLocaleFromNavigator().key
    }

    return { locale, importSettings, resetSettings }
  },
  {
    persist: true,
  },
)

export default useBasicSettingsStore
