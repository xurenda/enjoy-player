import useVideoSourcesStore, { toPersistentData, type RVSNode } from '@/stores/videoSources'
import type { BackupEnable, BackupItem } from './import'
import useBasicSettingsStore from '@/stores/settings/basic'
import useUISettingsStore from '@/stores/settings/ui'
import usePlayerSettingsStore from '@/stores/settings/player'
import { createFile, downloadFile } from '@/utils/file'

export function exportSettings(enable: BackupEnable) {
  const items: BackupItem[] = []

  if (enable.basicSettings) {
    items.push(getBasicSettingsItem())
  }
  if (enable.uiSettings) {
    items.push(getUISettingsItem())
  }
  if (enable.playerSettings) {
    items.push(getPlayerSettingsItem())
  }
  if (enable.videoSources) {
    items.push(getVideoSourcesItem())
  }

  exportAndDownloadFile(items, 'settings')
}

export function exportVideoSources(node?: RVSNode) {
  exportAndDownloadFile(getVideoSourcesItem(node), (node ? `${node.name}-` : '') + 'videoSources')
}

function getBasicSettingsItem(): BackupItem {
  const basicSettingsStore = useBasicSettingsStore()
  return {
    type: 'basicSettings',
    data: {
      locale: basicSettingsStore.locale,
    },
  }
}

function getUISettingsItem(): BackupItem {
  const uiSettingsStore = useUISettingsStore()
  return {
    type: 'uiSettings',
    data: {
      theme: uiSettingsStore.theme,
      lightPrimaryColor: uiSettingsStore.lightPrimaryColor,
      darkPrimaryColor: uiSettingsStore.darkPrimaryColor,
      lockPrimaryColor: uiSettingsStore.lockPrimaryColor,
      navShow: uiSettingsStore.navShow,
      _navWidth: uiSettingsStore._navWidth,
      navWidthRange: uiSettingsStore.navWidthRange,
      listViewType: uiSettingsStore.listViewType,
      episodesPosition: uiSettingsStore.episodesPosition,
      _episodesWidth: uiSettingsStore._episodesWidth,
      episodesWidthRange: uiSettingsStore.episodesWidthRange,
    },
  }
}

function getPlayerSettingsItem(): BackupItem {
  const playerSettingsStore = usePlayerSettingsStore()

  return {
    type: 'playerSettings',
    data: {
      seekStep: playerSettingsStore.seekStep,
      volumeStep: playerSettingsStore.volumeStep,
      playMode: playerSettingsStore.playMode,
      showTooltip: playerSettingsStore.showTooltip,
      invertTime: playerSettingsStore.invertTime,
      ratio: playerSettingsStore.ratio,
      ratios: playerSettingsStore.ratios,
      speed: playerSettingsStore.speed,
      speeds: playerSettingsStore.speeds,
    },
  }
}

function getVideoSourcesItem(node?: RVSNode): BackupItem {
  if (!node) {
    node = useVideoSourcesStore().tree[0]
  }
  return {
    type: 'videoSources',
    data: toPersistentData(node),
  }
}

function exportAndDownloadFile(data: any, name: string) {
  downloadFile(createFile(data, 'application/json'), `${name}.json`)
}
