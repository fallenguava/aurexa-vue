import { ref } from 'vue'
import type { PaginationMeta } from '@/types'

export function usePagination(defaultLimit = 10) {
  const page = ref(1)
  const limit = ref(defaultLimit)
  const totalPages = ref(1)

  function applyMeta(meta?: Partial<PaginationMeta>) {
    totalPages.value = Math.max(1, Number(meta?.totalPages ?? 1))
  }

  function setPage(nextPage: number) {
    page.value = nextPage
  }

  function resetPage() {
    page.value = 1
  }

  function resetPagination() {
    page.value = 1
    totalPages.value = 1
  }

  return {
    page,
    limit,
    totalPages,
    applyMeta,
    setPage,
    resetPage,
    resetPagination,
  }
}
