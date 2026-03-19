import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLogoutConfirmationStore = defineStore('logoutConfirmation', () => {
  const isOpen = ref(false)
  const title = ref('Log out from Aurexa?')
  const description = ref(
    'You can sign in again anytime. Your current session will be ended on this device.',
  )

  let resolver: ((value: boolean) => void) | null = null

  function requestConfirmation(): Promise<boolean> {
    if (resolver) {
      resolver(false)
      resolver = null
    }

    isOpen.value = true

    return new Promise<boolean>((resolve) => {
      resolver = resolve
    })
  }

  function resolveConfirmation(confirmed: boolean): void {
    isOpen.value = false
    if (resolver) {
      resolver(confirmed)
      resolver = null
    }
  }

  return { isOpen, title, description, requestConfirmation, resolveConfirmation }
})
