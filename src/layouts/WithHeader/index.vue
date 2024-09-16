<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <TheHeader />
    <div class="flex flex-1 overflow-hidden">
      <div class="flex h-full flex-col overflow-hidden" :style="{ width: `${navStore.width}px` }">
        <TheNav />
      </div>
      <ResizeBar v-show="navStore.width > 0" v-model:resize-size="navStore.width" />
      <div class="h-full flex-1 overflow-hidden">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from './TheHeader.vue'
import TheNav from './TheNav.vue'
import ResizeBar from '@/components/ResizeBar.vue'
import { useNavStore } from '@/stores/nav'

defineOptions({
  name: 'WithHeader',
})

const navStore = useNavStore()
</script>
