<template>
  <div class="ViewList">
    <div class="ml-auto mr-auto w-1024">
      <div class="mb-8 flex" v-for="item in list" :key="item.vod_id">
        <img class="h-50 w-36 object-cover" :src="item.vod_pic" :alt="item.vod_name" />
        <div class="ml-16">
          <div class="f mb-6 text-2xl font-bold">{{ item.vod_name }}</div>
          <div class="mb-2">影片类型：{{ item.vod_class }}</div>
          <div class="mb-4">发布时间：{{ item.vod_time }}</div>
          <div class="indent-8">{{ item.vod_blurb }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { VideoDetailResponse } from '@/api/detail'
defineOptions({ name: 'ViewList' })
const { list } = defineProps<{
  list: VideoDetailResponse[]
}>()
</script>
