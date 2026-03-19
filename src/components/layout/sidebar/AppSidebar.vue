<template>
  <Sidebar
    variant="inset"
    collapsible="icon"
    class="border-r border-zinc-200/80 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/80"
  >
    <SidebarHeader class="border-b border-zinc-200/70 px-2 py-3">
      <div class="flex items-center gap-3 px-2">
        <div class="flex size-10 items-center justify-center rounded-2xl">
          <SidebarTrigger />
        </div>
        <div class="min-w-0 group-data-[collapsible=icon]:hidden">
          <p class="truncate text-sm font-semibold text-zinc-950">{{ sidebarBrand.name }}</p>
          <p class="truncate text-xs text-zinc-500">{{ sidebarBrand.tagline }}</p>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContent class="px-2 py-4">
      <SidebarGroup v-for="group in visibleSidebarNavigation" :key="group.label">
        <SidebarGroupLabel
          class="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400"
        >
          {{ group.label }}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.title">
              <SidebarMenuButton
                v-if="item.disabled"
                :tooltip="item.title"
                :disabled="true"
                class="text-zinc-400 opacity-90"
              >
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
                <span
                  v-if="item.badge"
                  class="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 group-data-[collapsible=icon]:hidden"
                >
                  {{ item.badge }}
                </span>
              </SidebarMenuButton>

              <SidebarMenuButton
                v-else
                as-child
                :tooltip="item.title"
                :is-active="isSidebarItemActive(route.path, item)"
                class="text-zinc-600 data-[active=true]:bg-zinc-950 data-[active=true]:text-white hover:text-zinc-950"
              >
                <RouterLink :to="item.to!" @click="closeSidebarOnMobile">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t border-zinc-200/70 px-2 py-3">
      <SidebarMenu class="mt-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            :tooltip="'Sign out'"
            class="text-zinc-600 hover:bg-red-500 hover:text-white"
            @click="handleLogoutClick"
          >
            <LogOut />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { LogOut } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth.store'
import {
  filterSidebarNavigationByUserType,
  isSidebarItemActive,
  sidebarBrand,
  sidebarNavigation,
} from './index'
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue'

const route = useRoute()
const authStore = useAuthStore()
const { isMobile, setOpenMobile } = useSidebar()
const visibleSidebarNavigation = computed(() =>
  filterSidebarNavigationByUserType(sidebarNavigation, authStore.user?.type ?? null),
)

function closeSidebarOnMobile() {
  if (isMobile.value) {
    setOpenMobile(false)
  }
}

function handleLogoutClick() {
  closeSidebarOnMobile()
  authStore.logout()
}
</script>
