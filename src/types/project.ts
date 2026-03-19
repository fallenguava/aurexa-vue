import type { BaseModel } from './base'

export interface Project extends BaseModel {
  pocket_id: string
  name: string
}

export interface CreateProjectPayload {
  name: string
  pocket_id: string
}
