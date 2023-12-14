import React, { useEffect, useState } from 'react'
import { Layout, Button, theme, Tooltip } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, PushpinFilled } from '@ant-design/icons'
import './index.less'

const { Header } = Layout
interface CollapseProps {
  collapsed: boolean
  onCollapseChange: (collapsed: boolean) => void
}
const DHHeader: React.FC<CollapseProps> = ({ collapsed, onCollapseChange }) => {
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  //console.log('check', colorBgContainer, colorPrimary)
  const [pinTop, setPinTop] = useState(false)

  const onPinTop = (): void => {
    //send pinTop to main process
    window.electron.ipcRenderer.send('pintop-message', !pinTop)
    setPinTop(!pinTop)
  }
  const handleCollapse = (): void => {
    onCollapseChange(!collapsed)
  }
  return (
    <div>
      <Header className="flex justify-between p-0" style={{ backgroundColor: colorBgContainer }}>
        <Tooltip placement="right" title={collapsed ? '展开' : '收起'}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleCollapse}
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
    </div>
  )
}
export default DHHeader
