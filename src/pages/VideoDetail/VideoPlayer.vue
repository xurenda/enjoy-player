<template>
  <div ref="playerContainer" class="flex w-full justify-center"></div>
</template>

<script setup lang="ts">
import type { VideoDetailResponse } from '@/api/detail'
import useHlsPlayerStore from '@/stores/hlsPlayer'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

const { data } = defineProps<{
  data: VideoDetailResponse
}>()

const playerContainer = useTemplateRef<HTMLDivElement>('playerContainer')
const hlsPlayerStore = useHlsPlayerStore()
const playerData = hlsPlayerStore.initPlayer(data)

onMounted(() => {
  const container = playerData.player.elements.container!
  container.style.width = '100%'
  container.style.maxHeight = 'calc(100vh - 131px)'
  container.style.aspectRatio = '16 / 9'
  playerContainer.value!.appendChild(container)
})

onBeforeUnmount(() => {
  hlsPlayerStore.destroyPlayer(playerData.data.vod_id)
})

defineExpose({ playerData })
</script>
