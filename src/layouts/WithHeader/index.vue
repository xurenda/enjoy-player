<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <TheHeader />
    <div class="flex flex-1 overflow-hidden">
      <ResizeBar
        v-model:resize-size="settingsStore.navWidth"
        :disabled="settingsStore.navWidth === 0"
        first-class="flex h-full flex-col overflow-hidden duration-100"
        second-class="flex h-full flex-1 flex-col overflow-hidden px-6 py-3"
      >
        <template #first>
          <TheNav />
        </template>
        <template #second>
          <RouterView />
        </template>
      </ResizeBar>
    </div>
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
