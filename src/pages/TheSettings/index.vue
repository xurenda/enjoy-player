<template>
  <ATabs v-model:activeKey="tab">
    <template #leftExtra>
      <div class="mr-2">
        <a-button type="text" @click="router.back()">
          <template #icon>
            <i class="iconfont icon-return"></i>
          </template>
        </a-button>
      </div>
    </template>
    <a-tab-pane v-for="item in tabs" :key="item.key">
      <template #tab>
        <i class="iconfont" :class="`icon-${item.text}`"></i>
        <span class="ml-1">{{ t(item.text) }}</span>
      </template>
      <component :is="item.component" />
    </a-tab-pane>
  </ATabs>
</template>

<script setup lang="ts">
import useSingleQueryParam from '@/hooks/useSingleQueryParam'
import { useI18n } from 'vue-i18n'
import AppSettings from './AppSettings.vue'
import VideoSources from './VideoSources.vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'TheSettings' })

const { t } = useI18n()
const tabs = [
  {
    key: 'application',
    text: 'application',
    component: AppSettings,
  },
  {
    key: 'video-sources',
    text: 'videoSources',
    component: VideoSources,
  },
]
const tab = useSingleQueryParam('tab', tabs[0].key)
const router = useRouter()
</script>
