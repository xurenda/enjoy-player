import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const seekStepRange: [number, number] = [1, 600]
export const volumeStepRange: [number, number] = [1, 100]
export const playModes = ['pause', 'loop', 'next'] as const
export type PlayModes = (typeof playModes)[number]

const defaultRatios = ['16:9', '4:3', '1:1', '9:16']
const defaultSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]

const getRatioWithValue = (i: string) => {
  const [w, h] = i.split(':')
  return {
    text: i,
    value: Number(w) / Number(h),
  }
}

const usePlayerSettingsStore = defineStore(
  'playerSettings',
  () => {
    const seekStep = ref(10)
    const volumeStep = ref(10)
    const playMode = ref<PlayModes>('next')
    const showTooltip = ref(true)
    const invertTime = ref(true)
    const ratio = ref(defaultRatios[0])
    const ratios = ref(defaultRatios)
    const ratiosWithValue = computed(() => ratios.value.map(getRatioWithValue))
    const speed = ref(defaultSpeeds)
    const speeds = ref(defaultSpeeds)

    const importSettings = (data: Record<string, any>) => {
      if (typeof data.seekStep === 'number' && seekStepRange[0] <= data.seekStep && data.seekStep <= seekStepRange[1]) {
        seekStep.value = data.seekStep
      }
      if (
        typeof data.volumeStep === 'number' &&
        volumeStepRange[0] <= data.volumeStep &&
        data.volumeStep <= volumeStepRange[1]
      ) {
        volumeStep.value = data.volumeStep
      }
      if (playModes.includes(data.playMode)) {
        playMode.value = data.playMode
      }
      if (typeof data.showTooltip === 'boolean') {
        showTooltip.value = data.showTooltip
      }
      if (typeof data.invertTime === 'boolean') {
        invertTime.value = data.invertTime
      }
      const ratiosReg = /^[1-9]\d*:[1-9]\d*$/
      if (Array.isArray(data.ratios)) {
        const valueSet = new Set<number>()
        const r = defaultRatios.map(getRatioWithValue)
        r.forEach(i => {
          valueSet.add(i.value)
        })
        data.ratios
          .filter(i => ratiosReg.test(i))
          .map(getRatioWithValue)
          .forEach(i => {
            if (!valueSet.has(i.value)) {
              valueSet.add(i.value)
              r.push(i)
            }
          })
        ratios.value = r.sort((a, b) => b.value - a.value).map(i => i.text)
      }
      if (typeof data.ratio === 'string' && ratios.value.includes(data.ratio)) {
        ratio.value = data.ratio
      }
      if (Array.isArray(data.speeds)) {
        const s = [...defaultSpeeds]
        const valueSet = new Set<number>(s)
        data.speeds.forEach(i => {
          if (!valueSet.has(i)) {
            valueSet.add(i)
            s.push(i)
          }
        })
        speeds.value = s.sort((a, b) => a - b)
      }
      if (Array.isArray(data.speed)) {
        const s = [...defaultSpeeds]
        const valueSet = new Set<number>(s)
        data.speed.forEach(i => {
          if (!valueSet.has(i)) {
            valueSet.add(i)
            if (speeds.value.includes(i)) {
              s.push(i)
            }
          }
        })
        speed.value = s.sort((a, b) => a - b)
      }
    }

    const resetSettings = () => {
      seekStep.value = 10
      volumeStep.value = 10
      playMode.value = 'next'
      showTooltip.value = true
      invertTime.value = true
      ratios.value = defaultRatios
      ratio.value = defaultRatios[0]
      speeds.value = defaultSpeeds
      speed.value = defaultSpeeds
    }

    return {
      seekStep,
      volumeStep,
      playMode,
      showTooltip,
      invertTime,
      ratio,
      ratios,
      ratiosWithValue,
      speed,
      speeds,
      importSettings,
      resetSettings,
    }
  },
  {
    persist: true,
  },
)

export default usePlayerSettingsStore
