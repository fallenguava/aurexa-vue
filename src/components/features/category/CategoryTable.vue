<template>
  <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="3" class="py-8 text-center text-zinc-500">
            <LoadingIndicator class="text-lg" variant="dots" text="Loading..." />
          </TableCell>
        </TableRow>

        <TableRow v-else-if="rows.length === 0">
          <TableCell colspan="3" class="py-8 text-center text-zinc-500">
            No categories found.
          </TableCell>
        </TableRow>

        <TableRow v-for="category in rows" v-else :key="category.id">
          <TableCell class="font-medium text-zinc-900">{{ category.name }}</TableCell>
          <TableCell>
            <Badge :class="getTypeBadgeClass(category.type)" variant="outline">
              <ArrowDownLeft v-if="category.type === 'INCOMING'" class="size-3" />
              <ArrowUpRight v-else class="size-3" />
              {{ category.type }}
            </Badge>
          </TableCell>
          <TableCell class="text-zinc-600">{{
            formatDate(category.created_at, 'dateTime')
          }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { LoadingIndicator } from '@/components/ui/loading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDateFormatter } from '@/composables/useDateFormatter'
import type { TransactionType } from '@/types'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import type { Category } from '@/types'

defineProps<{
  rows: Category[]
  loading: boolean
}>()

const { formatDate } = useDateFormatter('id-ID')

function getTypeBadgeClass(type: TransactionType): string {
  if (type === 'INCOMING') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  return 'border-rose-200 bg-rose-50 text-rose-700'
}
</script>
