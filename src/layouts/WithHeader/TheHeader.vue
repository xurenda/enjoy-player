<template>
  <div class="border-color-border bg-color-bg-gray flex items-center justify-between border-b px-6 py-3">
    <div class="flex items-center space-x-4">
      <a-button @click="toggleNav">
        <template #icon>
          <i class="iconfont icon-menu"></i>
        </template>
      </a-button>

      <a-input class="w-96" v-model:value="keyword" @keyup.enter="wordQuery = keyword">
        <template #prefix><i class="iconfont icon-search"></i></template>
      </a-input>
    </div>

    <a-tooltip :title="t('settings.title')">
      <a-button @click="showSettings = true">
        <template #icon>
          <i class="iconfont icon-settings"></i>
        </template>
      </a-button>
    </a-tooltip>
  </div>
  <a-modal
    v-model:open="showSettings"
    centered
    :closable="false"
    :title="null"
    :footer="null"
    :style="{ width: '80vw', maxWidth: '1024px', minWidth: '420px' }"
    :bodyStyle="{ height: '80vh', minHeight: '420px' }"
  >
    <TheSettings @close="showSettings = false" />
  </a-modal>
</template>

<script setup lang="ts">
import useSingleQueryParam from '@/hooks/useSingleQueryParam'
import useSettingsStore from '@/stores/settings'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TheSettings from '@/pages/TheSettings/index.vue'

const { t } = useI18n()
const { toggleNav } = useSettingsStore()

const wordQuery = useSingleQueryParam('word', '', value => value.trim())
const keyword = ref(wordQuery.value)

const showSettings = ref(false)
</script>
