<template>
  <div class="h-screen w-screen overflow-hidden">
    <ResizeBar
      v-model:resize-size="settingsStore.navWidth"
      :disabled="settingsStore.navWidth === 0"
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
import TheHeader from './TheHeader.vue'
import TheNav from './TheNav.vue'
import ResizeBar from '@/components/ResizeBar.vue'
import useSettingsStore from '@/stores/settings'

defineOptions({
  name: 'WithHeader',
})

const settingsStore = useSettingsStore()
</script>
