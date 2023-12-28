import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FloatButton, Slider } from 'antd'
import {
  ColumnHeightOutlined,
  DragOutlined,
  EditOutlined,
  LineOutlined,
  ClearOutlined,
  BackwardOutlined,
  ForwardOutlined,
  CloseOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import { getProjectById, getCurrentPGMImageSize, getPGMImage } from '@renderer/api/project'
import type { ProjectTableColumns, PGMSize } from '@renderer/api/project/type'
import { fabric } from 'fabric-with-erasing'
//定义类型,直接引入好像有问题，可能是 FloatButton 还没处理，因为是新组件
const pgmXTControl: React.FC = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const projectId = queryParams.get('id') ?? ''
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [project, setProject] = useState<ProjectTableColumns>()
  const [isErasing, setIsEarsing] = useState(false)
  const [brushSize, setBrushSize] = useState(10)
  const [showSlider, setShowSlider] = useState(false)
  const [btnClicked, setBtnClicked] = useState('control')
  //撤销
  const [undoStack, setUndoStack] = useState<fabric.Object[]>([])
  //重做
  const [redoStack, setRedoStack] = useState<fabric.Object[]>([])
  const canvaWidth = 1180
  const canvasHeight = 760

  useEffect(() => {
    //useEffect 在 dom 加载完成调用，因此要放到 useEffect 里
    const canvas: fabric.Canvas = new fabric.Canvas(canvasEl.current)
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas))
    //全局设置 selectable 属性
    fabric.Object.prototype.set({
      hasControls: true,
      cornerColor: '#00b96b',
      cornerStyle: 'circle',
      cornerSize: '10',
      hasBorders: false,
      selectable: true, //是否允许选择并移动,
      hasRotatingPoint: true // 取消缩放，rotatingPoint
    })

    //canvas.setOverlayColor('rgba(0,0,255,0.4)', canvas.renderAll.bind(canvas))
    setCanvas(canvas)

    //监听鼠标事件
    canvas.on('mouse:up', () => {
      const objects = canvas.getObjects()
      console.log('当前画面元素:', objects)
      const group = new fabric.Group(objects)
      canvas.clear()
      canvas.add(group)
      canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas))
      canvas.renderAll()
      canvas.isDrawingMode = false
      //重置选中的 FloatButton
      setBtnClicked('control')
    })
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
          }
        }
      }
    }
    //监听canvas新增事件
    canvas.on('object:added', () => {
      saveCanvasState(canvas)
    })
    //监听canvas修改事件
    canvas.on('object:modified', () => {
      saveCanvasState(canvas)
    })
    //监听canvas删除事件
    // canvas.on('object:removed', () => {
    //   saveCanvasState(canvas)
    // })
    fetchData()
    return () => {
      //fabric-with-erasing这个库dispose这里会报错,使用 clear
      // canvas.dispose()
      canvas.clear()
    }
  }, [])

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
    //这里其实是把 pgm 转成了 png 图片了,这样使用 fabric.Image.fromURL才可以显示出来,直接加载pgm的二进制数据是显示不出来的
    //console.log(tempCanvas.toDataURL())
    fabric.Image.fromURL(tempCanvas.toDataURL(), (fabricImage) => {
      // 将 fabric.Image 添加到 fabric.Canvas
      canvas.add(fabricImage)
      //居中直接这样写,这样图片和控制按钮都可以居中
      fabricImage.center()
      //对导入图片单独设置 selection 的属性
      fabricImage.set({
        hasControls: false,
        cornerColor: '#00b96b',
        //cornerStrokeColor: '#a5d306',
        cornerStyle: 'circle',
        transparentCorners: true,
        lockScalingX: true,
        lockScalingY: true,
        cornerSize: '10',
        hasBorders: false,
        selectable: true, //是否允许选择并移动,
        hasRotatingPoint: false // 取消缩放，rotatingPoint
      })
      canvas.renderAll()
    })
  }

  const setToDraw = () => {
    setIsEarsing(false)
    //设置绘制模式
    canvas.isDrawingMode = true
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
    //设置画笔宽度
    canvas.freeDrawingBrush.width = brushSize
    //设置画笔的颜色
    canvas.freeDrawingBrush.color = 'black'
    canvas.freeDrawingBrush.strokeLineCap = 'square'
    canvas.freeDrawingBrush.strokeLineJoin = 'bevel'
    //画虚线
    //canvas.freeDrawingBrush.strokeDashArray = [20, 50]
    //画线不要超出边界
    canvas.freeDrawingBrush.limitedToCanvasSize = false
  }
  //draw line
  const setToDrawLine = () => {}

  const setToErase = () => {
    setIsEarsing(true)
    canvas.isDrawingMode = true
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas)
    //  optional
    console.log('橡皮', canvas.freeDrawingBrush)
    // canvas.freeDrawingBrush.backgroundColor = '#FF0000'
    // canvas.freeDrawingBrush.borderColor = '#FF0000'
    // canvas.freeDrawingBrush.fill = '#FF0000'
    // canvas.freeDrawingBrush.color = '#FF0000'
    // canvas.freeDrawingBrush.visible = true
    canvas.freeDrawingBrush.strokeLineCap = 'square'
    canvas.freeDrawingBrush.width = brushSize
  }
  //保存当前 canvas 画布状态
  const saveCanvasState = (canvas: fabric.Canvas) => {
    if (canvas) {
      const currentState = canvas.toJSON()
      console.log('当前 canvas 状态', currentState)
      setUndoStack([...undoStack, currentState.objects])
      setRedoStack([])
    }
  }
  const setToControl = () => {
    canvas.isDrawingMode = false
  }
  //undo function
  const undo = () => {
    if (undoStack.length === 0) return

    const newUndoStack = [...undoStack]
    const currentState = newUndoStack.pop()
    console.log('undo....', currentState)
    setUndoStack(newUndoStack)

    setRedoStack([...redoStack, currentState])

    canvas.loadFromJSON(undoStack[undoStack.length - 1] || {}, canvas.renderAll.bind(canvas))
  }

  //redo function
  const redo = () => {
    console.log('redo111....,', canvas)
    if (redoStack.length === 0) return
    console.log('redo222....')
    const newRedoStack = [...redoStack]
    const currentState = newRedoStack.pop()
    setRedoStack(newRedoStack)

    setUndoStack([...undoStack, currentState])
    console.log('redo....')
    canvas.loadFromJSON(currentState, canvas.renderAll.bind(canvas))
  }

  //clear function
  const clearCanvas = () => {
    const children = canvas.getObjects()
    if (children.length > 0) {
      canvas.remove(...children)
    }
  }
  //export function
  //导出注意
  //1. 图片的尺寸要和 canvas 保持一样
  //2. 图片要保持原比例，不能放大，也不能缩小
  const exportPgm = () => {
    canvas.clone((cvs) => {
      //遍历所有对对象，获取最小坐标，最大坐标
      let top = 0
      let left = 0
      let width = canvas.width
      let height = canvas.height

      const objects = cvs.getObjects()
      if (objects.length > 0) {
        let rect = objects[0].getBoundingRect()
        let minX = rect.left
        let minY = rect.top
        let maxX = rect.left + rect.width
        let maxY = rect.top + rect.height
        for (let i = 1; i < objects.length; i++) {
          rect = objects[i].getBoundingRect()
          minX = Math.min(minX, rect.left)
          minY = Math.min(minY, rect.top)
          maxX = Math.max(maxX, rect.left + rect.width)
          maxY = Math.max(maxY, rect.top + rect.height)
        }
        top = minY
        left = minX
        width = maxX - minX
        height = maxY - minY
        cvs.sendToBack(
          new fabric.Rect({
            left,
            top,
            width,
            height,
            fill: 'white'
          })
        )
      }
      const dataURL = cvs.toDataURL({
        format: 'png',
        multiplier: cvs.getZoom(),
        left,
        top,
        width,
        height
      })

      const image = new Image()
      image.src = dataURL
      image.onload = () => {
        //创建一个临时Canvas来处理图像数据
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D
        tempCanvas.width = width
        tempCanvas.height = height
        tempCtx.drawImage(image, 0, 0, width, height)
        //获取图像数据
        const imageData = tempCtx.getImageData(0, 0, width, height)
        convertPNG2PGM(imageData, width, height)
      }

      // const link = document.createElement('a')
      // link.download = 'canvas.png'
      // link.href = dataURL
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
    })
  }
  const convertPNG2PGM = (imageData, width, height) => {
    const grayData = new Uint8Array(width * height)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const gray =
        0.3 * imageData.data[i] + 0.59 * imageData.data[i + 1] + 0.11 * imageData.data[i + 2]
      grayData[i / 4] = gray
    }

    // 创建PGM文件内容
    createAndDownloadPGM(grayData, width, height)
  }
  const createAndDownloadPGM = (grayData, width, height) => {
    const pgmHeader = `P5\n# Created by pgmXT author dealdot; 0.05 m/pixel\n${width} ${height}\n255\n`
    const pgmBlob = new Blob([pgmHeader, grayData], { type: 'image/x-portable-graymap' })

    const pgmLink = document.createElement('a')
    pgmLink.download = 'canvas.pgm'
    pgmLink.href = URL.createObjectURL(pgmBlob)
    document.body.appendChild(pgmLink)
    pgmLink.click()
    document.body.removeChild(pgmLink)
  }
  const exportPgmFullScreen = () => {
    const img = canvas.getObjects()[0]
    const zoom = canvas.getZoom()
    const imgWidth = img.getScaledWidth()
    const imgHeight = img.getScaledHeight()

    // 计算图片的左上角相对于画布的位置
    const rectLeft = img.left - imgWidth / 2
    const rectTop = img.top - imgHeight / 2

    // 确保导出区域不超出画布边界
    const left = Math.max(rectLeft, 0)
    const top = Math.max(rectTop, 0)
    const width = Math.min(imgWidth, canvas.width - left)
    const height = Math.min(imgHeight, canvas.height - top)

    const dataURL = canvas.toDataURL({
      format: 'png',
      left: left * zoom,
      top: top * zoom,
      width: width * zoom,
      height: height * zoom
    })
    const link = document.createElement('a')
    link.download = 'canvas.png'
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  //process slider function
  const processSlider = (value) => {
    console.log('processSlider', value)
    setBrushSize(value)
  }
  const configBrushSize = () => {
    setShowSlider(!showSlider)
  }
  //定义 FloatButtons
  const floatBtns = [
    {
      id: 'control',
      icon: <DragOutlined />,
      tooltip: '移动',
      onClick: setToControl
    },
    {
      id: 'draw',
      icon: <EditOutlined />,
      tooltip: '任意画笔',
      onClick: setToDraw
    },
    {
      id: 'drawLine',
      icon: <LineOutlined />,
      tooltip: '画直线',
      onClick: setToDrawLine
    },
    {
      id: 'erase',
      icon: <ClearOutlined />,
      tooltip: '橡皮擦',
      onClick: setToErase
    },
    {
      id: 'undo',
      icon: <BackwardOutlined />,
      tooltip: '撤销',
      onClick: undo
    },
    {
      id: 'redo',
      icon: <ForwardOutlined />,
      tooltip: '重做',
      onClick: redo
    },
    {
      id: 'clear',
      icon: <CloseOutlined />,
      tooltip: '清空画布',
      onClick: clearCanvas
    },
    {
      id: 'export',
      icon: <DownloadOutlined />,
      tooltip: '导出',
      onClick: exportPgm
    }
  ]
  return (
    <div className="p-2 h-full flex justify-center items-center border-2 border-red-300 border-soli">
      <div className="min-h-[550px] flex justify-center items-center">
        <canvas
          id="pgm-canvas"
          width={canvaWidth}
          height={canvasHeight}
          // className="border-2 border-yellow-300 border-solid"
          ref={canvasEl}
        />
      </div>
      <div className="absolute bottom-0 right-16">
        <div
          style={{
            display: 'inline-block',
            height: 320,
            position: 'relative',
            right: 4,
            bottom: 122
          }}
        >
          {showSlider && (
            <Slider
              vertical
              defaultValue={brushSize}
              min={1}
              max={20}
              tooltip={{ placement: 'left' }}
              onChange={processSlider}
            />
          )}
        </div>

        <FloatButton
          onClick={configBrushSize}
          style={{ right: 24 }}
          icon={<ColumnHeightOutlined />}
          tooltip={showSlider ? '隐藏' : '画笔尺寸'}
        />
      </div>
      <div>
        <FloatButton.Group shape="square" style={{ right: 24, bottom: 120 }}>
          {floatBtns.map(({ id, icon, tooltip, onClick }) => (
            <FloatButton
              key={id}
              type={btnClicked === id ? 'primary' : 'default'}
              onClick={() => {
                setBtnClicked(id)
                onClick()
              }}
              icon={icon}
              tooltip={tooltip}
            />
          ))}
        </FloatButton.Group>
      </div>
    </div>
  )
}

export default pgmXTControl
