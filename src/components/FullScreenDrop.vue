<template>
  <!-- v-if="showDrag" -->
  <div
    v-if="showDrag"
    class="fixed bottom-0 left-0 right-0 top-0 z-[9999]"
    @dragleave="showDrag = false"
    @drop="dropFile"
    @dragover="e => e.preventDefault()"
  >
    <div
      class="pointer-events-none box-border flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-color-primary bg-white/80 dark:bg-black/80"
    >
      <div class="mb-2 text-2xl font-bold tracking-widest">{{ t('drop.title') }}</div>
      <div class="mb-8 text-color-gray">{{ t('drop.desc') }}</div>
      <i class="iconfont icon-json-file text-[50px]"></i>
    </div>
  </div>
  <BackupModal ref="backupModalRef" title="import" :enable="modalEnable" @ok="onOk" />
  <contextHolder />
</template>

<script setup lang="ts">
import { getBackupData, importSettings, type BackupData, type BackupEnable } from '@/handles/import'
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import BackupModal from './BackupModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const [messageApi, contextHolder] = message.useMessage()
const backupModalRef = useTemplateRef<ComponentExposed<typeof BackupModal>>('backupModalRef')
const showDrag = ref(false)
const modalEnable = ref<BackupEnable>({
  basicSettings: true,
  uiSettings: true,
  playerSettings: true,
  videoSources: true,
})

let backupData: BackupData | null = null
const hasFiles = async (files?: FileList, text?: string) => {
  backupData = await getBackupData(files, text)
  modalEnable.value = {
    basicSettings: !!backupData.basicSettings,
    uiSettings: !!backupData.uiSettings,
    playerSettings: !!backupData.playerSettings,
    videoSources: !!backupData.videoSources,
  }
  backupModalRef.value?.openModal()
}

const dropFile = async (e: DragEvent) => {
  e.preventDefault()
  showDrag.value = false
  hasFiles(e.dataTransfer?.files)
}

const onDragEnter = () => {
  if (isInternalDrag) {
    return
  }
  showDrag.value = true
}

const onPaste = async (e: ClipboardEvent) => {
  let text: string | undefined
  if (!e.clipboardData?.files.length) {
    try {
      text = await navigator.clipboard.readText()
    } catch {
      // ignore
    }
  }
  hasFiles(e.clipboardData?.files, text)
}

const onOk = (enable: BackupEnable) => {
  let success = 0
  if (backupData) {
    success = importSettings(enable, backupData)
  }
  if (success > 0) {
    setTimeout(() => {
      messageApi.success({
        content: `${t('import')}${t('wordSplitSymbol')}${t('success')}`,
      })
    }, 1000)
  }
}

let isInternalDrag = false // 内部拖拽标志
const onDragStart = () => {
  isInternalDrag = true
}
const onDragEnd = () => {
  isInternalDrag = false
}

onMounted(() => {
  document.addEventListener('dragstart', onDragStart)
  document.addEventListener('dragenter', onDragEnter)
  document.addEventListener('dragend', onDragEnd)
  document.addEventListener('paste', onPaste)
})
onBeforeUnmount(() => {
  document.removeEventListener('dragstart', onDragStart)
  document.removeEventListener('dragenter', onDragEnter)
  document.removeEventListener('dragend', onDragEnd)
  document.removeEventListener('paste', onPaste)
})
</script>
