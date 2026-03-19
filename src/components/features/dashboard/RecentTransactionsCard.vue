<template>
  <div class="mt-4">
    <Card class="overflow-hidden rounded-2xl border-zinc-200 shadow-sm">
      <CardHeader class="border-b border-zinc-100 bg-white/50 pb-3">
        <div>
          <CardTitle class="text-base">Recent Transactions</CardTitle>
          <p class="text-xs text-zinc-500 mt-0.5">Latest activity</p>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="h-9 text-xs">Date</TableHead>
              <TableHead class="h-9 text-xs">Title</TableHead>
              <TableHead class="h-9 text-xs text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="tx in recentTransactions" :key="tx.id" class="h-8 hover:bg-zinc-50/50">
              <TableCell class="text-xs py-1">{{ formatDate(tx.date, 'weekdayDate') }}</TableCell>
              <TableCell class="text-xs py-1">{{ tx.title }}</TableCell>
              <TableCell
                class="text-xs py-1 text-right font-medium"
                :class="tx.type === 'INCOMING' ? 'text-emerald-600' : 'text-rose-600'"
              >
                {{ tx.type === 'INCOMING' ? '+' : '-' }} {{ formatCurrency(tx.amount) }}
              </TableCell>
            </TableRow>
            <TableRow v-if="recentTransactions.length === 0">
              <TableCell colspan="3" class="text-center text-zinc-400 py-4">
                <p class="text-xs">No transactions found</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <div class="border-t border-zinc-100 p-2 bg-zinc-50/50 flex justify-center">
        <Button variant="ghost" size="sm" class="text-xs h-8" @click="router.push('/transactions')"
          >View all</Button
        >
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { useDateFormatter } from '@/composables/useDateFormatter'
import router from '@/router'
import type { Transaction } from '@/types'

const { formatDate } = useDateFormatter('id-ID')

defineProps<{
  recentTransactions: Transaction[]
  formatCurrency: (amount: number) => string
}>()
</script>
