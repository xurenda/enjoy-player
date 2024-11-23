<template>
  <div class="box-border h-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-wrap">
      <div v-for="item in shortcuts" :key="item.key.join(' + ')" class="mb-4 flex w-full items-center">
        <div class="mr-2 w-36">
          <a-typography-text v-for="key in item.key" :key="key" :keyboard="!notKey.includes(key)">{{
            key
          }}</a-typography-text>
        </div>
        <div>{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isMac } from '@/utils/navigator'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const command = isMac ? '⌘' : 'Ctrl'
const notKey = ['~', '+']
const shortcuts = computed(() => [
  { key: [command, 'R'], desc: t('shortcutsDesc.reload') },
  { key: [command, 'B'], desc: t('shortcutsDesc.toggleNav') },
  { key: [command, 'K'], desc: t('shortcutsDesc.focusSearch') },
  { key: [command, 'I'], desc: t('shortcutsDesc.toggleSettings') },
  { key: [command, 'K', '+', 'Enter'], desc: t('shortcutsDesc.returnToList') },
  { key: ['0', '~', '9'], desc: t('shortcutsDesc.seekTo') },
  { key: ['Space'], desc: t('shortcutsDesc.togglePlayback') },
  { key: ['K'], desc: t('shortcutsDesc.togglePlayback') },
  { key: ['←'], desc: t('shortcutsDesc.seekBackward') },
  { key: ['→'], desc: t('shortcutsDesc.seekForward') },
  { key: ['↑'], desc: t('shortcutsDesc.increaseVolume') },
  { key: ['↓'], desc: t('shortcutsDesc.decreaseVolume') },
  { key: ['M'], desc: t('shortcutsDesc.toggleMute') },
  { key: ['F'], desc: t('shortcutsDesc.toggleFullScreen') },
  { key: ['C'], desc: t('shortcutsDesc.toggleCaptions') },
])
</script>
