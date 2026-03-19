<template>
  <section class="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm">
    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Overview</p>
    <div class="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
      <div class="self-end text-right lg:ml-auto">
        <p class="text-xs uppercase tracking-[0.22em] text-zinc-300">Live total</p>
        <h1 class="mt-0.5 ellipsis text-2xl font-semibold tracking-tight">
          {{ formattedTotalBalance }}
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  formattedTotalBalance: string
}>()
</script>
