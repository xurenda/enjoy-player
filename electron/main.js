import { app, BrowserWindow, Menu } from 'electron'
import isDev from 'electron-is-dev'
import windowStateKeeper from 'electron-window-state'
import path, { dirname } from 'node:path'
import { fileURLToPath, format } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainUrl = format({
  pathname: path.join(__dirname, '../dist/index.html'),
  protocol: 'file:',
  slashes: true,
})
if (isDev) {
  mainUrl = 'http://localhost:5173/'
}

const createWindow = () => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  })
  const win = new BrowserWindow({
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

  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]))
  }
  win.loadURL(mainUrl)
  if (isDev) {
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
