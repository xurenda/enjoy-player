<template>
  <div class="mx-auto mb-3 flex flex-wrap gap-4">
    <div
      v-for="item in list"
      :key="item.type_id"
      class="border-color-border group relative w-52 cursor-pointer overflow-hidden rounded-md border transition-shadow duration-200 hover:shadow-lg"
      @click="goToDetail(item.vod_id)"
    >
      <img :src="item.vod_pic" :alt="item.vod_name" class="h-72 w-full object-cover" />
      <div
        class="absolute bottom-0 left-0 right-0 bg-black/10 p-2 opacity-0 backdrop-blur-sm duration-100 group-hover:opacity-100"
      >
        <div class="text-white">{{ item.vod_name }}</div>
      </div>
      <a-tag
        v-if="item.vod_class || item.type_name"
        class="absolute right-1 top-2 opacity-0 duration-100 group-hover:opacity-100"
        :color="getColorByKey(item.vod_class || item.type_name)"
      >
        {{ item.vod_class || item.type_name }}
      </a-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoDetailResponse } from '@/api/detail'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import { getColorByKey } from '@/utils/color'

const { list } = defineProps<{
  list: VideoDetailResponse[]
}>()

const router = useKeepQueryRouter()

const goToDetail = (id: number) => {
  router.push({ name: 'videoDetail', params: { id: `${id}` } })
}
</script>
