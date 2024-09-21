<template>
  <div>
    <div
      class="mb-2 flex h-44 overflow-hidden border-b border-color-border pb-2 last:mb-0 last:border-b-0 last:pb-0"
      v-for="item in list"
      :key="item.vod_id"
    >
      <div
        class="h-full w-36 cursor-pointer overflow-hidden rounded border border-color-border bg-cover bg-center bg-no-repeat"
        :style="`background-image: url(${item.vod_pic})`"
        @click="goToDetail(item.vod_id)"
      ></div>
      <div class="ml-3 flex-1 space-y-2">
        <div class="flex items-baseline justify-between space-x-1">
          <div class="cursor-pointer text-base font-bold" @click="goToDetail(item.vod_id)">
            {{ item.vod_name }}
          </div>
          <div class="truncate text-color-disable">{{ item.vod_remarks }}</div>
        </div>
        <div v-if="item.vod_class || item.type_name" class="flex gap-y-1">
          <a-tag v-for="tag in (item.vod_class || item.type_name).split(',')" :key="tag" :color="getColorByKey(tag)">
            {{ tag }}
          </a-tag>
        </div>
        <div class="truncate">
          <span v-if="item.vod_lang" class="mr-3 border-r border-color-border pr-3">{{ item.vod_lang }}</span>
          <span v-if="item.vod_area" class="mr-3 border-r border-color-border pr-3">{{ item.vod_area }}</span>
          <span v-if="item.vod_year" class="mr-3 border-r border-color-border pr-3">{{ item.vod_year }}</span>
          <span>{{ t('videoInfo.time') }}{{ t('colonSymbol') }}{{ item.vod_time }}</span>
        </div>
        <a-typography-paragraph
          class="indent-8"
          :ellipsis="{ rows: 3 }"
          :content="item.vod_content"
        ></a-typography-paragraph>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { VideoDetailResponse } from '@/api/detail'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import { getColorByKey } from '@/utils/color'
import { useI18n } from 'vue-i18n'

const { list } = defineProps<{
  list: VideoDetailResponse[]
}>()

const router = useKeepQueryRouter()
const { t } = useI18n()

const goToDetail = (id: number) => {
  router.push({ name: 'videoDetail', params: { id: `${id}` } })
}
</script>
