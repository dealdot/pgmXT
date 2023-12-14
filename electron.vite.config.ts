import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    //配置less
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true // 支持内联 JavaScript
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    //需要反向代理时开启
    server: {
      proxy: {
        '/api': {
          //在开发服务器http://localhost:5609和目标服务器http://localhost:3008的中间层，看起来请求是直接从这个中间层发送来的
          target: 'http://localhost:3008',
          changeOrigin: true
          //如果使用 Rewrite发送到后端的 pathname: /getMenu
          //如果不使用，则发送到后端的 pathname: /api/getMenu，即/api 还保留着
          //rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
