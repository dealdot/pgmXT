import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { message } from 'antd'
import BasicLayout from '@renderer/layout'
import Loading from '@renderer/components/Loading'
import NotFoundPage from '@renderer/pages/error/404'
import loadable from '@loadable/component'

//全局配置message
message.config({
  duration: 2
})

//异步加载路由
const [MapsPage, SystemConfigPage, RobotsPage] = [
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async () => await import('@renderer/pages/projects/map'),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async () => await import('@renderer/pages/system/config'),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async () => await import('@renderer/pages/robots/config')
].map((item) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return loadable(item as any, {
    fallback: <Loading />
  })
})

//todo: router模块封装, 回来考虑封装UserLayout表示登录页的Layout
const RouterComponent = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<BasicLayout />}>
        {/* 添加重定向 */}
        <Route index element={<Navigate to="/projects" />} />
        <Route path="/projects" element={<MapsPage />}></Route>
        <Route path="/robots/r1" element={<RobotsPage />}></Route>
        <Route path="/systems" element={<SystemConfigPage />}></Route>
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="404" />} />
      </Route>
    </Routes>
  )
}

export default RouterComponent
