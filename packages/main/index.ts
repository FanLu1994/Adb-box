import { app, BrowserWindow, shell, ipcMain,Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
import {LogcatListener} from "./event/LogcatListener";

const remote = require("@electron/remote/main")
remote.initialize()

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.cjs')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
// const indexHtml = join(ROOT_PATH.dist, 'index.html')
const indexHtml = join(ROOT_PATH.dist, 'index.html')



async function createWindow() {
  win = new BrowserWindow({
    title: 'Adb-Box',
    icon: join(__dirname, '../renderer/public/images/box.png'),
    width:1200,
    height:800,
    minWidth:1100,
    resizable:true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  /*隐藏electron创听的菜单栏*/
  Menu.setApplicationMenu(null)

  if (app.isPackaged) {
    win.loadFile(indexHtml)
    win.webContents.openDevTools()
  } else {
    win.loadURL(url)
    win.webContents.openDevTools()
  }

  remote.enable(win.webContents)

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // 启动监听器
  LogcatListener(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
