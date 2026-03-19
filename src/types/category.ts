import type { BaseModel } from './base'
import type { TransactionType } from './transaction'

export interface Category extends BaseModel {
  user_id?: string
  name: string
  type: TransactionType
}

export interface CreateCategoryPayload {
  name: string
  type: TransactionType
}
