import React from 'react'
import Router from '@renderer/router'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@renderer/context/AppSetting'
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </LanguageProvider>
  )
}
export default App
