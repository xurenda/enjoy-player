import useBasicSettingsStore from '@/stores/settings/basic'
import usePlayerSettingsStore from '@/stores/settings/player'
import useUISettingsStore from '@/stores/settings/ui'
import useVideoSourcesStore, { rootNodeId } from '@/stores/videoSources'
import { readFileAsJson } from '@/utils/file'
import { isObject } from '@/utils/object'

export const backupTypes = ['basicSettings', 'uiSettings', 'playerSettings', 'videoSources'] as const

export type BackupTypes = (typeof backupTypes)[number]

export type BackupEnable = Record<BackupTypes, boolean>

export interface BackupItem {
  type: BackupTypes
  data: any
}

export interface BackupData {
  basicSettings?: Record<string, any>
  uiSettings?: Record<string, any>
  playerSettings?: Record<string, any>
  videoSources?: Record<string, any>[]
}

export function importSettings(enable: BackupEnable, backupData: BackupData) {
  let success = 0
  if (enable.basicSettings && backupData.basicSettings) {
    success++
    const basicSettingsStore = useBasicSettingsStore()
    basicSettingsStore.importSettings(backupData.basicSettings)
  }
  if (enable.uiSettings && backupData.uiSettings) {
    success++
    const uiSettingsStore = useUISettingsStore()
    uiSettingsStore.importSettings(backupData.uiSettings)
  }
  if (enable.playerSettings && backupData.playerSettings) {
    success++
    const playerSettingsStore = usePlayerSettingsStore()
    playerSettingsStore.importSettings(backupData.playerSettings)
  }
  if (enable.videoSources) {
    success += importVideoSources(backupData)
  }
  return success
}

export function resetSettings(enable: BackupEnable) {
  let success = 0
  if (enable.basicSettings) {
    success++
    const basicSettingsStore = useBasicSettingsStore()
    basicSettingsStore.resetSettings()
  }
  if (enable.uiSettings) {
    success++
    const uiSettingsStore = useUISettingsStore()
    uiSettingsStore.resetSettings()
  }
  if (enable.playerSettings) {
    success++
    const playerSettingsStore = usePlayerSettingsStore()
    playerSettingsStore.resetSettings()
  }
  if (enable.videoSources) {
    success++
    const videoSourcesStore = useVideoSourcesStore()
    videoSourcesStore.deleteNode(rootNodeId)
  }
  return success
}

export function importVideoSources(backupData: BackupData, nodeId?: string) {
  if (!nodeId) {
    nodeId = rootNodeId
  }
  const videoSourcesArr = backupData.videoSources
  let success = 0
  if (!videoSourcesArr) {
    return success
  }
  const videoSourcesStore = useVideoSourcesStore()
  for (const item of videoSourcesArr) {
    try {
      videoSourcesStore.importNode(item as any, nodeId)
      success++
    } catch (e) {
      console.log('[import VideoSources Error]', e)
    }
  }
  return success
}

export async function getBackupData(...arr: (FileList | File | string | undefined | null)[]): Promise<BackupData> {
  const proms: Promise<any>[] = []
  for (const item of arr) {
    if (typeof item === 'string') {
      proms.push(new Promise(resolve => resolve(JSON.parse(item))))
    } else if (item instanceof FileList) {
      for (const file of item) {
        proms.push(readFileAsJson(file))
      }
    } else if (item instanceof File) {
      proms.push(readFileAsJson(item))
    }
  }
  const settleds = await Promise.allSettled(proms)
  const data: BackupData = {}
  for (const settled of settleds) {
    if (settled.status !== 'fulfilled') {
      continue
    }
    const value = settled.value
    if (Array.isArray(value)) {
      for (const i of value) {
        if (checkBackupItem(i)) {
          mergeBackupItem(i, data)
        }
      }
    } else {
      if (checkBackupItem(value)) {
        mergeBackupItem(value, data)
      }
    }
  }
  return data
}

function checkBackupItem(data: any): data is BackupItem {
  if (!isObject(data)) {
    return false
  }
  if (!backupTypes.includes(data.type) || !isObject(data.data)) {
    return false
  }
  return true
}

function mergeBackupItem(item: BackupItem, data: BackupData) {
  switch (item.type) {
    case 'basicSettings':
    case 'uiSettings':
    case 'playerSettings':
      if (!data[item.type]) {
        data[item.type] = {}
      }
      Object.assign(data[item.type]!, item.data)
      break
    case 'videoSources': {
      const d = item.data
      if (typeof d.root !== 'string' || !isObject(d.record) || !isObject(d.record[d.root])) {
        return
      }
      if (!data[item.type]) {
        data[item.type] = []
      }
      data[item.type]!.push(d)
      break
    }
  }
}
