import type { RequestData, ProjectTableColumns, ResponseData, PGMSize } from './type'
import { request } from '@renderer/utils/request'

export async function createProject(data: RequestData) {
  return await request.post<ResponseData<null>>({
    endpoint: '/api/create',
    data
  })
}

export async function getProjects(params) {
  return await request.get<ResponseData<ProjectTableColumns[]>>({
    endpoint: '/api/getProjects',
    params
  })
}

export async function getProjectById(params) {
  return await request.get<ResponseData<ProjectTableColumns | string | null>>({
    endpoint: `/api/getProject`,
    params
  })
}

export async function delProjectById(projectId: number) {
  return await request.delete<ResponseData<null>>({
    endpoint: `/api/delProject/${projectId}`
  })
}

export async function getPGMImage(fileName: string) {
  return await request.getBufferData<ArrayBuffer>({
    endpoint: `/api/getPGMArrayBufferData/${fileName}`
  })
}

export async function getCurrentPGMImageSize() {
  return await request.get<ResponseData<PGMSize>>({
    endpoint: `/api/getCurrentPGMSize`
  })
}
