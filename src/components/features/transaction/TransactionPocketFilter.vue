<template>
  <div class="space-y-2">
    <p class="text-sm font-medium text-zinc-700">Choose pocket</p>
    <SelectPocketBadge v-model="internalValue" :pockets="pockets" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SelectPocketBadge from '@/components/features/pocket/SelectPocketBadge.vue'
import type { Pocket } from '@/types'

const props = defineProps<{
  pockets: Pocket[]
  modelValue: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>
