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
    data: zh,
  },
  {
    key: 'en',
    name: 'English',
    data: en,
  },
  {
    key: 'jp',
    name: '日本語',
    data: jp,
  },
]

export function getLocaleFromNavigator() {
  const locale = availableLocales.find(l => navigator.language.toLowerCase().startsWith(l.key))
  return locale ?? availableLocales[0]
}

export function getPlyrI18n(locale: string) {
  const localeData = availableLocales.find(l => l.key === locale) ?? availableLocales[0]
  return localeData.data.plyr
}
