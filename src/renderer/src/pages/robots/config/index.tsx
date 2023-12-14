import React from 'react'
import { Button, Pagination } from 'antd'

const Robots: React.FC = () => {
  console.log('Robots 重新渲染了')
  return (
    <>
      <Button type="primary">机器人配置</Button>
      <Pagination defaultCurrent={6} total={500} />
    </>
  )
}
export default Robots
