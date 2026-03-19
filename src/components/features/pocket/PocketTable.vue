<template>
  <div class="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
    <DataTable :value="rows" stripedRows :rows="5" dataKey="id" class="text-sm">
      <template #empty>
        <div v-if="loading" class="flex items-center justify-center py-8 text-zinc-500">
          <LoadingIndicator class="text-lg" variant="sandclock" text="Loading..." />
        </div>
        <div v-else class="py-6 text-center text-zinc-500">No pockets found.</div>
      </template>

      <Column field="name" header="Pocket Name" sortable>
        <template #body="slotProps">
          <Button
            icon="pi pi-arrow-up-right"
            size="small"
            class="mr-2"
            @click="handlePocketNameClick(slotProps.data.id)"
          />
          <span>{{ slotProps.data.name }}</span>
        </template>
      </Column>
      <Column field="current_balance" header="Balance" sortable>
        <template #body="slotProps">
          <div class="inline-flex items-center gap-2">
            <span>{{
              formatCurrency(slotProps.data.current_balance, slotProps.data.currency)
            }}</span>
            <CircleDot
              :class="
                isMinusBalance(slotProps.data.current_balance)
                  ? 'size-4 text-red-500 animate-ping'
                  : 'size-4 text-green-500'
              "
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { LoadingIndicator } from '@/components/ui/loading'
import type { Pocket } from '@/types'
import { CircleDot } from 'lucide-vue-next'
import router from '@/router'
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter'

interface Props {
  rows: Pocket[]
  loading: boolean
}
const props = defineProps<Props>()
const { formatCurrency } = useCurrencyFormatter('IDR', 'en-US')

const isMinusBalance = (balance: number): boolean => balance < 0

function handlePocketNameClick(pocketId: string): void {
  router.push({ name: 'pocket-detail', params: { id: pocketId } })
}
</script>
