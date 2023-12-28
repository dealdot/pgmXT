import React, { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { Layout, Menu, theme, ConfigProvider } from 'antd'
import { ThemeMode, themeToken } from '@renderer/config/theme'

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
import { useAppSetting } from '@renderer/context/AppSetting'
const { Content, Sider } = Layout

const locales = {
  zh: zhLocale,
  en: enLocale,
  es: esLocale
}

import Logo from '@renderer/assets/images/logo.png'
import menuItems from '@renderer/config/menu'
import './index.less'
//引入组件
import DHHeader from '@renderer/components/Header'
import DHFooter from '@renderer/components/Footer'
const BasicLayout: React.FC = () => {
  console.log('Basic Layout 重新渲染了')
  const { language, currentTheme } = useAppSetting()
  const navigate = useNavigate()
  const [locale, setLocale] = useState<Locale>(zhCN)
  const [localeMessage, setLocaleMessage] = useState<string>('zh')
  //父组件中使用的 state,子组件中只负责操作，不要在子组件中再定义 state 了
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  console.log('colorBg', colorBgContainer, colorPrimary)

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
  const onBreakPoint = (broken: boolean): void => {
    setCollapsed(broken)
  }
  const handleCollapseChange = (collapse: boolean): void => {
    setCollapsed(collapse)
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
          token: themeToken,
          components: {
            Layout: {
              headerHeight: 32
            },
            Slider: {
              railBg: '#50E3C2',
              railHoverBg: '#50E3C2'
            }
          },
          algorithm: currentTheme === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}
        locale={locale}
      >
        <Layout className="container-wrapper" hasSider>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            //collapsedWidth={58}
            collapsedWidth={0}
            width={200}
            className="sidebar"
            breakpoint="lg"
            onBreakpoint={onBreakPoint}
          >
            {/* border-solid border-2 border-red-500 */}
            <div
              className={`logo-container flex flex-col justify-center items-center py-4 ${
                currentTheme === ThemeMode.Light ? 'light' : 'dark'
              }`}
            >
              <img src={Logo} width={46} height={46} />
              <div className="mt-2 text-sm font-medium">pgmXT</div>
            </div>
            <div className="menu-container">
              <Menu
                className={currentTheme === ThemeMode.Light ? 'menu-wrapper' : 'menu-wrapper dark'}
                theme="light"
                mode="inline"
                defaultSelectedKeys={['/projects']}
                items={menuItems}
                onSelect={onSelect}
              />
            </div>
          </Sider>
          <Layout>
            <DHHeader collapsed={collapsed} onCollapseChange={handleCollapseChange} />
            <Content className="content-container">
              <Outlet />
            </Content>
            <DHFooter />
          </Layout>
        </Layout>
      </ConfigProvider>
    </IntlProvider>
  )
}

export default BasicLayout
