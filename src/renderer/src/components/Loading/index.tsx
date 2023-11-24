import React from 'react'
import { Spin, theme } from 'antd'
import './index.css'

const LoadingComponent: React.FC = () => {
  const { token } = theme.useToken()
  return (
    <div id="globalLoading" className="loading">
      <Spin style={{ color: token.colorPrimary }} />
    </div>
  )
}

export default LoadingComponent
