<template>
  <div class="flex-1 px-6 py-3">
    <TheLoading :loading="videoDetailStore.loading" :error="videoDetailStore.error" :data="videoDetailStore.data">
      <div class="flex">
        <ResizeBar
          v-model:resize-size="uiSettingsStore.episodesWidth"
          bind-on="second"
          :disabled="!episodesPositionRight"
          :range="uiSettingsStore.episodesWidthRange"
          :bar-style="{ height: `${playerHeight}px` }"
          :second-style="{ height: `${playerHeight}px`, ...(episodesPositionRight ? {} : { width: '0' }) }"
        >
          <template #first>
            <VideoPlayer ref="playerDataRef" :data="videoDetailStore.data!" />
          </template>
          <template #second>
            <VideoEpisodes v-if="episodesPositionRight" :data="videoDetailStore.data!" />
          </template>
        </ResizeBar>
      </div>
      <VideoDesc :data="videoDetailStore.data!" />
      <VideoEpisodes v-if="!episodesPositionRight" :data="videoDetailStore.data!" />
    </TheLoading>
  </div>
</template>

<script setup lang="ts">
import TheLoading from '@/components/TheLoading.vue'
import useVideoDetailStore from '@/stores/videoDetail'
import VideoPlayer from './VideoPlayer.vue'
import VideoDesc from './VideoDesc.vue'
import VideoEpisodes from './VideoEpisodes.vue'
import ResizeBar from '@/components/ResizeBar.vue'
import { computed, ref, useTemplateRef, watchEffect } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import useUISettingsStore from '@/stores/settings/ui'

defineOptions({ name: 'VideoDetail' })

const videoDetailStore = useVideoDetailStore()
const uiSettingsStore = useUISettingsStore()

const playerHeight = ref<number>(0)
const resizeObserver = new ResizeObserver(entries => {
  playerHeight.value = entries[0].target.clientHeight
})
const playerDataRef = useTemplateRef<ComponentExposed<typeof VideoPlayer>>('playerDataRef')
const playerContainer = computed(() => playerDataRef.value?.playerData.player.elements.container)
watchEffect(() => {
  if (playerContainer.value) {
    const containerDom = playerContainer.value
    resizeObserver.observe(containerDom)
    return () => resizeObserver.unobserve(containerDom)
  }
})

const episodesPositionRight = computed(() => uiSettingsStore.episodesPosition === 'right')
</script>
