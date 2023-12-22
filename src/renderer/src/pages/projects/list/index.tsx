import React, { useEffect, useState } from 'react'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Avatar, Card, List, FloatButton, Modal, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import profile from '@renderer/assets/images/logo.png'
//引入组件
import CreateProjectForm from '@renderer/components/CreateProject'
import { getProjects, delProjectById } from '@renderer/api/project'
import type { ProjectTableColumns } from '@renderer/api/project/type'
const { Meta } = Card

//先前端临时写死，回来研究后端怎么返回 /upload/file__x.pgm 类似的路径
const baseAssetsURL = import.meta.env.RENDERER_VITE_BASE_URL + '/upload/'
const ProjectList: React.FC = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProjectName, setSelectedProjectName] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState(0)
  const [projects, setProjects] = useState<ProjectTableColumns[]>([])

  useEffect(() => {
    //组件加载时执行一次
    getAllProjects()
  }, [])

  const getAllProjects = async () => {
    const results = await getProjects({})
    if (results.status === 'Success') {
      setProjects(results.data)
    }
    console.log(results.data)
  }

  const handleAddProject = () => {
    setOpen(true)
  }

  const showModal = (projectName: string, projectId: number) => {
    setIsModalOpen(true)
    setSelectedProjectName(projectName)
    setSelectedProjectId(projectId)
  }

  const handleOk = async () => {
    setIsModalOpen(false)
    const result = await delProjectById(selectedProjectId)
    if (result.status === 'Success') {
      message.success(`项目删除成功.`)
      //删除成功后重新请求接口
      getAllProjects()
    } else {
      message.error(`项目删除失败!`)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="px-10 py-8">
      <List
        grid={{
          gutter: 16
        }}
        dataSource={projects}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              size="small"
              loading={false}
              style={{ width: 240 }}
              cover={<img alt={item.project_name} src={`${baseAssetsURL}/${item.png_url}`} />}
              actions={[
                <a
                  key="delete"
                  onClick={(event): void => {
                    event.stopPropagation()
                    showModal(item.project_name, item.id)
                    console.log('delete card')
                  }}
                >
                  <DeleteOutlined style={{ fontSize: 18 }} key="delete" />
                </a>
              ]}
              onClick={() => {
                navigate(`/projects/controlpanel?id=${item.id}`)
                console.log('card被点击了')
              }}
            >
              <Meta
                avatar={<Avatar src={profile} />}
                title={item.project_name}
                description={`${dayjs(item.created_time).format('YYYY年MM月DD日')}创建`}
              />
            </Card>
          </List.Item>
        )}
      />
      <FloatButton
        onClick={handleAddProject}
        icon={<PlusOutlined />}
        type="primary"
        style={{ right: 20 }}
      />
      <CreateProjectForm open={open} setOpen={setOpen} reloadProjects={getAllProjects} />
      <Modal title="删除" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>确定要删除项目: {selectedProjectName} 吗？</p>
      </Modal>
    </div>
  )
}

export default ProjectList
