import React, { createContext, useState, useContext, ReactNode } from 'react'
interface ThemeContextType {
  currentTheme: string
  setCurrentTheme(theme: string): void
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error(`useTheme must be used within a ThemeProvider`)
  }
  return context
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('light')
  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
