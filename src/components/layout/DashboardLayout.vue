<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset class="min-h-svh bg-zinc-50">
      <header
        class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200/80 bg-zinc-50/90 px-4 backdrop-blur md:px-6"
      >
        <SidebarTrigger class="md:hidden" />

        <div class="min-w-0">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">Aurexa</p>
          <h1 class="truncate text-base font-semibold text-zinc-950 md:text-lg">
            <TypingHeadline :phrases="headerPhrases" />
          </h1>
        </div>

        <div class="ml-auto">
          <HeaderUserMenu
            :user="authStore.user"
            :user-initial="userInitial"
            @logout="authStore.logout()"
          />
        </div>
      </header>

      <div class="flex-1 px-3 py-4 md:px-6 md:py-5">
        <div class="mx-auto w-full max-w-6xl pb-20 md:pb-0">
          <RouterView />
        </div>
      </div>

      <AppBottomNav />
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth.store'
import AppBottomNav from '@/components/layout/sidebar/AppBottomNav.vue'
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue'
import HeaderUserMenu from '@/components/layout/HeaderUserMenu.vue'
import TypingHeadline from '@/components/layout/TypingHeadline.vue'

const authStore = useAuthStore()

const headerPhrases = [
  'Hi, how are you today?', // English
  'How is your money doing today?', // English
  'Track. Save. Grow.', // English
  'Hola, ¿cómo va tu dinero hoy?', // Spanish
  'Buenos días, revisemos tus finanzas.', // Spanish
  '今日は家計の調子はどうですか？', // Japanese
  'お金の流れをチェックしましょう。', // Japanese
  '今天你的财务状态怎么样？', // Chinese
  '让我们看看今天的支出和收入。', // Chinese
  'Bonjour, prêt pour un check financier ?', // French
  'Guten Tag, wie laufen deine Finanzen heute?', // German
  'Zeit, deine Ausgaben zu überprüfen.', // German
  'Ciao! Come stanno andando le tue finanze oggi?', // Italian
  'Controlliamo le tue spese di oggi.', // Italian
  'Olá! Como está o seu dinheiro hoje?', // Portuguese
  'Vamos ver suas despesas e receitas.', // Portuguese
  'Selamat pagi! Bagaimana kondisi keuanganmu hari ini?', // Indonesian
  'Yuk cek pemasukan dan pengeluaran hari ini.', // Indonesian
  '안녕하세요, 오늘 재정 상태는 어떤가요?', // Korean
  '오늘의 수입과 지출을 확인해봅시다.', // Korean
  'Привет! Как сегодня твои финансы?', // Russian
  'Пора проверить доходы и расходы.', // Russian
  'สวัสดี วันนี้การเงินของคุณเป็นอย่างไรบ้าง?', // Thai
  'มาตรวจสอบรายรับรายจ่ายวันนี้กันเถอะ', // Thai
]

const userInitial = computed(() => {
  const source = authStore.user?.username ?? authStore.user?.email ?? 'A'
  return source.charAt(0).toUpperCase()
})
</script>
