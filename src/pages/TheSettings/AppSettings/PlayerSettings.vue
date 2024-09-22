<template>
  <a-typography-title :level="5">{{ t('settings.player') }}</a-typography-title>
  <a-typography-paragraph type="secondary" :content="t('settings.playerDesc')" />
  <a-form :label-col="{ span: formColWidth[0] }" :wrapper-col="{ span: formColWidth[1] }">
    <a-form-item :label="t('settings.seekStep')" :tooltip="t('settings.seekStepTooltip')">
      <a-input-number v-model:value="playerSettingsStore.seekStep" :min="seekStepRange[0]" :max="seekStepRange[1]" />
    </a-form-item>
    <a-form-item :label="t('settings.volumeStep')" :tooltip="t('settings.volumeStepTooltip')">
      <a-input-number
        v-model:value="playerSettingsStore.volumeStep"
        :min="volumeStepRange[0]"
        :max="volumeStepRange[1]"
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
        :cannot-del="cannotDelRatio"
        @add="addNewRatio"
        @del="delRatio"
      />
    </a-form-item>
    <a-form-item :label="t('settings.speed')">
      <CanAddedSelect
        :value="playerSettingsStore.speed"
        :options="playerSettingsStore.speeds.map(i => ({ value: i }))"
        mode="tags"
        :cannot-del="cannotDelSpeed"
        @add="addNewSpeed"
        @change="changeSpeed"
        @del="delSpeed"
      />
    </a-form-item>
  </a-form>
  <contextHolder />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import usePlayerSettingsStore, {
  seekStepRange,
  volumeStepRange,
  playModes,
  defaultRatios,
  defaultSpeeds,
} from '@/stores/settings/player'
import CanAddedSelect from '@/components/CanAddedSelect.vue'
import { message } from 'ant-design-vue'

const { formColWidth } = defineProps<{ formColWidth: [number, number] }>()

const { t } = useI18n()
const playerSettingsStore = usePlayerSettingsStore()
const [messageApi, contextHolder] = message.useMessage()

const cannotDelRatio = new Set(defaultRatios)
const cannotDelSpeed = new Set(defaultSpeeds)

const checkRatioNum = (num: number) => {
  return !Number.isNaN(num) && Number.isInteger(num) && num > 0
}

const ratioValidator = async (value: string) => {
  value = value.trim()
  if (!value) {
    throw new Error(t('validate.requiredField'))
  }
  const [w, h] = value.split(':').map(i => +i.trim())
  if (!checkRatioNum(w) || !checkRatioNum(h)) {
    throw new Error(`${t('validate.invalid')}${t('width')}:${t('height')}`)
  }
  const ratio = {
    text: `${w}:${h}`,
    value: w / h,
  }
  const ratios = playerSettingsStore.ratiosWithValue
  const sameRatio = ratios.find(i => i.value === ratio.value)
  if (sameRatio) {
    throw new Error(t('validate.duplicate', { value: sameRatio.text }))
  }
}

const speedValidator = async (value: string) => {
  value = value.trim()
  if (!value) {
    throw new Error(t('validate.requiredField'))
  }
  const num = +value
  if (Number.isNaN(num) || num < 0.1 || num > 16) {
    throw new Error(`${t('validate.invalid')}0.1~16`)
  }
  const speeds = playerSettingsStore.speeds
  const sameSpeed = speeds.find(i => i === num)
  if (sameSpeed) {
    throw new Error(t('validate.duplicate', { value: sameSpeed }))
  }
}

const addNewRatio = (newRatio: string) => {
  ratioValidator(newRatio)
    .then(() => {
      const ratios = playerSettingsStore.ratiosWithValue
      const [w, h] = newRatio.split(':').map(i => +i.trim())
      const n = {
        text: `${w}:${h}`,
        value: w / h,
      }
      ratios.push(n)
      playerSettingsStore.ratios = ratios.sort((a, b) => b.value - a.value).map(i => i.text)
      playerSettingsStore.ratio = n.text
    })
    .catch(err => {
      messageApi.error(err.message)
    })
}

const addNewSpeed = (newSpeed: string) => {
  speedValidator(newSpeed)
    .then(() => {
      const speeds = playerSettingsStore.speeds
      const speed = playerSettingsStore.speed
      speeds.push(+newSpeed)
      speed.push(+newSpeed)
      playerSettingsStore.speeds = speeds.sort((a, b) => a - b)
      playerSettingsStore.speed = speed.sort((a, b) => a - b)
    })
    .catch(err => {
      messageApi.error(err.message)
    })
}

const delRatio = (ratio: string) => {
  playerSettingsStore.ratios = playerSettingsStore.ratios.filter(i => i !== ratio)
  if (playerSettingsStore.ratio === ratio) {
    playerSettingsStore.ratio = playerSettingsStore.ratios[0]
  }
}

const delSpeed = (speed: number) => {
  playerSettingsStore.speeds = playerSettingsStore.speeds.filter(i => i !== speed)
  playerSettingsStore.speed = playerSettingsStore.speed.filter(i => i !== speed)
}

const changeSpeed = (newSpeed: number[]) => {
  playerSettingsStore.speed = newSpeed.sort((a, b) => a - b)
}
</script>
