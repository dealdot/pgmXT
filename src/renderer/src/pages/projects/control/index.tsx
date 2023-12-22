import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FloatButton, Button } from 'antd'
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { getProjectById, getCurrentPGMImageSize, getPGMImage } from '@renderer/api/project'
import type { ProjectTableColumns, PGMSize } from '@renderer/api/project/type'
import { fabric } from 'fabric'
import { read } from 'fs'
const pgmXTControl: React.FC = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const projectId = queryParams.get('id') ?? ''
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [project, setProject] = useState<ProjectTableColumns>()
  const [isErasing, setIsEarsing] = useState(false)
  const [eraserSize, setEraserSize] = useState(10)
  const canvaWidth = 1120
  const canvasHeight = 760
  //const [pgmImageData, setPgmImageData] = useState(null)
  //const [pgmImageSize, setPgmImageSize] = useState<PGMSize>()

  useEffect(() => {
    //useEffect 在 dom 加载完成调用，因此要放到 useEffect 里
    const canvas: fabric.Canvas = new fabric.Canvas('pgm-canvas', { x: 0, y: 0 })
    setCanvas(canvas)
    /*
    //设置绘制模式
    canvas.isDrawingMode = true
    //设置画笔宽度
    canvas.freeDrawingBrush.width = 20
    //设置画笔的颜色
    canvas.freeDrawingBrush.color = 'pink'
    //画虚线
    //canvas.freeDrawingBrush.strokeDashArray = [20, 50]
    //画线不要超出边界
    canvas.freeDrawingBrush.limitedToCanvasSize = false
    console.log('canvas', canvas)
    */
    //组件加载时执行一次
    const fetchData = async () => {
      if (projectId) {
        const projectDetail = await getProjectById({ projectId: projectId })
        if (
          projectDetail.status === 'Success' &&
          projectDetail.data &&
          typeof projectDetail.data === 'object' &&
          'pgm_url' in projectDetail.data
        ) {
          console.log(projectDetail.data)
          setProject(projectDetail.data as ProjectTableColumns)

          const pgmImageDataBuffer = await getPGMImage(projectDetail.data.pgm_url)
          const pgmImageData = new Uint8Array(pgmImageDataBuffer) //这样转换后才是二进制,因为是从后端返回的
          console.log('pgmImageData二进制: ', pgmImageData)
          // 获取PGM图像尺寸
          const pgmSize = await getCurrentPGMImageSize()
          if (pgmSize && pgmSize.status === 'Success') {
            console.log(pgmSize.data.width)
            const { width, height } = pgmSize.data
            setPGMImageBackground(canvas, pgmImageData, width, height)
            zoomFunction(canvas)
            //eraserFunction(canvas)
            //new fabric.EraserBrush(canvas) // 使用橡皮擦画笔
          }
        }
      }
    }
    fetchData()
    return () => {
      canvas.dispose()
    }
  }, [])

  const eraserFunction = (canvas: fabric.Canvas) => {
    //添加橡皮擦功能
    // 为 canvas 添加鼠标事件监听
    canvas.on('mouse:down', () => setIsEarsing(true))
    canvas.on('mouse:up', () => setIsEarsing(false))

    canvas.on('mouse:move', (options) => {
      console.log('鼠标状态: ', options, isErasing)
      if (!isErasing) return

      // 获取鼠标位置
      const pointer = canvas.getPointer(options.e)
      const x = pointer.x
      const y = pointer.y

      // 获取画布上下文并擦除像素
      const ctx = canvas.getContext('2d')
      ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize)

      // 更新画布
      canvas.renderAll()
    })
  }
  const zoomFunction = (canvas: fabric.Canvas) => {
    // 处理鼠标滚轮事件以缩放图像
    canvas.on('mouse:wheel', function (opt) {
      const delta = opt.e.deltaY
      let zoom = canvas.getZoom()
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01
      //canvas.setZoom(zoom)
      // 以 canvas 中心为缩放点进行缩放
      const center = canvas.getCenter()
      canvas.zoomToPoint({ x: center.left, y: center.top }, zoom)
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }
  const setPGMImageBackground = (
    canvas: fabric.Canvas,
    pgmImageData: Uint8Array,
    width: number,
    height: number
  ) => {
    // 创建一个临时 canvas 用于图像数据处理
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D
    tempCanvas.width = width
    tempCanvas.height = height

    const canvasImageData = tempCtx.createImageData(width, height)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = width * y + x
        const canvasIdx = idx << 2
        canvasImageData.data[canvasIdx] = pgmImageData[idx] // red
        canvasImageData.data[canvasIdx + 1] = pgmImageData[idx] // green
        canvasImageData.data[canvasIdx + 2] = pgmImageData[idx] // blue
        canvasImageData.data[canvasIdx + 3] = 0xff // alpha (opacity)
      }
    }
    tempCtx.putImageData(canvasImageData, 0, 0)
    //这里其实是把pgm 转成了 png 图片了
    //console.log(tempCanvas.toDataURL())
    fabric.Image.fromURL(tempCanvas.toDataURL(), (fabricImage) => {
      // 将 fabric.Image 添加到 fabric.Canvas
      canvas.add(fabricImage)
      //居中直接这样写,这样图片和控制按钮都可以居中
      fabricImage.center()
      fabricImage.set({
        hasControls: false,
        hasBorders: false,
        selectable: false, //是否允许选择并移动,
        hasRotatingPoint: false // 取消缩放，rotatingPoint
      })
      canvas.renderAll()
    })
  }
  // const getPGMImageSize = async () => {
  //   const result = await getCurrentPGMImageSize()
  //   if (result.status === 'Success') {
  //     return result
  //   }
  //   return null
  // }

  // const getPGMImageData = async (fileName: string) => {
  //   const result = await getPGMImage(fileName)
  //   return result
  // }

  // const getProjectDetail = async () => {
  //   if (projectId) {
  //     const results = await getProjectById({ projectId: projectId })
  //     if (results.status === 'Success') {
  //       console.log(results.data)
  //       setProject(results.data as ProjectTableColumns)
  //     }
  //   }
  // }
  const eraserBrushFun = () => {
    canvas.isDrawingMode = true // 进入绘画模式
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas) // 使用橡皮擦画笔
    canvas.freeDrawingBrush.width = 20 // 设置画笔粗细为 10
  }
  return (
    <div className="p-2 h-full flex justify-center items-center border-2 border-red-300 border-soli">
      <Button onClick={eraserBrushFun} type="primary">
        橡皮擦
      </Button>
      <div className="border-2 min-h-[550px] flex justify-center items-center">
        <canvas
          id="pgm-canvas"
          width={canvaWidth}
          height={canvasHeight}
          className="border-2 border-yellow-300 border-solid"
        />
      </div>
      <div>
        <FloatButton.Group shape="square" style={{ right: 24 }}>
          <FloatButton icon={<QuestionCircleOutlined />} tooltip="描点" />
          <FloatButton tooltip="画线" />
          <FloatButton icon={<SyncOutlined />} tooltip="橡皮擦" />
          <FloatButton.BackTop visibilityHeight={0} />
        </FloatButton.Group>
      </div>
    </div>
  )
}

export default pgmXTControl
