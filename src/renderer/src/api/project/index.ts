import type { ResponseData } from './type'
import { request } from '@renderer/utils/request'

interface DataType {
  url: string
}

export async function createProject(params) {
  return await request.get<ResponseData<DataType>>({
    endpoint: '/api/create',
    params
  })
}
