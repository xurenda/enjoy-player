<template>
  <a-collapse class="rounded-none" v-model:activeKey="activeKeys">
    <a-collapse-panel class="rounded-none" key="1">
      <template #header>
        <div class="flex justify-between">
          <div class="font-bold">
            {{ data.vod_name }}{{ videoDetailStore.curEpisode?.name ? ` - ${videoDetailStore.curEpisode.name}` : '' }}
          </div>
          <div>
            {{ data.type_name || data.vod_class }}
          </div>
        </div>
      </template>
      <div>
        <div v-for="item in infos" :key="item.name" class="mb-2 flex">
          <div class="mr-2 text-right font-bold" :class="basicSettingsStore.locale === 'en' ? 'w-28' : 'w-20'">
            {{ item.name }}{{ t('colonSymbol') }}
          </div>
          <div class="flex-1">{{ item.value || t('videoInfo.nothing') }}</div>
        </div>
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import type { VideoDetailResponse } from '@/api/detail'
import useBasicSettingsStore from '@/stores/settings/basic'
import useVideoDetailStore from '@/stores/videoDetail'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { data } = defineProps<{
  data: VideoDetailResponse
}>()

const activeKeys = ref([])
const { t } = useI18n()
const videoDetailStore = useVideoDetailStore()
const basicSettingsStore = useBasicSettingsStore()

const infos = computed(() => {
  const d = {
    tags: data.vod_class?.split(',').join(t('splittingSymbol')),
    author: (data.vod_author || data.vod_director)?.split(',').join(t('splittingSymbol')),
    actor: data.vod_actor?.split(',').join(t('splittingSymbol')),
    lang: data.vod_lang,
    area: data.vod_area,
    year: data.vod_year,
    time: data.vod_time,
    content: data.vod_content,
  }
  return [
    { name: t('videoInfo.tags'), value: d.tags },
    { name: t('videoInfo.author'), value: d.author },
    { name: t('videoInfo.actor'), value: d.actor },
    { name: t('videoInfo.lang'), value: d.lang },
    { name: t('videoInfo.area'), value: d.area },
    { name: t('videoInfo.year'), value: d.year },
    { name: t('videoInfo.time'), value: d.time },
    { name: t('videoInfo.content'), value: d.content },
  ]
})
</script>
