<template>
  <a-config-provider :locale="locale">
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import en from 'ant-design-vue/es/locale/en_US'
import zh from 'ant-design-vue/es/locale/zh_CN'
import jp from 'ant-design-vue/es/locale/ja_JP'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const locale = computed(() => {
  switch (i18n.locale.value) {
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
</script>
