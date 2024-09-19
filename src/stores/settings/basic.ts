import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { getLocaleFromNavigator } from '@/i18n'
import { useI18n } from 'vue-i18n'

const useBasicSettingsStore = defineStore(
  'basicSettings',
  () => {
    const locale = ref(getLocaleFromNavigator().key)
    const i18n = useI18n()

    watchEffect(() => {
      i18n.locale.value = locale.value
    })

    return { locale }
  },
  {
    persist: true,
  },
)

export default useBasicSettingsStore
