import type { ApiResponse } from './api'

export type UserType = 'ADM' | 'REG'

export interface User {
  id: string
  username?: string
  email?: string
  type?: UserType
  verified?: boolean
  base_currency?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  [key: string]: any
}

export interface AuthResponseData {
  user: User
  accessToken: string
}

export type LoginResponse = ApiResponse<AuthResponseData>
