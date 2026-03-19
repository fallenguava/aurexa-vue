<template>
  <AlertDialog :open="dialogStore.isOpen">
    <AlertDialogContent class="max-w-md rounded border-zinc-200 p-0 shadow-2xl">
      <div class="p-6">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-xl font-semibold tracking-tight text-zinc-950">
            {{ dialogStore.title }}
          </AlertDialogTitle>
          <AlertDialogDescription class="mt-2 text-sm leading-6 text-zinc-500">
            {{ dialogStore.description }}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </div>

      <AlertDialogFooter class="border-t border-zinc-100 bg-zinc-50/70 p-4 sm:justify-end">
        <Button
          variant="outline"
          class="rounded-full"
          @click="dialogStore.resolveConfirmation(false)"
        >
          Cancel
        </Button>
        <Button
          class="rounded-full bg-red-500 text-white hover:bg-red-800"
          @click="dialogStore.resolveConfirmation(true)"
        >
          Logout
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useLogoutConfirmationStore } from '@/stores/logout-confirmation.store'

const dialogStore = useLogoutConfirmationStore()
</script>
