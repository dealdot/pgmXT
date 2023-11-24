import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Space, Divider } from 'antd'
import type { MenuProps } from 'antd'
import { langItems, themeItems } from '@renderer/config/theme'
import { useLanguage } from '@renderer/context/AppSetting'
const AppSetting = () => {
  console.log('app setting111')
  const [lang, setLang] = useState('简体中文')
  const [themeText, setThemeText] = useState('跟随系统')
  const { language, setLanguage } = useLanguage()
  const onLangClick: MenuProps['onClick'] = (e: { key: string }) => {
    const langItem = langItems.find((item) => item.key === e.key)
    if (langItem) {
      setLang(langItem.label)
      setLanguage(e.key)
    }
  }
  const onThemeClick: MenuProps['onClick'] = (e: { key: string }) => {
    const themeItem = themeItems.find((item) => item.key === e.key)
    if (themeItem) {
      setThemeText(themeItem.label)
    }
  }
  useEffect(() => {
    const langItem = langItems.find((item) => item.key === language)
    if (langItem) {
      setLang(langItem.label)
    }
    console.log('app setting22')
    return () => {
      console.log('app 卸载了')
    }
  }, [language])
  return (
    <>
      <Divider orientation="center" plain>
        <span className="text-blue-500">基础配置</span>
      </Divider>
      <div className="basic-settings">
        <div className="flex flex-row justify-between px-6">
          <div className="text-base">语言</div>
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
              <Space size={'small'} className=" text-gray-800">
                {lang}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Divider />
        <div className="flex flex-row justify-between px-6">
          <div className="text-base">主题</div>
          <Dropdown
            menu={{
              items: themeItems,
              selectable: true,
              defaultSelectedKeys: ['system'],
              onClick: onThemeClick
            }}
            trigger={['click']}
            placement="bottom"
            arrow
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space size={'small'} className=" text-gray-800">
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
