<template>
  <div class="space-y-3">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-4">
      <LoadingIndicator variant="dots" text="Loading pockets..." />
    </div>

    <!-- Pockets Grid -->
    <div v-else class="flex flex-wrap gap-2">
      <button
        v-for="pocket in pockets"
        :key="pocket.id"
        type="button"
        :disabled="isDisabled"
        :class="[
          'group relative rounded-full transition-all duration-200',
          isDisabled 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1',
        ]"
        @click="selectPocket(pocket.id)"
      >
        <Badge 
          :variant="modelValue === pocket.id ? 'default' : 'outline'" 
          class="px-4 py-1.5 text-sm font-medium shadow-sm transition-all duration-200"
          :class="[
            modelValue === pocket.id 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-background hover:bg-accent hover:text-accent-foreground',
            !isDisabled && modelValue !== pocket.id && 'hover:shadow'
          ]"
        >
          {{ pocket.name }}
        </Badge>
        
        <!-- Optional: Active indicator dot -->
        <span 
          v-if="modelValue === pocket.id" 
          class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary-foreground ring-2 ring-primary"
        />
      </button>

      <!-- Empty State -->
      <p v-if="pockets.length === 0" class="w-full py-6 text-center text-sm text-muted-foreground">
        No pockets available
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { LoadingIndicator } from '@/components/ui/loading'
import type { Pocket } from '@/types'

const props = withDefaults(
  defineProps<{
    pockets: Pocket[]
    modelValue: string
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function selectPocket(pocketId: string) {
  if (isDisabled.value) return
  emit('update:modelValue', pocketId)
}

const isDisabled = computed(() => props.disabled || props.loading)
</script>