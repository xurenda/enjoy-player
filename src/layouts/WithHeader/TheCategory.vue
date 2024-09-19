<template>
  <div class="box-border flex-1 overflow-y-auto pb-2">
    <TheLoading
      class="box-border px-2"
      :loading="videoListStore.categoryLoading"
      :error="videoListStore.categoryError"
      :data="videoListStore.category"
      :checkIsEmpty="() => !videoListStore.category.length"
    >
      <a-menu
        v-model:selectedKeys="selectedKeys"
        class="w-full"
        mode="inline"
        :items="videoListStore.categoryTree"
      ></a-menu>
    </TheLoading>
  </div>
</template>

<script lang="ts" setup>
import TheLoading from '@/components/TheLoading.vue'
import { computed } from 'vue'
import useVideoListStore from '@/stores/videoList'

const videoListStore = useVideoListStore()
const selectedKeys = computed<[number]>({
  get() {
    return [videoListStore.curCategory]
  },
  set(val) {
    videoListStore.curCategory = val[0]
  },
})
</script>
