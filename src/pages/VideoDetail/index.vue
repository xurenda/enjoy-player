<template>
  <TheLoading :loading="videoDetailStore.loading" :error="videoDetailStore.error" :data="videoDetailStore.data">
    <!-- {{ videoDetailStore.data.vod_play_url }} -->
    <HlsPlayer :source="videoDetailStore.data!.vod_play_url[0].url" />
  </TheLoading>
</template>

<script setup lang="ts">
import TheLoading from '@/components/TheLoading.vue'
import useVideoDetailStore from '@/stores/videoDetail'
import HlsPlayer from '@/components/HlsPlayer.vue'

defineOptions({ name: 'VideoDetail' })
const videoDetailStore = useVideoDetailStore()
</script>
