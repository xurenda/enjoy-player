<template>
  <input ref="fileRef" class="hidden" type="file" :accept="accept" :multiple="multiple" @change="fileInputChange" />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'

const { accept = '.json', multiple = true } = defineProps<{
  accept?: string
  multiple?: boolean
}>()
const emit = defineEmits<{
  (e: 'change', files: FileList): void
}>()

const fileRef = useTemplateRef<HTMLInputElement>('fileRef')

const openFileSelector = () => {
  if (!fileRef.value) {
    return
  }
  fileRef.value.value = ''
  fileRef.value.click()
}

const fileInputChange = (e: Event) => {
  const files = (e.target as HTMLInputElement)?.files
  if (!files?.length) {
    return
  }
  emit('change', files)
}

defineExpose({ openFileSelector })
</script>
