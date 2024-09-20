<template>
  <a-typography-title :level="5">{{ t('settings.basic') }}</a-typography-title>
  <a-typography-paragraph type="secondary" :content="t('settings.basicDesc1')" />
  <a-typography-paragraph type="secondary" :content="t('settings.basicDesc2')" />
  <a-form :label-col="{ span: formColWidth[0] }" :wrapper-col="{ span: formColWidth[1] }">
    <a-form-item :label="t('settings.language')">
      <a-segmented
        v-model:value="basicSettingsStore.locale"
        :options="availableLocales.map(i => ({ value: i.key, payload: i }))"
      >
        <template #label="{ payload }">
          <span>{{ payload.name }}</span>
        </template>
      </a-segmented>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { availableLocales } from '@/i18n'
import useBasicSettingsStore from '@/stores/settings/basic'

const { formColWidth } = defineProps<{ formColWidth: [number, number] }>()

const { t } = useI18n()
const basicSettingsStore = useBasicSettingsStore()
</script>
