<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Create Pocket</DialogTitle>
        <DialogDescription> Create a new pocket with initial balance. </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="pocket-name" class="text-sm font-medium text-zinc-700">Pocket Name</label>
          <Input
            id="pocket-name"
            v-model="name"
            placeholder="Wallet Name"
            :disabled="isSubmitting"
          />
        </div>

        <div class="space-y-2">
          <label for="pocket-balance" class="text-sm font-medium text-zinc-700">
            Current Balance
          </label>
          <Input
            id="pocket-balance"
            v-model="currentBalance"
            type="number"
            inputmode="numeric"
            :min="0"
            :step="1"
            placeholder="Optional"
            :disabled="isSubmitting"
          />
        </div>

        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" :disabled="isSubmitting" @click="handleCancel">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting || !isFormValid">
            {{ isSubmitting ? 'Creating...' : 'Create Pocket' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import api from '@/api/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ApiResponse, Pocket } from '@/types'
import { toast } from 'vue-sonner'

interface CreatePocketPayload {
  name: string
  current_balance: number
}

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'created', pocket: Pocket): void
}>()

const isSubmitting = ref(false)
const name = ref('')
const currentBalance = ref<string>('')

const parsedCurrentBalance = computed(() => {
  const rawValue = currentBalance.value.trim()

  if (rawValue === '') {
    return 0
  }

  return Number(rawValue)
})
const isFormValid = computed(
  () =>
    name.value.trim().length > 0 &&
    Number.isFinite(parsedCurrentBalance.value) &&
    parsedCurrentBalance.value >= 0,
)

function resetForm() {
  name.value = ''
  currentBalance.value = ''
}

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}

function handleCancel() {
  emit('update:open', false)
}

async function handleSubmit() {
  if (!isFormValid.value) {
    toast.error('Please fill in a valid pocket name and non-negative balance')
    return
  }

  isSubmitting.value = true

  const payload: CreatePocketPayload = {
    name: name.value.trim(),
    current_balance: parsedCurrentBalance.value,
  }

  try {
    const response = await api.post<ApiResponse<Pocket>>('/pockets', payload)
    toast.success('Pocket created successfully')
    emit('created', response.data.data)
    emit('update:open', false)
  } catch (error) {
    console.error('Error creating pocket:', error)
    toast.error('Failed to create pocket')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    }
  },
)
</script>
