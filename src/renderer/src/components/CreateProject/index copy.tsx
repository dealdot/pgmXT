import React, { useState } from 'react'
import { Input, Form, Modal, Radio, Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
interface Values {
  title: string
  description: string
  modifier: string
}

interface CollectionCreateFormProps {
  open: boolean
  onCreate: (values: Values) => void
  onCancel: () => void
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    callback(reader.result as string)
  })
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isyml = file.type === 'application/x-yaml' || file.type === 'text/yaml'
  if (!isyml) {
    message.error('只能上传yml/yaml格式的文件 !')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('文件不能大于2MB!')
  }
  return isyml && isLt2M
}

const CreateProjectForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }
  //在内部定义组件，因为要利用 state
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )
  return (
    <Modal
      open={open}
      title="创建新工程"
      okText="创建"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.log('Validate Failed', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        size="small"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="工程名"
          label="工程名"
          rules={[{ required: true, message: '请填写工程名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="SLAM相关资源文件"
          label="SLAM相关资源文件"
          rules={[{ required: true, message: '请选择yaml配置文件和pgm图片一起上传 ！' }]}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        {/* <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item> */}
      </Form>
    </Modal>
  )
}

export default CreateProjectForm
