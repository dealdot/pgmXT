import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null
//渲染进程和主进程通信,主进程使用 ipcMain.on 监听
ipcMain.on('pintop-message', (event: Electron.IpcMainEvent, arg) => {
  // 'event' 对象包含了与此事件相关的信息，比如发送消息的窗口
  // 'arg' 是从渲染进程发送的数据，这里应该是 'hello'
  console.log(`Message received: ${arg}`, typeof arg)
  mainWindow?.setAlwaysOnTop(arg)
})
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1460,
    height: 900,
    // width: 1280, //mac 14'' width
    // height: 832, //mac 14'' height
    minWidth: 1460,
    minHeight: 900,
    minimizable: true,
    maximizable: true,
    closable: true,
    movable: true,
    //alwaysOnTop: isPinTop, 初始值可以这样使用
    // titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    // backgroundColor: '#f00',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      //webSecurity: false,
      nodeIntegration: false, //生产环境时要设置为 false
      contextIsolation: true //生产环境时设置为 true
      //Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Test actively push message to the Electron-Renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
    //接收 render process 发送过来的pinTop
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  //set appName
  app.setName('SLAM pgmXT')
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// app.dock.setBadge('SLAM pgmXT')
//export default mainWindow
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//不用自己处理window max/min/close
import parseYamlToJson from './yaml-parse'

interface YamlStructure {
  image: string
  resolution: number
  origin: number[]
  negate: number
  occupied_thresh: number
  free_thresh: number
}

ipcMain.handle('parse-yaml-file', async (event: Electron.IpcMainInvokeEvent, filePath: string) => {
  try {
    // 执行一些异步操作
    return parseYamlToJson<YamlStructure>(filePath)
  } catch (error) {
    console.error('Error parsing YAML file:', error)
    throw error
  }
})
