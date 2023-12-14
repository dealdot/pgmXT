import React, { createContext, useState, useContext, ReactNode } from 'react'
interface AppSettingContextType {
  language: string
  setLanguage(language: string): void
  currentTheme: string
  setCurrentTheme(currentTheme: string): void
}
const AppSettingContext = createContext<AppSettingContextType | undefined>(undefined)

export const useAppSetting = () => {
  const context = useContext(AppSettingContext)
  if (!context) {
    throw new Error(`useAppSetting must be used within a AppSettingProvider`)
  }
  return context
}

export const AppSettingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('zh')
  const [currentTheme, setCurrentTheme] = useState<string>('light')
  return (
    <AppSettingContext.Provider value={{ language, setLanguage, currentTheme, setCurrentTheme }}>
      {children}
    </AppSettingContext.Provider>
  )
}
