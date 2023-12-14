//import type { ResponseData } from '../api/project/type'
interface RequestData {
  name: string
  file: File
}
interface RequestPostOptions<T> {
  endpoint: string
  data: T
}
interface RequestGetOptions {
  endpoint: string
  params: Record<string, string>
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
  }
}
