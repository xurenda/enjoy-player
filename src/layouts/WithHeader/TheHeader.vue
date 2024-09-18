<template>
  <div class="flex items-center justify-between bg-slate-100 px-6 py-3">
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

    <a-tooltip :title="t('settings')">
      <a-button @click="router.push({ name: 'settings' })">
        <template #icon>
          <i class="iconfont icon-settings"></i>
        </template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import useSingleQueryParam from '@/hooks/useSingleQueryParam'
import useSettingsStore from '@/stores/settings'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const { toggleNav } = useSettingsStore()

const wordQuery = useSingleQueryParam('word', '', value => value.trim())
const keyword = ref(wordQuery.value)
</script>
