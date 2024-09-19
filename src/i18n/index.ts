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

export const availableLocales = [
  {
    key: 'zh',
    name: '简体中文',
  },
  {
    key: 'en',
    name: 'English',
  },
  {
    key: 'jp',
    name: '日本語',
  },
]

export function getLocaleFromNavigator() {
  const locale = availableLocales.find(l => navigator.language.toLowerCase().startsWith(l.key))
  return locale ?? availableLocales[0]
}
