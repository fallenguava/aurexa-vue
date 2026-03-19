<template>
  <div class="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm">
    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Total Balance</p>
    <div class="mt-2 flex items-end justify-between">
      <h1 class="text-3xl font-semibold tracking-tight text-zinc-950">
        {{ formattedTotalBalance }}
      </h1>
      <div class="text-right">
        <p class="text-xs font-medium text-zinc-500">{{ activeProjectCount }}</p>
        <p class="text-xs text-zinc-400">Pockets</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  formattedTotalBalance: string
  activeProjectCount: number
}>()
</script>
