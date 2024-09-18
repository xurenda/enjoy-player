<template>
  <a-collapse class="rounded-none" v-model:activeKey="activeKeys">
    <a-collapse-panel class="rounded-none" key="1">
      <template #header>
        <div class="flex justify-between">
          <div class="font-bold">{{ data.vod_name }}</div>
          <div>{{ data.vod_class }}</div>
        </div>
      </template>
      <p>{{ data.vod_blurb }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import type { VideoDetailResponse } from '@/api/detail'
import { ref } from 'vue'

const { data } = defineProps<{
  data: VideoDetailResponse
}>()

const activeKeys = ref([])
</script>
