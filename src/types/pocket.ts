import type { BaseModel } from './base'

export interface Pocket extends BaseModel {
  user_id?: string
  name: string
  currency?: string
  current_balance: number
}
