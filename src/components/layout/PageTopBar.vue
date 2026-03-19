<template>
  <div
    class="flex flex-col gap-3 border-b border-zinc-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex min-w-0 items-center gap-3">
      <Button
        v-if="showBack"
        variant="outline"
        size="icon"
        class="shrink-0"
        aria-label="Go back"
        @click="goBack"
      >
        <ArrowLeft class="size-4" />
      </Button>

      <div class="min-w-0">
        <p
          v-if="eyebrow"
          class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400"
        >
          {{ eyebrow }}
        </p>
        <h2 class="truncate text-xl font-semibold text-zinc-950">
          {{ title }}
        </h2>
        <p v-if="description" class="mt-1 text-sm text-zinc-500">
          {{ description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface Props {
  title: string
  eyebrow?: string
  description?: string
  showBack?: boolean
  backTo?: string
  fallbackTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: '',
  description: '',
  showBack: true,
  backTo: '',
  fallbackTo: '/',
})

const router = useRouter()

function goBack(): void {
  if (props.backTo) {
    router.push(props.backTo)
    return
  }

  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back()
    return
  }

  router.push(props.fallbackTo)
}
</script>
