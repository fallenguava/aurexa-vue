import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { API_BASE_URL } from '@/api/config'
import type { User } from '@/types/auth'
import { extractUserFromAccessToken, fetchAuthenticatedUser } from '@/lib/auth'

const MANUAL_LOGOUT_STORAGE_KEY = 'aurexa:manual-logout'

function setManualLogoutMarker(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(MANUAL_LOGOUT_STORAGE_KEY, 'true')
}

function clearManualLogoutMarker(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(MANUAL_LOGOUT_STORAGE_KEY)
}

function hasManualLogoutMarker(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(MANUAL_LOGOUT_STORAGE_KEY) === 'true'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => accessToken.value !== null)

  function setAuth(userData: User | null, token: string): void {
    clearManualLogoutMarker()
    user.value = userData
    accessToken.value = token
  }

  async function logout(options?: { skipConfirm?: boolean }): Promise<void> {
    if (!options?.skipConfirm) {
      const { useLogoutConfirmationStore } = await import('@/stores/logout-confirmation.store')
      const confirmationStore = useLogoutConfirmationStore()
      const confirmed = await confirmationStore.requestConfirmation()

      if (!confirmed) {
        return
      }
    }

    if (accessToken.value) {
      try {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`,
            },
            withCredentials: true,
          },
        )
      } catch (error) {
        console.error('Failed to call logout endpoint:', error)
      }
    }

    setManualLogoutMarker()
    user.value = null
    accessToken.value = null
    isInitialized.value = true
    await router.push('/login')
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

  async function restoreSession(): Promise<void> {
    if (hasManualLogoutMarker()) {
      isInitialized.value = true
      return
    }

    try {
      // Use raw axios (not the interceptor `api` instance) to avoid triggering
      // the response interceptor's own refresh logic and causing an infinite loop.
      const res = await axios.post<{ data: { accessToken: string } }>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      )

      const refreshPayload = extractRefreshPayload(res.data)
      if (refreshPayload) {
        const userFromApi = await fetchAuthenticatedUser(refreshPayload.accessToken)
        const hydratedUser =
          refreshPayload.user ??
          userFromApi ??
          extractUserFromAccessToken(refreshPayload.accessToken)
        setAuth(hydratedUser, refreshPayload.accessToken)
      }
    } catch {
      // Silently ignore — cookie is missing or expired; user stays unauthenticated.
    } finally {
      isInitialized.value = true
    }
  }

  return { user, accessToken, isAuthenticated, isInitialized, setAuth, logout, restoreSession }
})
