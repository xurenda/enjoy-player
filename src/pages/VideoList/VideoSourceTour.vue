<template>
  <a-button type="primary" @click="openTour(true)">{{ t('tour.beginTour') }}</a-button>
  <a-tour
    v-model:current="step"
    :open="open"
    :steps="steps"
    @change="onChange"
    @close="openTour(false)"
    @finish="openTour(false)"
  />
</template>

<script lang="ts" setup>
import { computed, createVNode, ref, watch, watchEffect, type WatchHandle } from 'vue'
import type { TourProps } from 'ant-design-vue'
import useUISettingsStore from '@/stores/settings/ui'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const uiSettingsStore = useUISettingsStore()
const router = useKeepQueryRouter()
const route = useRoute()
const { t } = useI18n()

const open = ref(false)
const step = ref(-1)

const effects: WatchHandle[] = []
watch(step, (newStep, oldStep) => {
  if (newStep === -1) {
    effects.forEach(i => i())
    effects.length = 0
  }
  if (newStep === 0) {
    router.replace({ query: { tab: undefined } })
  }
  if (newStep === 0 && oldStep === -1) {
    const handle = watchEffect(() => {
      if (uiSettingsStore.settingsShow) {
        step.value = 1
      }
    })
    effects.push(handle)
  }
  if (newStep === 1 && oldStep === 0) {
    const handle = watchEffect(() => {
      if (route.query.tab === 'video-sources') {
        step.value = 2
      }
    })
    effects.push(handle)
  }
})

const steps = computed<TourProps['steps']>(() => [
  {
    title: t('tour.title1'),
    description: t('tour.desc1'),
    target: () => document.getElementById('tour-settings-btn')!,
    arrow: false,
  },
  {
    title: t('tour.title2'),
    description: t('tour.desc2'),
    target: () => document.getElementById('tour-videoSources-tab')!,
  },
  {
    title: t('tour.title3'),
    description: createVNode('div', null, [
      t('tour.desc3'),
      createVNode(
        'a',
        {
          target: '_blank',
          href: 'https://github.com/xurenda/enjoy-player?tab=readme-ov-file#video-source',
        },
        t('tour.desc3Link'),
      ),
    ]),
  },
])

const onChange = (step: number): void => {
  switch (step) {
    case 1:
      uiSettingsStore.settingsShow = true
      break
    case 2:
      router.replace({ query: { tab: 'video-sources' } })
      break
  }
}

const openTour = (val: boolean) => {
  step.value = val ? 0 : -1
  open.value = val
}
</script>
