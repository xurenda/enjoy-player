<template>
  <a-typography-title :level="5">{{ t('settings.player') }}</a-typography-title>
  <a-typography-paragraph type="secondary" :content="t('settings.playerDesc')" />
  <a-form :label-col="{ span: formColWidth[0] }" :wrapper-col="{ span: formColWidth[1] }">
    <a-form-item :label="t('settings.seekTime')" :tooltip="t('settings.seekTimeTooltip')">
      <a-input-number
        v-model:value="playerSettingsStore.seekTime"
        :min="maxSeekTimeRange[0]"
        :max="maxSeekTimeRange[1]"
      />
    </a-form-item>
    <a-form-item :label="t('settings.playMode')">
      <a-segmented v-model:value="playerSettingsStore.playMode" :options="playModes.map(i => ({ value: i }))">
        <template #label="{ value }">
          <span>{{ t(`settings.${value}`) }}</span>
        </template>
      </a-segmented>
    </a-form-item>
    <a-form-item :label="t('settings.showTooltip')" :tooltip="t('settings.showTooltipTooltip')">
      <a-switch v-model:checked="playerSettingsStore.showTooltip" />
    </a-form-item>
    <a-form-item :label="t('settings.invertTime')" :tooltip="t('settings.invertTimeTooltip')">
      <a-switch v-model:checked="playerSettingsStore.invertTime" />
    </a-form-item>
    <a-form-item :label="t('settings.ratio')">
      <CanAddedSelect
        v-model:value="playerSettingsStore.ratio"
        :options="playerSettingsStore.ratios.map(i => ({ value: i }))"
        :newValueRules="newRatioRules"
        @add="addNewRatio"
      />
    </a-form-item>
    <a-form-item :label="t('settings.speed')">
      <CanAddedSelect
        v-model:value="playerSettingsStore.speed"
        :options="playerSettingsStore.speeds.map(i => ({ value: i }))"
        mode="tags"
        :newValueRules="newSpeedRules"
        @add="addNewSpeed"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import usePlayerSettingsStore, { maxSeekTimeRange, playModes } from '@/stores/settings/player'
import CanAddedSelect from '@/components/CanAddedSelect.vue'

const { formColWidth } = defineProps<{ formColWidth: [number, number] }>()

const { t } = useI18n()
const playerSettingsStore = usePlayerSettingsStore()

const checkRatioNum = (num: number) => {
  return !Number.isNaN(num) && Number.isInteger(num) && num > 0
}

const newRatioRules = [
  {
    async validator(_: unknown, value: string) {
      value = value.trim()
      if (!value) {
        throw new Error('Required')
      }
      const [w, h] = value.split(':').map(i => +i.trim())
      if (!checkRatioNum(w) || !checkRatioNum(h)) {
        throw new Error('Invalid ratio')
      }
      const ratio = {
        text: `${w}:${h}`,
        value: w / h,
      }
      const ratios = playerSettingsStore.ratiosWithValue
      if (ratios.some(i => i.value === ratio.value)) {
        throw new Error('Duplicate ratio')
      }
    },
  },
]

const newSpeedRules = [
  {
    async validator(_: unknown, value: string) {
      value = value.trim()
      if (!value) {
        throw new Error('Required')
      }
      const num = +value
      if (Number.isNaN(num) || num < 0.1 || num > 16) {
        throw new Error('Invalid speed')
      }
    },
  },
]

const addNewRatio = (newRatio: string) => {
  const ratios = playerSettingsStore.ratiosWithValue
  const [w, h] = newRatio.split(':').map(i => +i.trim())
  ratios.push({
    text: `${w}:${h}`,
    value: w / h,
  })
  playerSettingsStore.ratios = ratios.sort((a, b) => b.value - a.value).map(i => i.text)
}

const addNewSpeed = (newSpeed: string) => {
  const speeds = playerSettingsStore.speeds
  speeds.push(+newSpeed)
  playerSettingsStore.speeds = speeds.sort((a, b) => a - b)
}
</script>
