export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown, M = unknown> {
  success: boolean
  message: string
  data: T
  meta?: M
}
