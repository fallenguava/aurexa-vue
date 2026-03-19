<template>
  <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Title</TableHead>
          <TableHead class="text-right">Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="4" class="py-8 text-center text-zinc-500">
            <LoadingIndicator class="text-lg" variant="dots" text="Loading..." />
          </TableCell>
        </TableRow>

        <TableRow v-else-if="!hasPocketSelected">
          <TableCell colspan="4" class="py-8 text-center text-zinc-500">
            Select a pocket to load transactions.
          </TableCell>
        </TableRow>

        <TableRow v-else-if="rows.length === 0">
          <TableCell colspan="4" class="py-8 text-center text-zinc-500">
            No transactions found for this pocket.
          </TableCell>
        </TableRow>

        <TableRow v-for="tx in rows" v-else :key="tx.id">
          <TableCell class="whitespace-nowrap text-zinc-600">
            {{ formatDate(tx.date, 'dateTime') }}
          </TableCell>
          <TableCell>
            <div class="font-medium text-zinc-900">{{ tx.title }}</div>
            <p v-if="tx.description" class="mt-1 line-clamp-1 text-xs text-zinc-500">
              {{ tx.description }}
            </p>
          </TableCell>
          <TableCell
            class="text-right font-medium"
            :class="tx.type === 'INCOMING' ? 'text-emerald-600' : 'text-rose-600'"
          >
            {{ tx.type === 'INCOMING' ? '+' : '-' }}
            {{ formatCurrency(Math.abs(tx.amount), currency) }}
          </TableCell>
          <TableCell>
            <Badge :class="getTypeBadgeClass(tx.type)" variant="outline">
              <ArrowDownLeft v-if="tx.type === 'INCOMING'" class="size-3" />
              <ArrowUpRight v-else class="size-3" />
              {{ tx.type }}
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/60 px-4 py-3">
      <p class="text-sm text-zinc-500">Page {{ page }} of {{ totalPages }}</p>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="loading || page <= 1"
          @click="goToPage(page - 1)"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="loading || page >= totalPages"
          @click="goToPage(page + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingIndicator } from '@/components/ui/loading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter'
import { useDateFormatter } from '@/composables/useDateFormatter'
import type { Transaction, TransactionType } from '@/types'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    rows: Transaction[]
    loading: boolean
    hasPocketSelected: boolean
    page: number
    totalPages: number
    currency?: string
  }>(),
  {
    currency: 'IDR',
  },
)

const emit = defineEmits<{
  (e: 'change-page', page: number): void
}>()

const { formatCurrency } = useCurrencyFormatter('IDR', 'en-US')
const { formatDate } = useDateFormatter('id-ID')

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > props.totalPages) {
    return
  }

  emit('change-page', nextPage)
}

function getTypeBadgeClass(type: TransactionType): string {
  if (type === 'INCOMING') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  return 'border-rose-200 bg-rose-50 text-rose-700'
}
</script>
