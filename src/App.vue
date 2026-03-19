<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import LogoutConfirmationDialog from '@/components/layout/LogoutConfirmationDialog.vue'
</script>

<template>
  <RouterView />
  <Teleport to="body">
    <LogoutConfirmationDialog />
    <Toaster position="top-right" richColors />
  </Teleport>
</template>
