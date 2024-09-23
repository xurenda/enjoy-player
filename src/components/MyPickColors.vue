<template>
  <div
    :class="{ active: showPicker }"
    class="flex cursor-pointer items-center rounded-md border border-color-border duration-200 hover:border-color-primary dark:bg-black [&.active]:border-color-primary"
    @click="showPicker = true"
  >
    <pick-colors
      v-model:value="value"
      v-model:show-picker="showPicker"
      :theme="uiSettingsStore.realTheme"
      :format-options="['rgb', 'hex']"
      v-bind="$attrs"
    />
    <div v-if="title" class="mr-2">{{ title }}</div>
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
