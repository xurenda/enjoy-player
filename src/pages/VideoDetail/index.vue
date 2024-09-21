<template>
  <div class="flex-1 px-6 py-3">
    <TheLoading :loading="videoDetailStore.loading" :error="videoDetailStore.error" :data="videoDetailStore.data">
      <DetailContent :data="videoDetailStore.data!" />
    </TheLoading>
  </div>
</template>

<script setup lang="ts">
import TheLoading from '@/components/TheLoading.vue'
import useVideoDetailStore from '@/stores/videoDetail'
import DetailContent from './DetailContent.vue'

defineOptions({ name: 'VideoDetail' })

const videoDetailStore = useVideoDetailStore()
</script>
