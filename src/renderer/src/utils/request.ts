//import type { ResponseData } from '../api/project/type'
import type { RequestData } from '../api/project/type'

interface RequestPostOptions<T> {
  endpoint: string
  data: T
}
interface RequestGetOptions {
  endpoint: string
  params?: Record<string, string>
}

//const baseURL = import.meta.env.RENDERER_VITE_BASE_URL
const DEFAULT_TIMEOUT = 10000 // 默认超时时间（例如 10 秒）

export const request = {
  async post<T>({ endpoint, data }: RequestPostOptions<RequestData>): Promise<T> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      clearTimeout(id)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw new Error((error as Error).message || 'Unknown error')
    }
  },
  //params是个对象
  async get<T>({ endpoint, params }: RequestGetOptions): Promise<T> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

    //将参数对象转换为查询字符串
    const queryString = params ? new URLSearchParams(params).toString() : ''
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      clearTimeout(id)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw new Error((error as Error).message || 'Unknown error')
    }
  },
  async getBufferData<T extends ArrayBuffer>({
    endpoint
  }: RequestGetOptions): Promise<T extends ArrayBuffer ? ArrayBuffer : any> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

    console.log(endpoint)
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        signal: controller.signal
      })
      clearTimeout(id)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.arrayBuffer()
    } catch (error) {
      throw new Error((error as Error).message || 'Unknown error')
    }
  },
  //delete操作和 get 差不多
  async delete<T>({ endpoint }: RequestGetOptions): Promise<T> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      clearTimeout(id)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw new Error((error as Error).message || 'Unknown error')
    }
  }
}
