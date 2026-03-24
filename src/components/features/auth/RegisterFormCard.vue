<template>
  <div class="relative min-h-screen overflow-hidden bg-[#f7f3ea] px-4 py-8 sm:px-6 lg:px-8">
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(13,148,136,0.16),transparent_30%)]"
    />
    <div class="absolute left-8 top-10 h-28 w-28 rounded-full bg-amber-200/50 blur-3xl" />
    <div class="absolute bottom-10 right-10 h-36 w-36 rounded-full bg-teal-200/50 blur-3xl" />

    <div
      class="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]"
    >
      <AuthShowcasePanel class="hidden lg:block" />

      <div class="mx-auto w-full max-w-xl">
        <div
          class="rounded-4xl border border-zinc-200/80 bg-white/88 p-6 shadow-[0_30px_90px_rgba(148,163,184,0.22)] backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div class="mb-8 space-y-4">
            <div
              class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700"
            >
              <span class="h-2 w-2 rounded-full bg-amber-500" />
              New Account
            </div>

            <div class="space-y-2">
              <h2 class="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Create your Aurexa account
              </h2>
              <p class="max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
                Register to start managing your pockets and transactions in one place.
              </p>
            </div>
          </div>

          <form @submit.prevent="handleRegister" novalidate class="space-y-5">
            <div class="space-y-2">
              <label for="username" class="text-sm font-medium text-zinc-700">Username</label>
              <Input
                id="username"
                v-model="username"
                type="text"
                autocomplete="username"
                required
                placeholder="Enter your username"
                class="h-12 rounded-xl border-zinc-200 bg-zinc-50 shadow-none focus-visible:bg-white"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-zinc-700">Email</label>
              <Input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                placeholder="name@example.com"
                class="h-12 rounded-xl border-zinc-200 bg-zinc-50 shadow-none focus-visible:bg-white"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-zinc-700">Password</label>
              <Input
                id="password"
                v-model="password"
                type="password"
                autocomplete="new-password"
                required
                placeholder="••••••••"
                class="h-12 rounded-xl border-zinc-200 bg-zinc-50 shadow-none focus-visible:bg-white"
                :disabled="isLoading"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              :disabled="isLoading"
              class="h-12 w-full rounded-xl bg-zinc-950 text-base font-semibold text-white hover:bg-zinc-800"
            >
              <span v-if="isLoading">Signing up...</span>
              <span v-else class="inline-flex items-center gap-2">
                Create Account
                <ArrowRight class="size-4" />
              </span>
            </Button>

            <div class="text-center text-sm text-zinc-600">
              Already have an account?
              <RouterLink to="/login" class="font-semibold text-zinc-950 hover:underline">
                Sign in
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { useRegister } from '@/composables/useRegister'
import type { RegisterRequestData } from '@/types/auth'
import AuthShowcasePanel from '@/components/features/auth/AuthShowcasePanel.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const router = useRouter()
const { isLoading, submitRegister } = useRegister()
const username = ref('')
const email = ref('')
const password = ref('')

async function handleRegister(): Promise<void> {
  const payload: RegisterRequestData = {
    username: username.value,
    email: email.value,
    password: password.value,
  }

  try {
    await submitRegister(payload)
    await router.push('/login')
  } catch {
    // Errors are handled globally by the Axios response interceptor (toast)
  }
}
</script>
