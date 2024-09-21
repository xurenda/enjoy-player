<template>
  <div class="h-screen w-screen min-w-[720px] overflow-hidden text-sm">
    <ResizeBar
      v-model:resize-size="uiSettingsStore.navWidth"
      :disabled="uiSettingsStore.navWidth === 0"
      :range="uiSettingsStore.navWidthRange"
      first-class="flex h-full flex-col overflow-x-hidden overflow-y-auto duration-100"
      second-class="flex flex-col"
    >
      <template #first>
        <TheNav />
      </template>
      <template #second>
        <TheHeader />
        <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <RouterView />
        </div>
      </template>
    </ResizeBar>
  </div>
</template>

<script setup lang="ts">
import useUISettingsStore from '@/stores/settings/ui'
import TheHeader from './TheHeader.vue'
import TheNav from './TheNav.vue'
import ResizeBar from '@/components/ResizeBar.vue'

defineOptions({
  name: 'WithHeader',
})

const uiSettingsStore = useUISettingsStore()
</script>
