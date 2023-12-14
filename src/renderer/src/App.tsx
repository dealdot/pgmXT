import React from 'react'
import Router from '@renderer/router'
import { BrowserRouter } from 'react-router-dom'
import { AppSettingProvider } from '@renderer/context/AppSetting'
const App: React.FC = () => {
  return (
    <AppSettingProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AppSettingProvider>
    // <LanguageProvider>
    //   <ThemeProvider>
    //     <BrowserRouter>
    //       <Router />
    //     </BrowserRouter>
    //   </ThemeProvider>
    // </LanguageProvider>
  )
}
export default App
