<template>
  <nav
    class="fixed right-0 bottom-0 left-0 z-40 border-t border-zinc-200/80 bg-white/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] backdrop-blur md:hidden"
    aria-label="Mobile bottom navigation"
  >
    <ul class="flex items-end justify-around gap-1">
      <li v-for="item in items" :key="item.title" class="flex-1">
        <RouterLink
          :to="item.to!"
          class="flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors"
          :class="
            isSidebarItemActive(route.path, item)
              ? 'bg-zinc-950 text-white'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          "
        >
          <component :is="item.icon" class="size-4" />
          <span class="truncate">{{ item.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  filterSidebarNavigationByUserType,
  isSidebarItemActive,
  sidebarNavigation,
  type AppSidebarItem,
} from './index'

const route = useRoute()
const authStore = useAuthStore()

const items = computed<AppSidebarItem[]>(() => {
  const visibleGroups = filterSidebarNavigationByUserType(
    sidebarNavigation,
    authStore.user?.type ?? null,
  )

  return visibleGroups
    .flatMap((group) => group.items)
    .filter((item) => Boolean(item.to) && !item.disabled)
})
</script>
