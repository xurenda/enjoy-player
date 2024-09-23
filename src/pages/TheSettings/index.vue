<template>
  <ATabs v-model:activeKey="tab">
    <template #rightExtra>
      <div class="ml-2">
        <a-tooltip :title="t('done')">
          <a-button type="text" @click="emit('close')">
            <template #icon>
              <i class="iconfont icon-done"></i>
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </template>
    <a-tab-pane v-for="item in tabs" :key="item.key">
      <template #tab>
        <div :id="item.id">
          <i class="iconfont" :class="`icon-${item.key}`"></i>
          <span class="ml-1">{{ t(item.text) }}</span>
        </div>
      </template>
      <component :is="item.component" />
    </a-tab-pane>
  </ATabs>
</template>

<script setup lang="ts">
import useSingleQueryParam from '@/hooks/useSingleQueryParam'
import { useI18n } from 'vue-i18n'
import AppSettings from './AppSettings/index.vue'
import VideoSources from './VideoSources/index.vue'
import TheShortcuts from './TheShortcuts.vue'
import TheAbout from './TheAbout.vue'

defineOptions({ name: 'TheSettings' })

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const tabs = [
  {
    key: 'application',
    text: 'application',
    component: AppSettings,
  },
  {
    id: 'tour-videoSources-tab',
    key: 'video-sources',
    text: 'videoSources',
    component: VideoSources,
  },
  {
    key: 'shortcuts',
    text: 'shortcuts',
    component: TheShortcuts,
  },
  {
    key: 'about',
    text: 'about',
    component: TheAbout,
  },
]
const tab = useSingleQueryParam('tab', tabs[0].key)
</script>
