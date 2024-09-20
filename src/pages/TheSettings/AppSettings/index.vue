<template>
  <div class="box-border h-full overflow-y-auto overflow-x-hidden pr-2">
    <BasicSettings :formColWidth="formColWidth" />
    <UISettings :formColWidth="formColWidth" />
    <PlayerSettings :formColWidth="formColWidth" />
  </div>
</template>

<script setup lang="ts">
import BasicSettings from './BasicSettings.vue'
import UISettings from './UISettings.vue'
import PlayerSettings from './PlayerSettings.vue'
import { computed } from 'vue'
import useBasicSettingsStore from '@/stores/settings/basic'

defineOptions({ name: 'AppSettings' })

const basicSettingsStore = useBasicSettingsStore()

const formColWidth = computed<[number, number]>(() => {
  switch (basicSettingsStore.locale) {
    case 'zh':
      return [4, 20]
    default:
      return [6, 18]
  }
})
</script>
