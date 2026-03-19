import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'vue-sonner'
import type { User } from '@/types'
import { API_BASE_URL } from '@/api/config'
import { extractUserFromAccessToken, fetchAuthenticatedUser } from '@/lib/auth'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

function extractRefreshPayload(
  payload: unknown,
): { accessToken: string; user: User | null } | null {
  const data = payload as {
    accessToken?: string
    user?: User
    data?: {
      accessToken?: string
      user?: User
    }
  }

  const accessToken = data?.data?.accessToken ?? data?.accessToken
  const user = data?.data?.user ?? data?.user ?? null

  if (!accessToken) {
    return null
  }

  return { accessToken, user }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// ── Request interceptor ───────────────────────────────────────────────────────
// The store is imported lazily (inside the function body) to avoid a circular
// dependency: axios.ts → auth.store.ts → router → ... → axios.ts
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { useAuthStore } = await import('@/stores/auth.store')
  const authStore = useAuthStore()

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (error.response?.status === 401 && originalRequest) {
      // Auth endpoints (login, refresh) should never trigger the token-refresh
      // flow — a 401 from /auth/login means wrong credentials, not an expired token.
      const isAuthEndpoint = originalRequest.url?.includes('/auth/')

      // Prevent infinite retry loops
      if (originalRequest._retry || isAuthEndpoint) {
        const errorMessage =
          (error.response?.data as { message?: string })?.message ?? 'An unexpected error occurred.'
        toast.error(errorMessage)
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        const refreshPayload = extractRefreshPayload(refreshResponse.data)
        if (!refreshPayload) {
          throw new Error('Refresh response did not include accessToken.')
        }

        const newAccessToken = refreshPayload.accessToken

        // Lazy-instantiate to avoid circular dependency
        const { useAuthStore } = await import('@/stores/auth.store')
        const authStore = useAuthStore()

        const userFromApi = await fetchAuthenticatedUser(newAccessToken)

        const hydratedUser =
          refreshPayload.user ??
          userFromApi ??
          authStore.user ??
          extractUserFromAccessToken(newAccessToken)

        authStore.setAuth(hydratedUser, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch {
        const { useAuthStore } = await import('@/stores/auth.store')
        const authStore = useAuthStore()
        toast.error('Session expired. Please log in again.')
        await authStore.logout({ skipConfirm: true })

        return Promise.reject(error)
      }
    }

    const errorMessage =
      (error.response?.data as { message?: string })?.message ?? 'An unexpected error occurred.'
    toast.error(errorMessage)

    return Promise.reject(error)
  },
)

export default api
