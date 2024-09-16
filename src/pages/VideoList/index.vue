<template>
  <div>
    <a-segmented v-model:value="settingsStore.listViewType" :options="listViewTypes.map(i => ({ value: i }))">
      <template #label="{ value }">
        <i :class="`iconfont icon-${value}`"></i>
        <span class="ml-1">{{ t(value) }}</span>
      </template>
    </a-segmented>
  </div>
  <div class="my-2 flex-1 overflow-auto">
    <TheLoading
      :loading="videoListStore.loading"
      :error="videoListStore.error"
      :data="videoListStore.data.list"
      :checkIsEmpty="() => !videoListStore.data.list.length"
    >
      <ViewList v-if="settingsStore.listViewType === 'list'" :list="videoListStore.data.list" />
      <ViewGallery v-else :list="videoListStore.data.list" />
    </TheLoading>
  </div>
  <div v-show="videoListStore.data.total > pageSize" class="flex justify-center">
    <a-pagination
      v-model:current="videoListStore.curPage"
      :total="videoListStore.data.total"
      show-less-items
      :pageSize="pageSize"
      :showSizeChanger="false"
      show-quick-jumper
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import useSettingsStore, { listViewTypes } from '@/stores/settings'
import ViewGallery from './ViewGallery.vue'
import useVideoListStore from '@/stores/videoList'
import TheLoading from '@/components/TheLoading.vue'
import ViewList from './ViewList.vue'

defineOptions({ name: 'VideoList' })

const { t } = useI18n()
const settingsStore = useSettingsStore()
const videoListStore = useVideoListStore()
const pageSize = 20
</script>
