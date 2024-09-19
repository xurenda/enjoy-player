<template>
  <a-typography-title :level="5">{{ t('settings.ui') }}</a-typography-title>
  <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <a-form-item :label="t('settings.theme')">
      <a-select v-model:value="uiSettingsStore.theme">
        <a-select-option v-for="item in themes" :key="item" :value="item">
          {{ t(`settings.${item}`) }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :label="t('settings.primaryColor')">
      <div class="flex items-center space-x-2">
        <MyPickColors v-model:value="uiSettingsStore.lightPrimaryColor" :title="t('settings.light')" />
        <a-tooltip :title="t('settings.primaryColorSync')">
          <a-button type="text" @click="linkColor = !linkColor">
            <template #icon>
              <i :class="`iconfont icon-${linkColor ? 'lock' : 'unlock'}`"></i>
            </template>
          </a-button>
        </a-tooltip>
        <MyPickColors v-model:value="uiSettingsStore.darkPrimaryColor" :title="t('settings.dark')" />
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MyPickColors from '@/components/MyPickColors.vue'
import useUISettingsStore, { themes } from '@/stores/settings/ui'
import { ref } from 'vue'

const { t } = useI18n()

const uiSettingsStore = useUISettingsStore()

const linkColor = ref(true)
</script>
