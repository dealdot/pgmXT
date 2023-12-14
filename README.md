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
- 参考功能 https://www.bilibili.com/video/BV17d4y157XJ/?spm_id_from=pageDriver&vd_source=e08390cd90daa23eed88f4e74bd8761e
- 参考 https://space.bilibili.com/688437974 系列
- 控制机器人运动  https://github.com/kahowang/lab-3dslam-plotform/tree/main/ROS%20WEB%E5%8F%AF%E8%A7%86%E5%8C%96%E4%B8%8A%E4%BD%8D%E6%9C%BA/lib_web
- react 常用库，tools https://zhuanlan.zhihu.com/p/546697951?utm_id=0
- awesome-electron: https://github.com/sindresorhus/awesome-electron
- antd-style 使用 antd 主题配置 https://zhuanlan.zhihu.com/p/636143897
- electron 专用组件库 https://photonkit.com/getting-started/，不过功能比较少
- pgm 转 png  https://convertio.co/zh/download/19d5e941f94ffa068a98e0bdaf4b7e71445622/
- 通过这里了解下 slam 建图 https://www.lmlphp.com/user/10684/article/item/450899

## todo

1. 创建win 时nodeIntegration: true, contextIsolation: false, 这在生产环境是不安全的，借助 preload.js 实现安全的 main 进程和 render 进程通信, 此处一直配置失败，先直接让 main 和 render进程通信吧 done ✅
2. 支持 tailwindcss done,主要页面都使用 tailwindcss 完成，部分页面开始时候没想到用 tailwindcss，用了 css/less 实现的 ✅
3. 调研了一下，这个 app 后期会做的异常复杂，只使用 tailwindcss 不太能完成任务，现引入 antd 组件库 npm install antd --save ✅
4. 引入 react-router-dom,把几个 menu 对应的都处理一下，点击后跳到正常的路由上去,使用路由的时候就要考虑权限了，页面级权限和按钮级权限，这就要考虑要不要做权限管理了，那是不是要做后台，后台包括用户基本信息，在地图上添加的点位信息这些，可以存储在 sqlite3 数据库中加载,可能就要上后端服务了，这感觉是后期的事情，现在直接做持久化到客户端，即当前用户在当前机器上做编辑任务，即使用 nodejs 操作 sqlite3数据库来存储点位信息。暂时不支持云端同步。因此现在也就不考虑权限之类的事情了。后边可以考虑使用 nodejs/go 语言来写后端这一块从而支持云端同步。 ✅
5. 美化一些垂直滚动条 ✅
6. 暂时还未想到使用context 还是 redux 来处理全局状态（全局状态管理库），后期根据情况来定，由于项目不大，感觉用 context 足够了 ✅
7. 系统设置这一块，这一期考虑做主题切换（Light/Dark）模式，主题自定义配置（比如主色调，按钮样式等）并且考虑多语言支持使用 context 实现
8. 配置使用 less，现在是 css 不太好用 ✅ 直接安装在 vite.config.ts 中配置一下即可，但已经用了 tailwindcss 没必要再使用 less/css 这些了
9. 项目展示的时候使用flex 布局，一开始使用 row,col 实现自适应效果但不是想要的效果，想要网易云音乐那种，每个 item 之间的距离固定，当父容器变大时，item 尺寸跟着变大，但有一个最大值，缩小的时候也同时有一个最小值，antd 提供的一个 flex 组件应该可以完成此功能  ✅
10. eslint 配置总是提示函数要返回类型，这里给禁用了，见.eslintrc.cjs中新添加的配置 rules ✅
11. react 组件懒加载，缓存（这里是react-router 的默认行为，当切换路由时之前的组件会卸载，再点回来时组件会重新加载），及为何点击下拉框时每次都会执行 useEffect(这里并没有指定依赖项,这是基本概念 state 变化时组件就会重新渲染,比如 useState 和 useReducer 操作的 state 变化时组件就会重新渲染)，及第一次加载页面 useEffect 打印两次的问题(开发环境为了调试用，生产环境不会)✅
12. 新建工程及对地图进行编辑后新的地图保存在哪里，描的点，画的线这些 json 数据保存在哪里，需要引入服务端，那就使用 Node.js 吧，使用express.js 框架简化操作,数据库为了方便就使用 sqlite3文件数据库。搭建起来基本框架 ✅
13. 现在后端的逻辑是上传本地的 pmg 图片到远程，保存到后端某个文件夹内，同时把上传的 pgm 图片的 url 和图片的相关信息比如宽度和高度，上次修改时间记录到数据库，同时保存工程名到数据库


### issue
1. 无frame,但有窗口控制器 mac 叫 traffic lights see: https://www.electronjs.org/zh/docs/latest/api/frameless-window#%E5%88%9B%E5%BB%BA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3
2. mac/ubuntu/windows下的窗口怎么处理, 使用 autoHideMenuBar 开启，frame: true, ubuntu 下表现是按住 alt 键，会显示菜单; windows 下表现 同 ubuntu;mac 下没有表现 ,这是 mac 强制规定的;
3. mac 下 menu 的标题一直是 electron , 设置app.setName()和修改 Index.html 的 title 属性没用，develop 模式下没办法，生产环境时候可以指定名称, see:  https://github.com/electron/electron/issues/19892
4. 现在使用暗黑模式，使用 const {token: { colorBgContainer, colorPrimary }} = theme.useToken() 在切换主题时貌似获取的 token 还是以前的,现在发现一个现象，我的理解是正确的，更改暗黑主题后对应的 colorBgContainer,colorPrimary 确实会变，只是在当前的 Layout 组件中不会变，而引入 一个子组件中就会发现它确实已经改变了,实践中发现 Header 会默认有个颜色（深蓝色跟 menu 部分一样),而 Footer 部分没有默认颜色，因此会自动跟随主题颜色变化，再分析一下为何在 Layout 当前组件中，Layout 组件渲染为何相关主题的颜色不会变化,而它的子主组件颜色会变化
更多 token 值可见:  https://ant.design/docs/react/customize-theme-cn


### skills get
1. async 修饰的函数返回值是 promise, 主要用于异步操作, 封装网络请求 get / post 时返回的值就是 promise
如 async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {}
await可以是等待一个常量，变量，promise，函数等，因为 await 会阻塞进程，所以必须在 async 函数中使用 await 才可以,await 等待 promise 的情况比较多，像封装的 get/post 请求函数，封装的时候做成 promise,调用的时候 await 等待的也是 promise，包括 axios 自己的 get/post 其实返回的也是一个 promise

//以前封装的 axios get 请求方式一，直接使用查询字符串 queryString
export async function getPermissionsByMenuId(data: { id: number }) {
  return await request.get<ResponseData<Permission[]> | []>(`/api/getPermissionsByMenuId?${qs.stringify(data)}`);

//axios get 请求方式二，使用 params 的方式，url 上不会暴露信息
export async function groupDictsByCode(params: { groupCode: string; nodeId: string }): Promise<DictsCode[]> {
  return await request.get("system-dicts/group-dicts-by-code", {
    params,
  });
}  