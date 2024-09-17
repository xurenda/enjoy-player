<template>
  <div ref="playerContainer"></div>
  {{ data }}
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
  playerContainer.value!.appendChild(playerData.player.elements.container!)
})

onBeforeUnmount(() => {
  hlsPlayerStore.destroyPlayer(playerData.data.vod_id)
})
</script>
