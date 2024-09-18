<template>
  <div class="flex-1 px-6 py-3">
    <TheLoading :loading="videoDetailStore.loading" :error="videoDetailStore.error" :data="videoDetailStore.data">
      <div class="flex">
        <ResizeBar
          v-model:resize-size="seriesWidth"
          bind-on="second"
          :bar-style="heightStyle"
          :second-style="heightStyle"
        >
          <template #first>
            <VideoPlayer ref="playerDataRef" :data="videoDetailStore.data!" />
          </template>
          <template #second>
            <MiniVideoEpisodes :data="videoDetailStore.data!" />
          </template>
        </ResizeBar>
      </div>

      <VideoDesc :data="videoDetailStore.data!" />
    </TheLoading>
  </div>
</template>

<script setup lang="ts">
import TheLoading from '@/components/TheLoading.vue'
import useVideoDetailStore from '@/stores/videoDetail'
import VideoPlayer from './VideoPlayer.vue'
import VideoDesc from './VideoDesc.vue'
import MiniVideoEpisodes from './MiniVideoEpisodes.vue'
import ResizeBar from '@/components/ResizeBar.vue'
import { computed, ref, useTemplateRef, watchEffect, type CSSProperties } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

defineOptions({ name: 'VideoDetail' })

const videoDetailStore = useVideoDetailStore()

const heightStyle = ref<CSSProperties>({})
const resizeObserver = new ResizeObserver(entries => {
  heightStyle.value = { height: entries[0].target.clientHeight + 'px' }
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

const seriesWidth = ref(250)
</script>
