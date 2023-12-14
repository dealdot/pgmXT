import type { GlobalToken } from 'antd'
interface MenuItem {
  label: string
  key: string
}
//global token configuration
export enum ThemeMode {
  Light = 'light',
  Dark = 'dark'
}

export const themeToken: Partial<GlobalToken> = {
  colorPrimary: '#00b96b', // "#00b96b", a5d306 51da4c
  fontSize: 14,
  borderRadius: 4,
  wireframe: false
}

//AppSettings configuration
export const langItems: MenuItem[] = [
  {
    label: '简体中文',
    key: 'zh'
  },
  {
    label: 'English',
    key: 'en'
  },
  {
    label: '西班牙语',
    key: 'es'
  }
]
export const themeItems: MenuItem[] = [
  // {
  //   label: '跟随系统',
  //   key: 'system'
  // },
  {
    label: '明亮模式',
    key: 'light'
  },
  {
    label: '暗黑模式',
    key: 'dark'
  }
]
