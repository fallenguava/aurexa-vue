<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Create Category</DialogTitle>
        <DialogDescription>
          Add a category by filling name and choosing a transaction type.
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="category-name" class="text-sm font-medium text-zinc-700">Category Name</label>
          <Input
            id="category-name"
            v-model="name"
            type="text"
            placeholder="Name of your category"
            :disabled="isSubmitting"
          />
        </div>

        <div class="space-y-2">
          <label for="category-type" class="text-sm font-medium text-zinc-700">Type</label>
          <Select
            :model-value="type"
            :disabled="isSubmitting"
            @update:model-value="handleTypeChange"
          >
            <SelectTrigger id="category-type" class="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOMING">
                <div class="inline-flex items-center gap-2 text-emerald-600">
                  <ArrowDownLeft class="size-4" />
                  <span>INCOMING</span>
                </div>
              </SelectItem>
              <SelectItem value="OUTCOMING">
                <div class="inline-flex items-center gap-2 text-rose-600">
                  <ArrowUpRight class="size-4" />
                  <span>OUTCOMING</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" :disabled="isSubmitting" @click="handleCancel">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting || !isFormValid">
            {{ isSubmitting ? 'Creating...' : 'Create Category' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AcceptableValue } from 'reka-ui'
import api from '@/api/axios'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import type { ApiResponse, Category, CreateCategoryPayload, TransactionType } from '@/types'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'created', category: Category): void
}>()

const isSubmitting = ref(false)
const name = ref('')
const type = ref<TransactionType | ''>('')

const isFormValid = computed(() => name.value.trim().length > 0 && Boolean(type.value))

function resetForm() {
  name.value = ''
  type.value = ''
}

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}

function handleCancel() {
  emit('update:open', false)
}

function handleTypeChange(value: AcceptableValue) {
  const nextValue = typeof value === 'string' ? value.toUpperCase() : ''
  if (nextValue === 'INCOMING' || nextValue === 'OUTCOMING') {
    type.value = nextValue
    return
  }

  type.value = ''
}

async function handleSubmit() {
  if (!isFormValid.value || !type.value) {
    toast.error('Please fill in a category name and choose a valid type')
    return
  }

  isSubmitting.value = true

  const payload: CreateCategoryPayload = {
    name: name.value.trim(),
    type: type.value,
  }

  try {
    const response = await api.post<ApiResponse<Category>>('/categories', payload)
    toast.success('Category created successfully')
    emit('created', response.data.data)
    emit('update:open', false)
  } catch (error) {
    console.error('Error creating category:', error)
    toast.error('Failed to create category')
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
