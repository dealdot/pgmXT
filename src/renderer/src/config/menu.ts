import React from 'react'
//import type { MenuProps} from 'antd'
import { ClockCircleFilled, AndroidFilled, SettingFilled, FolderFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
// type MenuItem = MenuProps['items'];

// 自定义 MenuItem 类型解决
interface MenuItem {
  key: string
  icon?: React.ReactNode
  label: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    key: '/projects',
    icon: React.createElement(FolderFilled),
    label: '项目管理'
    // children: [
    //   { key: '/projects/p1', label: '项目管理1' },
    //   { key: '/projects/p2', label: '项目管理2' }
    // ]
  },
  {
    key: '/robots',
    icon: React.createElement(AndroidFilled),
    label: '机器人管理',
    children: [{ key: '/robots/r1', label: '机器人配置' }]
  },
  {
    key: '/missions',
    icon: React.createElement(ClockCircleFilled),
    label: '任务调度',
    children: [{ key: '/missions/m1', label: '定时任务' }]
  },
  {
    key: '/systems',
    icon: React.createElement(SettingFilled),
    label: '系统设置'
  }
]
export default menuItems
