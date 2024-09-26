import { app, BrowserWindow, globalShortcut, shell } from 'electron'
import isDev from 'electron-is-dev'
import windowStateKeeper from 'electron-window-state'
import path, { dirname } from 'node:path'
import { fileURLToPath, format, parse } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let indexPath = format({
  pathname: path.join(__dirname, '../dist/index.html'),
  protocol: 'file:',
  slashes: true,
})
if (isDev) {
  indexPath = 'http://localhost:5173/'
}

let win = null
const createWindow = () => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  })
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  mainWindowState.manage(win)

  win.loadURL(indexPath)
  if (isDev) {
    win.webContents.openDevTools()
  }
  // 隐藏菜单栏
  win.setAutoHideMenuBar(true)
  // 使用浏览器打开外部链接
  win.webContents.setWindowOpenHandler(details => {
    const protocol = parse(details.url).protocol
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(details.url)
      return { action: 'deny' }
    } else {
      return { action: 'allow' }
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  // 修复 Cmd+R 加载文件路径错误的问题
  globalShortcut.register('CommandOrControl+R', () => {
    if (!win) {
      return
    }
    const urlObj = parse(win.getURL())
    if (urlObj.protocol !== 'file:') {
      return
    }
    win.loadURL(urlObj.hash ? `${indexPath}${urlObj.hash}` : indexPath)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
