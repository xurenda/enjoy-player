<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <TheHeader />
    <div class="flex flex-1 overflow-hidden">
      <div class="flex h-full flex-col overflow-hidden" :style="{ width: `${settingsStore.navWidth}px` }">
        <TheNav />
      </div>
      <ResizeBar v-show="settingsStore.navWidth > 0" v-model:resize-size="settingsStore.navWidth" />
      <div class="flex h-full flex-1 flex-col overflow-hidden px-6 py-3">
        <RouterView />
      </div>
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
