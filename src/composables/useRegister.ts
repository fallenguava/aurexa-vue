import { ref } from 'vue'
import { register } from '@/api/auth'
import type { RegisterRequestData } from '@/types/auth'

export function useRegister() {
  const isLoading = ref(false)

  async function submitRegister(payload: RegisterRequestData): Promise<void> {
    isLoading.value = true

    try {
      await register(payload)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    submitRegister,
  }
}
