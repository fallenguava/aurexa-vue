<template>
  <HoverCard :open-delay="80" :close-delay="100">
    <HoverCardTrigger as-child>
      <button
        type="button"
        class="inline-flex items-center gap-3 px-3 py-1.5 text-right transition-colors hover:border-zinc-300"
      >
        <div
          class="flex size-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white"
        >
          {{ userInitial }}
        </div>
      </button>
    </HoverCardTrigger>

    <HoverCardContent align="end" side="bottom" class="w-72 border-zinc-200 p-0">
      <div class="p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Profile</p>
        <div class="mt-3 space-y-2">
          <div>
            <p class="text-xs text-zinc-500">Username</p>
            <p class="text-sm font-medium text-zinc-950">{{ user?.username ?? 'Unknown' }}</p>
          </div>
          <div>
            <p class="text-xs text-zinc-500">Email</p>
            <p class="text-sm font-medium text-zinc-950">{{ user?.email ?? 'Unknown' }}</p>
          </div>
          <div>
            <p class="text-xs text-zinc-500">User Type</p>
            <p class="text-sm font-medium text-zinc-950">{{ userType }}</p>
          </div>
        </div>
      </div>

      <div class="border-t border-zinc-100 p-3">
        <Button
          class="w-full hover:bg-red-500 hover:text-white rounded-full"
          variant="outline"
          @click="$emit('logout')"
        >
          <LogOut class="mr-2 size-4" />
          Logout
        </Button>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import type { User } from '@/types'

defineEmits<{
  logout: []
}>()

const props = defineProps<{
  user: User | null
  userInitial: string
}>()

const userType = computed(() => {
  const value = props.user?.type
  return typeof value === 'string' && value.length > 0 ? value : 'Unknown'
})
</script>
