<template>
  <div class="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
    <dl class="grid gap-6 md:grid-cols-2">
      <div>
        <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Name</dt>
        <dd class="mt-2 text-base font-medium text-zinc-950">{{ pocket.name }}</dd>
      </div>

      <div>
        <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Balance</dt>
        <dd class="mt-2 text-base font-medium text-zinc-950">
          {{ formatCurrency(pocket.current_balance, pocket.currency) }}
        </dd>
      </div>

      <div>
        <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Currency</dt>
        <dd class="mt-2 text-base font-medium text-zinc-950">{{ pocket.currency || 'IDR' }}</dd>
      </div>

      <div>
        <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Created At</dt>
        <dd class="mt-2 text-base font-medium text-zinc-950">
          {{ formatDate(pocket.created_at, 'dateTime') }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter'
import { useDateFormatter } from '@/composables/useDateFormatter'
import type { Pocket } from '@/types'

defineProps<{
  pocket: Pocket
}>()

const { formatCurrency } = useCurrencyFormatter('IDR', 'en-US')
const { formatDate } = useDateFormatter('id-ID')
</script>
