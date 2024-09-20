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
        :selectedKeys="selectedKeys"
        class="w-full"
        mode="inline"
        :items="videoListStore.categoryTree"
        @click="(e: any) => videoListStore.changeCategory(e.key)"
      ></a-menu>
    </TheLoading>
  </div>
</template>

<script lang="ts" setup>
import TheLoading from '@/components/TheLoading.vue'
import { computed } from 'vue'
import useVideoListStore from '@/stores/videoList'

const videoListStore = useVideoListStore()
const selectedKeys = computed<[number]>(() => [videoListStore.curCategory])
</script>
