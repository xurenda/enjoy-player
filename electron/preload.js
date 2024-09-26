const { contextBridge } = require('electron')
// const path = require('node:path')
// const { format } = require('node:url')

// let mainUrl = format({
//   pathname: path.join(__dirname, '../dist/index.html'),
//   protocol: 'file:',
//   slashes: true,
// })

contextBridge.exposeInMainWorld('electronAPI', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  process,
})
