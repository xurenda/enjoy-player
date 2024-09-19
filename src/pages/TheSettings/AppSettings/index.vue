<template>
  <BasicSettings />
  <UISettings />
</template>

<script setup lang="ts">
import BasicSettings from './BasicSettings.vue'
import UISettings from './UISettings.vue'

defineOptions({ name: 'AppSettings' })
</script>
