import React from 'react'
import { Button, Pagination } from 'antd'

const Robots: React.FC = () => (
  <>
    <Button type="primary">机器人配置</Button>
    <Pagination defaultCurrent={6} total={500} />
  </>
)

export default Robots
