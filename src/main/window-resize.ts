/*
import { ipcMain } from 'electron'
import mainWindow from './index'
//自定义窗口显示
//最小化
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize()
})
//最大化
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow?.maximize()
  }
})
//关闭窗口
ipcMain.on('window-close', () => {
  mainWindow?.close()
})
*/
