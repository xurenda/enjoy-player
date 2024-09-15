import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'
import jp from './jp.json'

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
    jp,
  },
})

export default i18n
