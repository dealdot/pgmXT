import React, { useState } from 'react'
import { Input, Form, Modal, Button, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { createProject } from '@renderer/api/project'
import parseYamlToJson from '@renderer/utils/tools'

interface Values {
  title: string
  description: string
  modifier: string
}

interface CollectionCreateFormProps {
  open: boolean
  //onCreate: (values: Values) => void
  setOpen: (val: boolean) => void
}

interface YamlStructure {
  image?: string
  resolution: number
  origin: number[]
  negate: number
  occupied_thresh: number
  free_thresh: number
}

const CreateProjectForm: React.FC<CollectionCreateFormProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  //存放 fileList
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const beforeUpload = (file: RcFile) => {
    const isyml =
      file.type === 'application/x-yaml' || file.type === 'text/yaml' || file.name.endsWith('.yaml')
    const isPGM = file.name.endsWith('.pgm')
    if (!isyml && !isPGM) {
      message.error('只能上传 yaml 和 pgm 文件 !')
      return Upload.LIST_IGNORE
    }
    //beforeUpload自带的 fileList是指一次上传的文件数量
    if (fileList.length >= 2) {
      message.error('只能上传两个文件!')
      return Upload.LIST_IGNORE
    }
    // const isLt2M = file.size / 1024 / 1024 < 2
    // if (!isLt2M) {
    //   message.error('文件不能大于2MB!')
    // }
    return isyml || isPGM
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList)
    //这里的逻辑是点击上传文件的时候就调用接口把文件上传，返回一个 url 地址，然后再点击创建的时候把这个
    //地址的值 post 过去，存储在数据中
    console.log('status', info.file.status)
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功.`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败!`)
    }
  }
  const confirmHandler = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (
          fileList.length !== 2 ||
          !fileList.some((file) => file.name.endsWith('.yaml')) ||
          !fileList.some((file) => file.name.endsWith('.pgm'))
        ) {
          //some 只要数组有一个满足条件就返回 true
          message.error('请同时上传 YAML 和 PGM 文件!')
          return
        }
        //各种校验通过, 调用接口提交到后台
        //1. 收集表单信息，工程名
        //2. 解析上传的 yaml 文件，取一些参数，post 过去的时候要存储在数据库中
        const result = await createProject({ id: 3 })
        console.log(result)
        //onCreate(values)
        //当前数据为标题和上传的文件，文件中的 originFileObj 可以获取到原文件的信息
        console.log('当前数据为: ', values.slamFiles.fileList)
        const yamlFile = values.slamFiles.fileList.find((item) => item.name.endsWith('.yaml'))
        if (!yamlFile) {
          console.error('YAML file 不存在.')
        } else {
          try {
            const oriYamlFilePath = yamlFile.originFileObj?.path
            if (!oriYamlFilePath) {
              throw new Error('originFileObj 不存在')
            }
            const jsonData = parseYamlToJson<YamlStructure>(oriYamlFilePath)
            console.log('jsonData为: ', jsonData)
          } catch (error) {
            console.error('解析 YAML 文件出错: ', error)
          }
        }
        setOpen(false)
      })
      .catch((info) => {
        console.log('Validate Failed', info)
      })
  }
  //在内部定义组件，因为要利用 state
  const uploadButton = <Button icon={<UploadOutlined />}>点击上传</Button>
  return (
    <Modal
      open={open}
      title="创建新工程"
      okText="创建"
      cancelText="取消"
      onCancel={() => setOpen(false)}
      onOk={confirmHandler}
    >
      <Form form={form} layout="vertical" name="form_in_modal" size="middle">
        <Form.Item
          name="projectName"
          label="工程名"
          rules={[{ required: true, message: '请填写工程名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="slamFiles"
          label="SLAM相关资源文件"
          rules={[{ required: true, message: '请选择yaml配置文件和pgm图片一起上传 ！' }]}
        >
          <Upload
            multiple
            name="files"
            className="slam-uploader"
            action="/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {uploadButton}
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
