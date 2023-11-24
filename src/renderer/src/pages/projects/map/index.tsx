import React from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Card, Flex, Col, Row } from 'antd'
import card from '@renderer/assets/images/map.png'
import card1 from '@renderer/assets/images/map1.png'
import profile from '@renderer/assets/images/user.jpg'
const { Meta } = Card

const Maps: React.FC = () => (
  <div className="px-10 py-8">
    <Flex gap="middle" wrap="wrap" justify="start">
      <Card
        hoverable
        size="small"
        loading={false}
        style={{ width: 240 }}
        cover={<img alt="example" src={card} />}
        actions={[
          <a
            key="setting"
            onClick={(): void => {
              console.log('setting card')
            }}
          >
            <SettingOutlined key="setting" />
          </a>,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
        onClick={(): void => console.log('card被点击了')}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="K11 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>

      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>

      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港1 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>

      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港2 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>

      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港3 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>

      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港4 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>

      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港5 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>

      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港6 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>
      <Card
        hoverable
        style={{ width: 240 }}
        size="small"
        cover={<img alt="example" src={card} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src={profile} />}
          title="传媒港7 SLAM地图"
          description="2023.11.22 13:30:22修改"
        />
      </Card>
    </Flex>
  </div>
)

export default Maps
