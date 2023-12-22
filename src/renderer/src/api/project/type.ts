export interface ResponseData<T> {
  status: string
  message: string
  data: T
}
export interface RequestData {
  image: string
  resolution: number
  origin: number[]
  negate: number
  occupied_thresh: number
  free_thresh: number
  project_name: string
  pgm_url: string
  yaml_url: string
}
export interface ProjectTableColumns {
  id: number
  project_name: string
  image: string
  resolution: number
  origin_x: number
  origin_y: number
  origin_z: number
  negate: number
  occupied_thresh: number
  free_thresh: number
  pgm_url: string
  png_url: string
  yaml_url: string
  created_time: string
}
export interface PGMSize {
  width: number
  height: number
}
