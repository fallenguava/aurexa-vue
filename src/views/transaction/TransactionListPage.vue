<template>
  <section class="space-y-6">
    <PageTopBar
      title="Transactions"
      eyebrow="Workspace"
      description="Browse transactions by pocket with server-side pagination."
      :show-back="false"
    >
      <template #actions>
        <Button variant="outline" @click="handleCreateTransaction">Create New Transaction</Button>
      </template>
    </PageTopBar>

    <TransactionPocketFilter
      v-model="selectedPocketId"
      :pockets="pockets"
      :loading="loadingPockets"
    />

    <TransactionTable
      :rows="transactions"
      :loading="loadingTransactions"
      :has-pocket-selected="Boolean(selectedPocketId)"
      :page="page"
      :total-pages="totalPages"
      :currency="selectedPocket?.currency || 'IDR'"
      @change-page="handlePageChange"
    />
  </section>

  <CreateTransactionDialog
    ref="createTransactionDialogRef"
    :pockets="pockets"
    @success="fetchTransactions"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/api/axios'
import TransactionPocketFilter from '@/components/features/transaction/TransactionPocketFilter.vue'
import TransactionTable from '@/components/features/transaction/TransactionTable.vue'
import PageTopBar from '@/components/layout/PageTopBar.vue'
import { usePagination } from '@/composables/usePagination'
import type { ApiResponse, PaginationMeta, Pocket, Transaction } from '@/types'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import CreateTransactionDialog from '@/components/features/transaction/CreateTransactionDialog.vue'

interface CreateTransactionDialogExposed {
  open: () => void
}

const pockets = ref<Pocket[]>([])
const loadingPockets = ref(false)
const selectedPocketId = ref('')
const transactions = ref<Transaction[]>([])
const loadingTransactions = ref(false)
const { page, limit, totalPages, applyMeta, setPage, resetPage, resetPagination } =
  usePagination(10)
const createTransactionDialogRef = ref<CreateTransactionDialogExposed | null>(null)

const selectedPocket = computed(() =>
  pockets.value.find((pocket) => pocket.id === selectedPocketId.value),
)

async function fetchPockets() {
  loadingPockets.value = true

  try {
    const response = await api.get<ApiResponse<Pocket[]>>('/pockets')
    pockets.value = response.data.data ?? []
  } catch (error) {
    console.error('Error fetching pockets:', error)
    toast.error('Failed to load pockets for transaction filter')
  } finally {
    loadingPockets.value = false
  }
}

async function fetchTransactions() {
  if (!selectedPocketId.value) {
    transactions.value = []
    resetPagination()
    return
  }

  loadingTransactions.value = true

  try {
    const response = await api.get<ApiResponse<Transaction[], Partial<PaginationMeta>>>(
      '/transactions',
      {
        params: {
          pocket_id: selectedPocketId.value,
          page: page.value,
          limit: limit.value,
        },
      },
    )

    transactions.value = response.data.data ?? []
    applyMeta(response.data.meta)
  } catch (error) {
    transactions.value = []
    totalPages.value = 1
    console.error('Error fetching transactions:', error)
    toast.error('Failed to load transactions')
  } finally {
    loadingTransactions.value = false
  }
}

const handleCreateTransaction = () => {
  createTransactionDialogRef.value?.open()
}

function handlePageChange(nextPage: number) {
  setPage(nextPage)
}

watch(selectedPocketId, () => {
  resetPage()
  fetchTransactions()
})

watch(page, () => {
  fetchTransactions()
})

onMounted(async () => {
  await fetchPockets()
})
</script>
