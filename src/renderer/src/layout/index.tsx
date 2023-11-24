import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Layout, Menu, Button, theme, ConfigProvider, Tooltip } from 'antd'
import { ThemeMode, token } from '@renderer/config/theme'
import { MenuFoldOutlined, MenuUnfoldOutlined, PushpinFilled } from '@ant-design/icons'

// 组件国际化
import type { Locale } from 'antd/es/locale'
import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/es/locale/en_US'
import esES from 'antd/es/locale/es_ES'

// 文字国际化(这一期只做中文)
import { IntlProvider } from 'react-intl'
import zhLocale from '@renderer/locales/zh.json'
import enLocale from '@renderer/locales/en.json'
import esLocale from '@renderer/locales/es.json'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

//引入 context
import { useLanguage } from '@renderer/context/AppSetting'
const { Header, Content, Sider } = Layout

const locales = {
  zh: zhLocale,
  en: enLocale,
  es: esLocale
}
import Logo from '@renderer/assets/images/logo.png'
import menuItems from '@renderer/config/menu'
import './index.less'

const BasicLayout: React.FC = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [locale, setLocale] = useState<Locale>(zhCN)
  const [localeMessage, setLocaleMessage] = useState<string>('zh')
  const [mode, setMode] = useState<string>('light')
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
  // const changeLang = (): void => {
  //   setLocale(esES)
  //   setLocaleMessage('es')
  // }
  //菜单被选择时执行
  const onSelect = (e: any): void => {
    console.log('e.key: ', e.key)
    if (e.key) {
      navigate(e.key)
    }
  }
  useEffect(() => {
    if (language === 'zh') {
      setLocale(zhCN)
      setLocaleMessage('zh')
    } else if (language === 'en') {
      setLocale(enUS)
      setLocaleMessage('en')
    } else if (language === 'es') {
      setLocale(esES)
      setLocaleMessage('es')
    }
  }, [language])

  return (
    <IntlProvider locale={localeMessage} messages={locales[localeMessage as keyof typeof locales]}>
      <ConfigProvider
        theme={{
          token,
          components: {
            Layout: {
              headerHeight: 32
            }
          },
          algorithm: mode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}
        locale={locale}
      >
        <Layout className="container-wrapper" hasSider>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={58}
            width={200}
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
              defaultSelectedKeys={['/projects']}
              items={menuItems}
              onSelect={onSelect}
            />
          </Sider>
          <Layout>
            <Header
              style={{ backgroundColor: colorBgContainer }}
              className="flex justify-between p-0"
            >
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
            <Content className="content-container">
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </IntlProvider>
  )
}

export default BasicLayout
