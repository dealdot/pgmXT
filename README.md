## pgmXT

SLAM 地图编辑工具(.pgm 格式），SLAM部署工具

**pgm editor for SLAM**

前端技术栈: vite + electron + react + tailwindcss + typescript

后端技术栈：express.js + sqlite3数据库

后端仓库: [pgmXT-backend](https://github.com/dealdot/pgmXT-backend) 

screenshots:

1. [screenshot1-项目列表，数据在 sqlite 中持久化](https://github.com/dealdot/pgmXT/blob/main/screenshot1.png) 
2. [screenshot2-添加一个新项目](https://github.com/dealdot/pgmXT/blob/main/screenshot2.png) 
3. [screenshot3-编辑 pgm 地图，新增，删除线段,调整画笔精细等操作](https://github.com/dealdot/pgmXT/blob/main/screenshot3.png) 
4. [screenshot4-导出功能](https://github.com/dealdot/pgmXT/blob/main/screenshot4.png) 

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm run dev
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
### License

This project is under the MIT License. Refer to the [LICENSE](https://github.com/dealdot/pgmXT/blob/main/LICENSE) file for detailed information.