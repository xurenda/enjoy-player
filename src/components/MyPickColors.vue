<template>
  <div
    :class="{ active: showPicker }"
    class="border-color-border hover:border-color-primary [&.active]:border-color-primary flex cursor-pointer items-center rounded-md border duration-200"
    @click="showPicker = true"
  >
    <pick-colors
      v-model:value="value"
      v-model:show-picker="showPicker"
      :theme="uiSettingsStore.realTheme"
      v-bind="$attrs"
    />
    <div v-if="title" class="text-color-disable mr-2">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import useUISettingsStore from '@/stores/settings/ui'
import { ref } from 'vue'
import PickColors from 'vue-pick-colors'

defineOptions({
  inheritAttrs: false,
})

// InstanceType<typeof PickColors>['$props']
export interface MyPickColorsProps {
  title?: string
}

const { title } = defineProps<MyPickColorsProps>()
const value = defineModel<string>('value', { required: true })

const uiSettingsStore = useUISettingsStore()
const showPicker = ref(false)
</script>
