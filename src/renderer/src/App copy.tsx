import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PushpinFilled,
  ClockCircleFilled,
  AndroidFilled,
  SettingFilled,
  FolderFilled
} from '@ant-design/icons'
import { Layout, Menu, Button, theme, ConfigProvider, Tooltip } from 'antd'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
const { Header, Sider, Content } = Layout
import Logo from './assets/images/logo.png'
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [pinTop, setPinTop] = useState(false)
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const onPinTop = (): void => {
    //send pinTop to main process
    window.electron.ipcRenderer.send('pintop-message', !pinTop)
    setPinTop(!pinTop)
  }
  const onBreakPoint = (broken: boolean): void => {
    setCollapsed(broken)
  }
  // style={{ backgroundColor: 'red', width: '100%', height: '100%' }}
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#409eff',
          borderRadius: 2

          // 派生变量，影响范围小
          //colorBgContainer: '#f00'
        },
        components: {
          Layout: {
            headerHeight: 32
          }
        }
      }}
    >
      <Layout className="container-wrapper" hasSider>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={58}
          width={160}
          className="sidebar"
          style={{ backgroundColor: colorBgContainer }}
          breakpoint="lg"
          onBreakpoint={onBreakPoint}
        >
          {/* border-solid border-2 border-red-500 */}
          <div className="flex flex-col justify-center items-center py-4">
            <img src={Logo} width={40} height={40} />
            <div className="mt-2 text-sm font-medium">pgmXT</div>
          </div>

          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <FolderFilled />,
                label: '项目管理'
              },
              {
                key: '2',
                icon: <AndroidFilled />,
                label: '机器人配置'
              },
              {
                key: '3',
                icon: <ClockCircleFilled />,
                label: '任务调度'
              },
              {
                key: '4',
                icon: <SettingFilled />,
                label: '系统设置'
              }
            ]}
          />
        </Sider>
        <Layout>
          <Header className="flex justify-between p-0 bg-[#f5f5f5]">
            <Tooltip placement="right" title={collapsed ? '展开' : '收起'}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={(): void => setCollapsed(!collapsed)}
                style={{
                  fontSize: '14px',
                  width: 32,
                  height: 32
                }}
              />
            </Tooltip>
            <Tooltip placement="left" title={pinTop ? '取消置顶' : '置顶'}>
              <Button
                type="text"
                icon={<PushpinFilled />}
                onClick={onPinTop}
                style={{
                  fontSize: '14px',
                  width: 32,
                  height: 32,
                  color: pinTop ? colorPrimary : ''
                }}
              />
            </Tooltip>
          </Header>
          <Content
            style={{
              // border: '1px solid #f00',
              paddingTop: '30px',
              minHeight: 280,
              background: '#f5f5f5'
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App
