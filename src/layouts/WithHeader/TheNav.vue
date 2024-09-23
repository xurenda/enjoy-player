<template>
  <div class="p-2">
    <a-cascader v-model:value="appStore.curVideoSourceIdPath" :options="options" expand-trigger="hover">
      <a-tooltip :title="t('switchVideoSources')" placement="right">
        <div
          class="group box-border flex w-full cursor-pointer items-center justify-between rounded-lg bg-color-primary/10 p-3"
          :class="appStore.curVideoSources?.name ? 'text-color-primary' : 'text-color-disable'"
        >
          <div>{{ appStore.curVideoSources?.name || t('noVideoSources') }}</div>
          <div class="flex items-center">
            <a-badge
              :count="videoSourcesStore.sourceCount"
              :number-style="{ backgroundColor: 'var(--color-primary)' }"
            />
            <i class="iconfont icon-switcher group-hover:animate-bounce-custom ml-2 block text-xs font-bold"></i>
          </div>
        </div>
      </a-tooltip>
    </a-cascader>
  </div>
  <TheCategory />
</template>

<script setup lang="ts">
import type { CascaderProps } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import useAppStore from '@/stores/app'
import { computed } from 'vue'
import useVideoSourcesStore, { type RVSNode } from '@/stores/videoSources'
import TheCategory from './TheCategory.vue'

const appStore = useAppStore()
const videoSourcesStore = useVideoSourcesStore()
const { t } = useI18n()

const options = computed<CascaderProps['options']>(() => {
  const trans = (arr?: RVSNode[]): CascaderProps['options'] => {
    if (!arr) return undefined
    return arr.map(item => {
      return {
        value: item.id,
        label: item.name,
        children: trans(item.children),
      }
    })
  }
  return trans(videoSourcesStore.tree[0].children)
})
</script>

<style>
@keyframes bounce-custom {
  0%,
  100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(25%);

    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.group:hover .group-hover\:animate-bounce-custom {
  animation: bounce-custom 0.8s infinite;
}
</style>
