import { createRouter, createWebHistory } from 'vue-router'
import { hasUserTypeAccess } from '@/lib/access-control'
import type { UserType } from '@/types'

/** Routes that do not require authentication. */
const PUBLIC_ROUTES = new Set(['/login', '/register'])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: {
            title: 'Dashboard',
            allowedUserTypes: ['REG'] as UserType[],
          },
        },
      ],
    },
    {
      path: '/pockets',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'pockets',
          component: () => import('@/views/pocket/PocketListPage.vue'),
          meta: {
            title: 'Pockets',
            allowedUserTypes: ['REG'] as UserType[],
          },
        },
        {
          path: ':id',
          name: 'pocket-detail',
          component: () => import('@/views/pocket/PocketDetailPage.vue'),
          meta: {
            title: 'Pocket Detail',
            allowedUserTypes: ['REG'] as UserType[],
          },
        },
      ],
    },
    {
      path: '/transactions',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'transactions',
          component: () => import('@/views/transaction/TransactionListPage.vue'),
          meta: {
            title: 'Transactions',
            allowedUserTypes: ['REG'] as UserType[],
          },
        },
      ],
    },
    {
      path: '/projects',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'projects',
          component: () => import('@/views/project/ProjectListPage.vue'),
          meta: {
            title: 'Projects',
            allowedUserTypes: ['REG'] as UserType[],
          },
        },
      ],
    },
    {
      path: '/categories',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'categories',
          component: () => import('@/views/category/CategoryListPage.vue'),
          meta: {
            title: 'Categories',
            allowedUserTypes: ['REG'] as UserType[],
          },
        },
      ],
    },
    {
      path: '/reports',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'reports',
          component: () => import('@/views/report/ReportGeneratePage.vue'),
          meta: {
            title: 'Reports',
            allowedUserTypes: ['REG'] as UserType[],
          },
        },
      ],
    },
  ],
})

// ── Global navigation guard ───────────────────────────────────────────────────
// useAuthStore is imported dynamically to avoid circular dependency:
// router → auth.store → router
router.beforeEach(async (to) => {
  if (PUBLIC_ROUTES.has(to.path)) {
    return true
  }

  const { useAuthStore } = await import('@/stores/auth.store')
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.restoreSession()
  }

  if (!authStore.isAuthenticated) {
    return { name: 'login' }
  }

  const allowedUserTypes = [...to.matched]
    .reverse()
    .find((record) => Array.isArray(record.meta.allowedUserTypes))?.meta.allowedUserTypes as
    | UserType[]
    | undefined

  if (!hasUserTypeAccess(authStore.user?.type, allowedUserTypes)) {
    return { name: 'home' }
  }

  return true
})

export default router
