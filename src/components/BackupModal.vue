<template>
  <a-modal :title="t(title)" v-model:open="open" width="250px" @ok="handleOk">
    <div class="flex flex-col gap-2">
      <a-checkbox v-if="enable.basicSettings" v-model:checked="checked.basicSettings">
        {{ t('settings.basic') }}{{ t('wordSplitSymbol') }}{{ t('settings.title') }}
      </a-checkbox>
      <a-checkbox v-if="enable.uiSettings" v-model:checked="checked.uiSettings">
        {{ t('settings.ui') }}{{ t('wordSplitSymbol') }}{{ t('settings.title') }}
      </a-checkbox>
      <a-checkbox v-if="enable.playerSettings" v-model:checked="checked.playerSettings">
        {{ t('settings.player') }}{{ t('wordSplitSymbol') }}{{ t('settings.title') }}
      </a-checkbox>
      <a-checkbox v-if="enable.videoSources" v-model:checked="checked.videoSources">
        {{ t('videoSources') }}
      </a-checkbox>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import type { BackupEnable, BackupTypes } from '@/handles/import'
import { nextTick, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface BackupModalProps {
  title: 'import' | 'export' | 'reset'
  enable?: BackupEnable
}

const { title, enable = { basicSettings: true, uiSettings: true, playerSettings: true, videoSources: true } } =
  defineProps<BackupModalProps>()

const emit = defineEmits<{
  (e: 'ok', enable: BackupEnable): void
}>()

const { t } = useI18n()
const open = ref(false)
const checked = reactive<BackupEnable>({
  basicSettings: true,
  uiSettings: true,
  playerSettings: true,
  videoSources: true,
})

const handleOk = () => {
  const data: BackupEnable = {
    basicSettings: false,
    uiSettings: false,
    playerSettings: false,
    videoSources: false,
  }
  Object.entries(enable).forEach(([key, value]) => {
    if (value) {
      data[key as BackupTypes] = checked[key as BackupTypes]
    }
  })
  emit('ok', data)
  open.value = false
}

const openModal = () => {
  nextTick(() => {
    if (Object.values(enable).filter(item => item).length > 1) {
      open.value = true
    } else {
      emit('ok', enable)
    }
  })
}

defineExpose({ openModal })
</script>
