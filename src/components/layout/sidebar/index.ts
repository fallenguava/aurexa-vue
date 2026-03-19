import type { Component } from 'vue'
import type { UserType } from '@/types'
import { hasUserTypeAccess } from '@/lib/access-control'
import {
  CircleHelp,
  LayoutGrid,
  Settings2,
  Wallet,
  ArrowLeftRight,
  FolderKanban,
  Tags,
  FileText,
} from 'lucide-vue-next'

export interface AppSidebarItem {
  title: string
  to?: string
  icon: Component
  allowedUserTypes?: UserType[]
  exact?: boolean
  disabled?: boolean
  badge?: string
}

export interface AppSidebarGroup {
  label: string
  items: AppSidebarItem[]
}

export const sidebarBrand = {
  name: 'Aurexa',
  tagline: 'Finance workspace',
}

export const sidebarNavigation: AppSidebarGroup[] = [
  {
    label: 'Workspace',
    items: [
      {
        title: 'Dashboard',
        to: '/',
        icon: LayoutGrid,
        allowedUserTypes: ['REG'],
        exact: true,
      },
      {
        title: 'Pockets',
        to: '/pockets',
        icon: Wallet,
        allowedUserTypes: ['REG'],
      },
      {
        title: 'Transactions',
        to: '/transactions',
        icon: ArrowLeftRight,
        allowedUserTypes: ['REG'],
      },
      {
        title: 'Projects',
        to: '/projects',
        icon: FolderKanban,
        allowedUserTypes: ['REG'],
      },
      {
        title: 'Categories',
        to: '/categories',
        icon: Tags,
        allowedUserTypes: ['REG'],
      },
      {
        title: 'Reports',
        to: '/reports',
        icon: FileText,
        allowedUserTypes: ['REG'],
      },
    ],
  },
  {
    label: 'Support',
    items: [
      {
        title: 'Settings',
        icon: Settings2,
        disabled: true,
      },
      {
        title: 'Help Center',
        icon: CircleHelp,
        disabled: true,
      },
    ],
  },
]

export function isSidebarItemActive(currentPath: string, item: AppSidebarItem): boolean {
  if (!item.to) {
    return false
  }

  if (item.exact) {
    return currentPath === item.to
  }

  return currentPath === item.to || currentPath.startsWith(`${item.to}/`)
}

export function filterSidebarNavigationByUserType(
  groups: AppSidebarGroup[],
  userType?: UserType | null,
): AppSidebarGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasUserTypeAccess(userType, item.allowedUserTypes)),
    }))
    .filter((group) => group.items.length > 0)
}
