<template>
  <a-config-provider
    :locale="locale"
    :theme="{
      algorithm,
      token: {
        colorPrimary: uiSettingsStore.primaryColor,
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import en from 'ant-design-vue/es/locale/en_US'
import zh from 'ant-design-vue/es/locale/zh_CN'
import jp from 'ant-design-vue/es/locale/ja_JP'
import useBasicSettingsStore from './stores/settings/basic'
import useUISettingsStore from './stores/settings/ui'

const basicSettingsStore = useBasicSettingsStore()
const uiSettingsStore = useUISettingsStore()

const locale = computed(() => {
  switch (basicSettingsStore.locale) {
    case 'en':
      return en
    case 'zh':
      return zh
    case 'jp':
      return jp
    default:
      return en
  }
})

const algorithm = computed(() => {
  switch (uiSettingsStore.realTheme) {
    case 'dark':
      return theme.darkAlgorithm
    case 'light':
      return theme.defaultAlgorithm
    default:
      return theme.defaultAlgorithm
  }
})
</script>
