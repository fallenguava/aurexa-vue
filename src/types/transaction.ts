import type { BaseModel } from './base'

export type TransactionType = 'INCOMING' | 'OUTCOMING'

export interface Transaction extends BaseModel {
  user_id: string
  pocket_id: string
  category_id?: string | null
  project_id?: string | null
  amount: number
  type: TransactionType
  date: string
  title: string
  description?: string | null
  proof_image?: string | null
}

export interface CreateTransactionPayload {
  pocket_id: string
  project_id: string
  category_id: string
  amount: number
  date: string
  title: string
  description?: string
}
