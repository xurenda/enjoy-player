<template>
  <div class="overflow-auto">
    <TheLoading :loading="videoDetailStore.loading" :error="videoDetailStore.error" :data="videoDetailStore.data">
      <VideoPlayer :data="videoDetailStore.data!" />
    </TheLoading>
  </div>
</template>

<script setup lang="ts">
import TheLoading from '@/components/TheLoading.vue'
import useVideoDetailStore from '@/stores/videoDetail'
import VideoPlayer from './VideoPlayer.vue'

defineOptions({ name: 'VideoDetail' })

const videoDetailStore = useVideoDetailStore()
</script>
