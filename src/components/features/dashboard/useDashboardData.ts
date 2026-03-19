import { computed, ref } from 'vue'
import api from '@/api/axios'
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter'
import type { ApiResponse, Pocket, Transaction } from '@/types'

export function useDashboardData() {
  const pockets = ref<Pocket[]>([])
  const recentTransactions = ref<Transaction[]>([])
  const isLoading = ref<boolean>(true)

  const { formatCurrency } = useCurrencyFormatter('IDR', 'id-ID')

  const totalBalance = computed<number>(() =>
    pockets.value.reduce((acc, pocket) => acc + pocket.current_balance, 0),
  )

  const formattedTotalBalance = computed<string>(() => formatCurrency(totalBalance.value, 'IDR'))

  async function fetchDashboardData(): Promise<void> {
    isLoading.value = true
    try {
      const pocketRes = await api.get<ApiResponse<Pocket[]>>('/pockets')
      pockets.value = pocketRes.data.data

      const txRes = await api.get<ApiResponse<Transaction[]>>('/transactions/recent')
      recentTransactions.value = txRes.data.data
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    pockets,
    recentTransactions,
    isLoading,
    formattedTotalBalance,
    formatCurrency: (amount: number) => formatCurrency(Math.abs(amount), 'IDR'),
    fetchDashboardData,
  }
}
