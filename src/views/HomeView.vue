<template>
  <DashboardLoadingSkeleton v-if="isLoading" />

  <template v-else>
    <DashboardStatsGrid
      :formatted-total-balance="formattedTotalBalance"
      :active-project-count="pockets.length"
    />
    <RecentTransactionsCard
      :recent-transactions="recentTransactions"
      :format-currency="formatCurrency"
    />

    <div class="fixed right-6 bottom-20 z-30 md:hidden">
      <Button
        type="button"
        size="icon"
        class="h-14 w-14 rounded-full bg-zinc-950 text-white shadow-lg hover:bg-zinc-800"
        aria-label="Create transaction"
        @click="handleCreateTransaction"
      >
        <Plus class="size-6" />
      </Button>
    </div>

    <CreateTransactionDialog
      ref="createTransactionDialogRef"
      :pockets="pockets"
      @success="handleTransactionCreated"
    />
  </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CreateTransactionDialog from '@/components/features/transaction/CreateTransactionDialog.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import DashboardLoadingSkeleton from '@/components/features/dashboard/DashboardLoadingSkeleton.vue'
import DashboardStatsGrid from '@/components/features/dashboard/DashboardStatsGrid.vue'
import RecentTransactionsCard from '@/components/features/dashboard/RecentTransactionsCard.vue'
import { useDashboardData } from '@/components/features/dashboard/useDashboardData'

interface CreateTransactionDialogExposed {
  open: () => void
}

const {
  pockets,
  recentTransactions,
  isLoading,
  formattedTotalBalance,
  formatCurrency,
  fetchDashboardData,
} = useDashboardData()

const createTransactionDialogRef = ref<CreateTransactionDialogExposed | null>(null)

function handleCreateTransaction() {
  createTransactionDialogRef.value?.open()
}

function handleTransactionCreated() {
  fetchDashboardData()
}

onMounted(() => {
  fetchDashboardData()
})
</script>
