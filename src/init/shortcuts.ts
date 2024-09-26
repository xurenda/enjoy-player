import { playerMap } from '@/stores/hlsPlayer'
import usePlayerSettingsStore from '@/stores/settings/player'
import useUISettingsStore from '@/stores/settings/ui'
import hotkeys from 'hotkeys-js'

// 聚焦搜索框
hotkeys('command+k, ctrl+k', () => {
  if (!window.searchInputRef) return
  window.searchInputRef.focus()
  window.searchInputRef.select()
})

// 打开/关闭侧边栏
hotkeys('command+b, ctrl+b', () => {
  const uiSettingsStore = useUISettingsStore()
  uiSettingsStore.navShow = !uiSettingsStore.navShow
})

// 打开/关闭设置
hotkeys('command+i, ctrl+i', () => {
  const uiSettingsStore = useUISettingsStore()
  uiSettingsStore.settingsShow = !uiSettingsStore.settingsShow
})

export function handlePlyrShortcuts() {
  hotkeys.unbind('l')
  hotkeys.unbind('up')
  hotkeys.unbind('down')

  // 禁用 Plyr 的 Toggle loop
  hotkeys('l', e => {
    e.stopPropagation()
  })

  // 修改 Plyr 的音量调整步长
  hotkeys('up', e => {
    const { volumeStep } = usePlayerSettingsStore()
    playerMap.forEach(({ player }) => {
      player.increaseVolume(volumeStep / 100)
    })
    e.stopPropagation()
  })
  hotkeys('down', e => {
    const { volumeStep } = usePlayerSettingsStore()
    playerMap.forEach(({ player }) => {
      player.decreaseVolume(volumeStep / 100)
    })
    e.stopPropagation()
  })
}

handlePlyrShortcuts()
