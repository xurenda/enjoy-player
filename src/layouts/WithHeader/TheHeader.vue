<template>
  <div class="flex items-center justify-between border-b border-color-border bg-color-bg-gray px-6 py-3">
    <div class="flex items-center space-x-4">
      <a-tooltip :title="t('toggleSideNav')">
        <a-button @click="uiSettingsStore.navShow = !uiSettingsStore.navShow">
          <template #icon>
            <i class="iconfont icon-menu"></i>
          </template>
        </a-button>
      </a-tooltip>

      <div class="relative">
        <a-input
          ref="searchInputRef"
          class="w-96"
          v-model:value="keyword"
          @keyup.enter="videoListStore.changeKeyword(keyword)"
        >
          <template #prefix><i class="iconfont icon-search"></i></template>
        </a-input>
        <div v-show="!keyword" class="absolute left-8 z-50 opacity-80" :style="{ top: '6px' }">
          <a-typography-text keyboard>{{ isMac ? '⌘' : 'Ctrl' }}</a-typography-text>
          <a-typography-text keyboard>K</a-typography-text>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <a-switch v-model:checked="isLight" class="checked-no-active">
        <template #checkedChildren>
          <i class="iconfont icon-light block"></i>
        </template>
        <template #unCheckedChildren>
          <i class="iconfont icon-dark block"></i>
        </template>
      </a-switch>
      <a-tooltip :title="t('settings.title')">
        <a-button id="tour-settings-btn" @click="uiSettingsStore.settingsShow = true">
          <template #icon>
            <i class="iconfont icon-settings"></i>
          </template>
        </a-button>
      </a-tooltip>
    </div>
  </div>

  <a-modal
    v-model:open="uiSettingsStore.settingsShow"
    centered
    :closable="false"
    :title="null"
    :footer="null"
    :style="{ width: '80vw', maxWidth: '1024px', minWidth: '420px' }"
    :bodyStyle="{ height: '80vh', minHeight: '420px' }"
  >
    <TheSettings @close="uiSettingsStore.settingsShow = false" />
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import TheSettings from '@/pages/TheSettings/index.vue'
import useUISettingsStore from '@/stores/settings/ui'
import useVideoListStore from '@/stores/videoList'
import { isMac } from '@/utils/navigator'

const { t } = useI18n()
const uiSettingsStore = useUISettingsStore()
const videoListStore = useVideoListStore()

const keyword = ref(videoListStore.curKeyword)
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const isLight = computed({
  get() {
    return uiSettingsStore.realTheme === 'light'
  },
  set(checked) {
    uiSettingsStore.theme = checked ? 'light' : 'dark'
  },
})

watchEffect(() => {
  window.searchInputRef = searchInputRef.value
})
</script>
