# Pagination Fetch Guide

This guide defines the standard way to implement server-side pagination fetches in Aurexa Vue.

Use this pattern for any list page that fetches paginated data (projects, transactions, etc.).

## 1) Shared Building Blocks

### Centralized pagination type

Pagination metadata is centralized in `src/types/api.ts`:

- `PaginationMeta`
- `ApiResponse<T, M>`

### Reusable pagination composable

Use `src/composables/usePagination.ts` to avoid repeating page/limit/totalPages logic.

It provides:

- `page`
- `limit`
- `totalPages`
- `applyMeta(meta)`
- `setPage(nextPage)`
- `resetPage()`
- `resetPagination()`

## 2) Standard Implementation Pattern

In your page (`*Page.vue`), use this structure:

1. Initialize pagination via `usePagination(10)`.
2. Add filter state (for example `selectedPocketId`).
3. In fetch function:

- return early if required filter is empty
- clear rows and call `resetPagination()`

4. Fetch with typed response:

- `ApiResponse<RowType[], Partial<PaginationMeta>>`

5. Set rows from `response.data.data ?? []`.
6. Apply meta via `applyMeta(response.data.meta)`.
7. On filter change:

- call `resetPage()` then `fetchList()`

8. On page change:

- call `setPage(nextPage)`

## 3) Copy-Ready Example

```ts
import { ref, watch } from 'vue'
import api from '@/api/axios'
import { usePagination } from '@/composables/usePagination'
import type { ApiResponse, PaginationMeta } from '@/types'

interface RowItem {
  id: string
  name: string
}

const rows = ref<RowItem[]>([])
const loading = ref(false)
const selectedPocketId = ref('')

const { page, limit, totalPages, applyMeta, setPage, resetPage, resetPagination } =
  usePagination(10)

async function fetchRows() {
  if (!selectedPocketId.value) {
    rows.value = []
    resetPagination()
    return
  }

  loading.value = true

  try {
    const response = await api.get<ApiResponse<RowItem[], Partial<PaginationMeta>>>(
      '/example-endpoint',
      {
        params: {
          pocket_id: selectedPocketId.value,
          page: page.value,
          limit: limit.value,
        },
      },
    )

    rows.value = response.data.data ?? []
    applyMeta(response.data.meta)
  } catch (error) {
    rows.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

function handlePageChange(nextPage: number) {
  setPage(nextPage)
}

watch(selectedPocketId, () => {
  resetPage()
  fetchRows()
})

watch(page, () => {
  fetchRows()
})
```

## 4) UI Contract Recommendation

For table components, keep this prop contract consistent:

- `rows`
- `loading`
- `hasPocketSelected` (or equivalent filter-selected flag)
- `page`
- `totalPages`

And one event:

- `change-page`

This keeps page/table integration predictable.

## 5) Common Mistakes To Avoid

- Re-declaring `PaginationMeta` inside each page.
- Using `ApiResponse<any>` for paginated endpoints.
- Fetching list before required filters are selected.
- Forgetting to reset page to 1 on filter change.
- Updating `totalPages` with custom ad-hoc logic instead of `applyMeta`.

## 6) Checklist

Before merging a paginated list page, verify:

- Uses `usePagination(...)`.
- Uses typed response `ApiResponse<RowType[], Partial<PaginationMeta>>`.
- Uses `applyMeta(...)`.
- Resets pagination when required filter is missing.
- Resets to page 1 when filters change.
- Table receives `page` and `totalPages` from page state.
