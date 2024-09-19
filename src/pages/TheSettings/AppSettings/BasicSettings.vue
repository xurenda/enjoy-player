<template>
  <a-typography-title :level="5">{{ t('settings.basic') }}</a-typography-title>
  <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <a-form-item :label="t('settings.language')">
      <a-select v-model:value="basicSettingsStore.locale">
        <a-select-option v-for="item in availableLocales" :key="item.key" :value="item.key">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { availableLocales } from '@/i18n'
import useBasicSettingsStore from '@/stores/settings/basic'

const { t } = useI18n()

const basicSettingsStore = useBasicSettingsStore()
</script>
