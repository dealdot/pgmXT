import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Space, Divider, theme } from 'antd'
import type { MenuProps } from 'antd'
import { langItems, themeItems } from '@renderer/config/theme'
import { useAppSetting } from '@renderer/context/AppSetting'

const AppSetting = () => {
  console.log('app setting111')
  const [langText, setLangText] = useState('简体中文')
  const [themeText, setThemeText] = useState('明亮模式')
  const { language, setLanguage, currentTheme, setCurrentTheme } = useAppSetting()
  const {
    token: { colorBgContainer, colorPrimary, colorPrimaryText, colorTextBase }
  } = theme.useToken()
  const onLangClick: MenuProps['onClick'] = (e: { key: string }) => {
    const langItem = langItems.find((item) => item.key === e.key)
    if (langItem) {
      setLangText(langItem.label)
      setLanguage(e.key)
    }
  }
  const onThemeClick: MenuProps['onClick'] = (e: { key: string }) => {
    const themeItem = themeItems.find((item) => item.key === e.key)
    if (themeItem) {
      setThemeText(themeItem.label)
      setCurrentTheme(e.key)
    }
  }
  useEffect(() => {
    const langItem = langItems.find((item) => item.key === language)
    if (langItem) {
      setLangText(langItem.label)
    }
    const themeItem = themeItems.find((item) => item.key === currentTheme)
    if (themeItem) {
      setThemeText(themeItem.label)
    }
    console.log('app setting22')
    return () => {
      console.log('配置页面卸载了')
    }
  }, [])
  return (
    <>
      <Divider orientation="center" plain>
        <span style={{ color: colorPrimary }}>基础配置</span>
      </Divider>
      <div className="basic-settings">
        <div className="flex flex-row justify-between px-6">
          <div style={{ color: colorTextBase }} className="text-base">
            语言
          </div>
          <Dropdown
            menu={{
              items: langItems,
              selectable: true,
              defaultSelectedKeys: [language],
              onClick: onLangClick
            }}
            trigger={['click']}
            placement="bottom"
            arrow
            className=""
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space size={'small'} style={{ color: colorTextBase }}>
                {langText}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Divider />
        <div className="flex flex-row justify-between px-6">
          <div style={{ color: colorTextBase }} className="text-base">
            主题
          </div>
          <Dropdown
            menu={{
              items: themeItems,
              selectable: true,
              defaultSelectedKeys: [currentTheme],
              onClick: onThemeClick
            }}
            trigger={['click']}
            placement="bottom"
            arrow
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space size={'small'} style={{ color: colorTextBase }}>
                {themeText}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Divider />
      </div>
    </>
  )
}
export default AppSetting
