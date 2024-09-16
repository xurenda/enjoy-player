<template>
  <template v-if="!loading && !error && !isEmpty">
    <slot />
  </template>
  <div v-else class="box-border flex h-full w-full flex-1 items-center justify-center">
    <a-result v-if="error" status="error">
      <template #subTitle>
        <div class="text-gray-500">{{ t('dataLoadFail') }}</div>
      </template>
    </a-result>
    <div v-else-if="loading" class="h-full w-full overflow-hidden">
      <a-skeleton active :paragraph="{ rows: 10 }" />
    </div>
    <a-empty v-else :description="t('noData')" />
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const {
  loading,
  error,
  data,
  checkIsEmpty = data => !data,
} = defineProps<{
  loading: boolean
  error: Error | string | boolean | null
  data: T
  checkIsEmpty?: (data: T) => boolean
}>()

const { t } = useI18n()
const isEmpty = computed(() => checkIsEmpty(data))

defineSlots<{
  default: () => {}
}>()
</script>
