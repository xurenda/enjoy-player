<template>
  <div class="p-2">
    <a-cascader v-model:value="appStore.curVideoSourceIdPath" :options="options" expand-trigger="hover">
      <a-alert
        class="w-full cursor-pointer"
        :class="{ 'text-app-disable': !appStore.curVideoSources?.name }"
        :message="appStore.curVideoSources?.name || t('noVideoSources')"
        :type="appStore.curVideoSources?.name ? 'info' : 'error'"
      >
        <template #action>
          <i class="iconfont icon-switcher text-xs font-bold"></i>
        </template>
      </a-alert>
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
