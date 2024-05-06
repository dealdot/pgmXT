import { Layout, theme } from 'antd'
import './index.less'

const { Footer } = Layout

const DHFooter = () => {
  // const {
  //   token: { colorBgContainer, colorPrimary }
  // } = theme.useToken()
  // console.log(colorBgContainer, colorPrimary)
  return (
    <div className="flex items-center justify-center h-10">
      <Footer>© {new Date().getFullYear() + ' '} dealdot. All Rights Reserved</Footer>
    </div>
  )
}
export default DHFooter
