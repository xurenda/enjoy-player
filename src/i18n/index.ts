import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
  },
})

export default i18n
