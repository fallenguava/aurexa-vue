import api from '@/api/axios'
import type { RegisterRequestData, RegisterResponse } from '@/types/auth'

const REGISTER_ENDPOINT = 'https://api.winandahartadi.cloud/api/auth/register'

export async function register(payload: RegisterRequestData): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(REGISTER_ENDPOINT, payload)
  return response.data
}
