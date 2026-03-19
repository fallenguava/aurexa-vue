import axios from 'axios'
import { API_BASE_URL } from '@/api/config'
import type { User } from '@/types'
import type { ApiResponse } from '@/types'

interface JwtPayload {
  id?: string
  username?: string
  email?: string
  [key: string]: unknown
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return atob(padded)
}

export function extractUserFromAccessToken(token: string): User | null {
  try {
    const payloadSegment = token.split('.')[1]
    if (!payloadSegment) {
      return null
    }

    const decoded = decodeBase64Url(payloadSegment)
    const payload = JSON.parse(decoded) as JwtPayload

    if (!payload.id) {
      return null
    }

    const user: User = {
      id: payload.id,
      ...(typeof payload.username === 'string' ? { username: payload.username } : {}),
      ...(typeof payload.email === 'string' ? { email: payload.email } : {}),
      ...payload,
    }

    return user
  } catch {
    return null
  }
}

export async function fetchAuthenticatedUser(accessToken: string): Promise<User | null> {
  try {
    const res = await axios.get<ApiResponse<User>>(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })

    return res.data.data
  } catch {
    return null
  }
}
