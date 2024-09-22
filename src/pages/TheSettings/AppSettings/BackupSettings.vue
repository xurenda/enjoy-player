<template>
  <a-typography-title :level="5">{{ t('settings.backup') }}</a-typography-title>
  <a-typography-paragraph type="secondary" :content="t('settings.backupDesc1')" />
  <a-typography-paragraph type="secondary" :content="t('settings.backupDesc2')" />
  <a-typography-paragraph type="secondary" :content="t('settings.backupDesc3')" />
  <div class="flex space-x-2">
    <a-button @click="onImport">{{ t('import') }}</a-button>
    <a-button @click="onExport">{{ t('export') }}</a-button>
    <a-button danger @click="onReset">{{ t('settings.resetSettings') }}</a-button>
  </div>
  <FileSelector ref="fileSelectorRef" @change="fileSelectorChange" />
  <BackupModal ref="backupModalRef" :title="modalTitle" :enable="modalEnable" @ok="onOk" />
  <contextHolder />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FileSelector from '@/components/FileSelector.vue'
import BackupModal, { type BackupModalProps } from '@/components/BackupModal.vue'
import { ref, useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import { exportSettings } from '@/handles/export'
import { getBackupData, importSettings, resetSettings, type BackupData, type BackupEnable } from '@/handles/import'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const modalTitle = ref<BackupModalProps['title']>('import')
const modalEnable = ref<BackupModalProps['enable']>({
  basicSettings: true,
  uiSettings: true,
  playerSettings: true,
  videoSources: true,
})
const fileSelectorRef = useTemplateRef<ComponentExposed<typeof FileSelector>>('fileSelectorRef')
const backupModalRef = useTemplateRef<ComponentExposed<typeof BackupModal>>('backupModalRef')
const [messageApi, contextHolder] = message.useMessage()

const onImport = () => {
  fileSelectorRef.value!.openFileSelector()
}

const onExport = () => {
  modalTitle.value = 'export'
  modalEnable.value = {
    basicSettings: true,
    uiSettings: true,
    playerSettings: true,
    videoSources: true,
  }
  backupModalRef.value!.openModal()
}

const onReset = () => {
  modalTitle.value = 'reset'
  modalEnable.value = {
    basicSettings: true,
    uiSettings: true,
    playerSettings: true,
    videoSources: true,
  }
  backupModalRef.value!.openModal()
}

let backupData: BackupData | null = null
const fileSelectorChange = async (files: FileList) => {
  modalTitle.value = 'import'
  backupData = await getBackupData(files)
  modalEnable.value = {
    basicSettings: !!backupData.basicSettings,
    uiSettings: !!backupData.uiSettings,
    playerSettings: !!backupData.playerSettings,
    videoSources: !!backupData.videoSources,
  }
  backupModalRef.value?.openModal()
}

const onOk = (enable: BackupEnable) => {
  switch (modalTitle.value) {
    case 'import': {
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
      break
    }
    case 'export':
      exportSettings(enable)
      break
    case 'reset': {
      const success = resetSettings(enable)
      if (success > 0) {
        setTimeout(() => {
          messageApi.success({
            content: `${t('settings.resetSettings')}${t('wordSplitSymbol')}${t('success')}`,
          })
        }, 1000)
      }
    }
  }
}
</script>
