<template>
  <div class="box-border flex h-full flex-col border-r border-t">
    <div class="flex items-baseline space-x-1 p-2">
      <div class="text-nowrap text-lg font-bold">{{ t('selectEpisode') }}</div>
      <div class="truncate text-sm text-slate-500">{{ data.vod_remarks }}</div>
    </div>
    <div class="pointer-events-none absolute -z-50 h-1 w-max overflow-hidden opacity-0" ref="textWidthRef">
      <div v-for="item in data.vod_play_url" :key="item.url">
        {{ item.name }}
      </div>
    </div>
    <div
      class="episodes-box grid flex-1 gap-2 overflow-y-auto overflow-x-hidden p-2 pt-0"
      :style="{
        'grid-template-columns': `repeat(auto-fit, minmax(${textWidth}px, 1fr))`,
      }"
    >
      <div
        v-for="(item, idx) in data.vod_play_url"
        :class="{ active: videoDetailStore.curEpisodeIdx === idx }"
        class="relative flex cursor-pointer items-center justify-center rounded border p-1 hover:bg-slate-200 [&.active]:bg-slate-200"
        :key="item.url"
        :title="item.name"
        @click="videoDetailStore.changeEpisode(idx)"
      >
        <div class="truncate">{{ item.name }}</div>
        <div class="absolute" :class="{ playon: videoDetailStore.curEpisodeIdx === idx }">
          <i></i><i></i><i></i><i></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoDetailResponse } from '@/api/detail'
import useVideoDetailStore from '@/stores/videoDetail'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { data } = defineProps<{
  data: VideoDetailResponse
}>()

const { t } = useI18n()
const videoDetailStore = useVideoDetailStore()
const textWidthRef = useTemplateRef<HTMLDivElement>('textWidthRef')
const textWidth = computed(() => Math.max(textWidthRef.value?.offsetWidth || 0, 50))
</script>

<style scoped>
.episodes-box {
  /* grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)); */
  grid-auto-rows: 50px;
  justify-items: stretch;
}

@keyframes playon {
  0% {
    height: 70%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 35%;
  }
}

.playon {
  height: 8px;
  left: calc(50% - 11px);
  bottom: 0;
}
.playon i {
  width: 4px;
  height: 6px;
  border-radius: 4px 4px 0 0;
  background-color: rgb(29 78 216 / 1);
  position: absolute;
  bottom: 0;
  left: 0;
}
.playon i:nth-last-child(1) {
  animation: playon 0.8s 0.3s infinite;
}
.playon i:nth-last-child(2) {
  animation: playon 0.8s 0.1s infinite;
  left: 6px;
}
.playon i:nth-last-child(3) {
  animation: playon 0.6s 0.2s infinite;
  left: 12px;
}
.playon i:nth-last-child(4) {
  animation: playon 1s 0.3s infinite;
  left: 18px;
}
</style>
