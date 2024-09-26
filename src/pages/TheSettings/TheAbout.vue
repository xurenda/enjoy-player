<template>
  <div class="box-border h-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-col flex-wrap gap-2">
      <div>
        <span>{{ t('aboutDesc.homePage') }}{{ t('colonSymbol') }}</span>
        <a target="_blank" href="https://github.com/xurenda/enjoy-player"> https://github.com/xurenda/enjoy-player </a>
      </div>
      <div>
        <span>{{ t('aboutDesc.issues') }}{{ t('colonSymbol') }}</span>
        <a target="_blank" href="https://github.com/xurenda/enjoy-player/issues">
          https://github.com/xurenda/enjoy-player/issues
        </a>
      </div>
      <div>
        <span>{{ t('aboutDesc.currentVersion') }}{{ t('colonSymbol') }}</span>
        <a-tag class="inline-flex items-center px-3 py-1">
          <i class="iconfont icon-system mr-2"></i>
          <span class="text-sm">v{{ appStore.curVersion }}</span>
        </a-tag>
      </div>
      <div>
        <span>{{ t('aboutDesc.latestVersion') }}{{ t('colonSymbol') }}</span>
        <a-tag v-if="appStore.latestVersionLoading" class="inline-flex items-center px-3 py-1">
          <i class="iconfont icon-loading mr-2 animate-spin"></i>
          <span class="text-sm">{{ t('loading') }}...</span>
        </a-tag>
        <a-tooltip v-else :title="t('aboutDesc.recheck')">
          <a-tag class="inline-flex cursor-pointer items-center px-3 py-1" @click="appStore.fetchLatestVersion">
            <i class="iconfont icon-cloud mr-2"></i>
            <span class="text-sm">{{ appStore.latestVersion || t('unknown') }}</span>
          </a-tag>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/app'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const appStore = useAppStore()
</script>
