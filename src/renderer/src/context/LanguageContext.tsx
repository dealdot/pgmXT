import React, { createContext, useState, useContext, ReactNode } from 'react'
interface LanguageContextType {
  language: string
  setLanguage(language: string): void
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error(`useLanguage must be used within a LanguageProvider`)
  }
  return context
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('zh')
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
