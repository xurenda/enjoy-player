<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <TheHeader />
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from './TheHeader.vue'

defineOptions({
  name: 'WithHeader'
})
</script>