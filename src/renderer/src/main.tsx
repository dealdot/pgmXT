import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <App />
)
//使用方法见:  https://github.com/alex8088/electron-toolkit/tree/master/packages/preload
window.electron.ipcRenderer.on('main-process-message', (_, event) => {
  console.log('主进程传来的时间888:', event)
})
