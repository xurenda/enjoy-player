<template>
  <a-typography-title :level="5">{{ t('settings.ui') }}</a-typography-title>
  <a-form :label-col="{ span: formColWidth[0] }" :wrapper-col="{ span: formColWidth[1] }">
    <a-form-item :label="t('settings.theme')">
      <a-segmented v-model:value="uiSettingsStore.theme" :options="themes.map(i => ({ value: i }))">
        <template #label="{ value }">
          <i :class="`iconfont icon-${value}`"></i>
          <span class="ml-1">{{ t(`settings.${value}`) }}</span>
        </template>
      </a-segmented>
    </a-form-item>
    <a-form-item :label="t('settings.primaryColor')">
      <div class="flex items-center space-x-2">
        <MyPickColors v-model:value="uiSettingsStore.lightPrimaryColor" :title="t('settings.light')" />
        <a-tooltip :title="t('settings.primaryColorSync')">
          <a-button type="text" @click="uiSettingsStore.lockPrimaryColor = !uiSettingsStore.lockPrimaryColor">
            <template #icon>
              <i :class="`iconfont icon-${uiSettingsStore.lockPrimaryColor ? 'lock' : 'unlock'}`"></i>
            </template>
          </a-button>
        </a-tooltip>
        <MyPickColors v-model:value="uiSettingsStore.darkPrimaryColor" :title="t('settings.dark')" />
      </div>
    </a-form-item>
    <a-form-item :label="t('settings.navWidthRange')">
      <a-slider
        v-model:value="navWidthRange"
        range
        :min="maxWidthRange[0]"
        :max="maxWidthRange[1]"
        :marks="{ [uiSettingsStore.navWidth]: t('settings.curWidth') }"
      />
    </a-form-item>
    <a-form-item :label="t('settings.episodesPosition')">
      <a-segmented
        v-model:value="uiSettingsStore.episodesPosition"
        :options="episodesPositions.map(i => ({ value: i }))"
      >
        <template #label="{ value }">
          <!-- <i :class="`iconfont icon-${value}`"></i> -->
          <span class="ml-1">{{ t(`settings.${value}`) }}</span>
        </template>
      </a-segmented>
    </a-form-item>
    <a-form-item v-if="uiSettingsStore.episodesPosition === 'right'" :label="t('settings.episodesWidthRange')">
      <a-slider
        v-model:value="episodesWidthRange"
        range
        :min="maxWidthRange[0]"
        :max="maxWidthRange[1]"
        :marks="{ [uiSettingsStore.episodesWidth]: t('settings.curWidth') }"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MyPickColors from '@/components/MyPickColors.vue'
import useUISettingsStore, { themes, maxWidthRange, episodesPositions } from '@/stores/settings/ui'
import { ref } from 'vue'
import useWatchDebouncedValue from '@/hooks/useWatchDebouncedValue'

const { formColWidth } = defineProps<{ formColWidth: [number, number] }>()

const { t } = useI18n()
const uiSettingsStore = useUISettingsStore()
const navWidthRange = ref(uiSettingsStore.navWidthRange)
useWatchDebouncedValue(navWidthRange, val => {
  uiSettingsStore.navWidthRange = val
})
const episodesWidthRange = ref(uiSettingsStore.episodesWidthRange)
useWatchDebouncedValue(episodesWidthRange, val => {
  uiSettingsStore.episodesWidthRange = val
})
</script>
