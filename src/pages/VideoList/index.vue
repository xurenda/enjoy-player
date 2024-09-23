<template>
  <div class="sticky top-0 z-50 px-6 py-3">
    <a-segmented v-model:value="uiSettingsStore.listViewType" :options="listViewTypes.map(i => ({ value: i }))">
      <template #label="{ value }">
        <i :class="`iconfont icon-${value}`"></i>
        <span class="ml-1">{{ t(value) }}</span>
      </template>
    </a-segmented>
  </div>
  <div class="box-border flex-1 px-6 py-3">
    <TheLoading
      :loading="videoListStore.loading"
      :error="videoListStore.error"
      :data="videoListStore.list"
      :checkIsEmpty="() => !videoListStore.list.length"
    >
      <ViewList v-if="uiSettingsStore.listViewType === 'list'" :list="videoListStore.list" />
      <ViewGallery v-else :list="videoListStore.list" />
      <template #empty>
        <VideoSourceTour />
      </template>
    </TheLoading>
  </div>
  <div
    v-show="videoListStore.total > videoListStore.limit"
    class="sticky bottom-0 left-0 right-0 flex w-full justify-center border-t border-color-border bg-color-bg py-2"
  >
    <a-pagination
      v-model:current="curPage"
      :total="videoListStore.total"
      show-less-items
      :pageSize="videoListStore.limit"
      :showSizeChanger="false"
      show-quick-jumper
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ViewGallery from './ViewGallery.vue'
import useVideoListStore from '@/stores/videoList'
import TheLoading from '@/components/TheLoading.vue'
import ViewList from './ViewList.vue'
import useUISettingsStore, { listViewTypes } from '@/stores/settings/ui'
import { computed } from 'vue'
import VideoSourceTour from './VideoSourceTour.vue'

defineOptions({ name: 'VideoList' })

const { t } = useI18n()
const uiSettingsStore = useUISettingsStore()
const videoListStore = useVideoListStore()
const curPage = computed({
  get() {
    return videoListStore.curPage
  },
  set(val) {
    videoListStore.changePage(val)
  },
})
</script>
