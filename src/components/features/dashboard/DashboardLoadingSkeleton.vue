<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton class="h-32 rounded-3xl" />
      <Skeleton class="h-32 rounded-3xl" />
      <Skeleton class="h-32 rounded-3xl" />
      <Skeleton class="h-32 rounded-3xl" />
    </div>
    <Skeleton class="h-80 rounded-3xl" />
  </div>
</template>

<script setup lang="ts">
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
</script>
