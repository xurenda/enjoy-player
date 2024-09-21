import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const seekStepRange: [number, number] = [1, 600]
export const volumeStepRange: [number, number] = [1, 100]
export const playModes = ['pause', 'loop', 'next'] as const
export type PlayModes = (typeof playModes)[number]

const defaultRatios = ['16:9', '4:3', '1:1', '9:16']
const defaultSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]

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
    const ratiosWithValue = computed(() =>
      ratios.value.map(i => {
        const [w, h] = i.split(':')
        return {
          text: i,
          value: Number(w) / Number(h),
        }
      }),
    )
    const speed = ref(defaultSpeeds)
    const speeds = ref(defaultSpeeds)

    return { seekStep, volumeStep, playMode, showTooltip, invertTime, ratio, ratios, ratiosWithValue, speed, speeds }
  },
  {
    persist: true,
  },
)

export default usePlayerSettingsStore
