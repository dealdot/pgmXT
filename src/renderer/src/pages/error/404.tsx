import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

import './index.less'

const NotFoundPage = (): JSX.Element => {
  const navigate = useNavigate()
  const goHome = (): void => {
    navigate('/', { replace: true })
  }
  return (
    <div className="page-error">
      <div>
        <div className="info">不好意思</div>
        <div className="info">这里什么也没有</div>
        <Button className="back-btn" type="primary" ghost onClick={goHome}>
          返回首页
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
