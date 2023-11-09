## pgmXT

**pgm editor for SLAM**

基于这个脚手架搭建的: npm create @quick-start/electron

技术栈: vite + electron + react + tailwindcss + typescript


### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## 文档收集
- build based on https://electron-vite.github.io/
- 已经集成了 tailwindcss 可直接使用
- canvas 库 https://github.com/konvajs/konva 支持react
- canvas 库  https://github.com/fabricjs/fabric.js 支持 react

## todo
1. 创建win 时nodeIntegration: true, contextIsolation: false, 这在生产环境是不安全的，借助 preload.js 实现安全的 main 进程和 render 进程通信, 此处一直配置失败，先直接让 main 和 render进程通信吧 done ✅
2. 支持 tailwindcss done ✅