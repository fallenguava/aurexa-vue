<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription> Choose a pocket first, then provide a project name. </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="text-sm font-medium text-zinc-700">Pocket</label>
          <SelectPocketBadge
            v-model="selectedPocketId"
            :pockets="pockets"
            :disabled="isSubmitting"
          />
        </div>

        <div class="space-y-2">
          <label for="project-name" class="text-sm font-medium text-zinc-700">Project Name</label>
          <Input
            id="project-name"
            v-model="name"
            type="text"
            placeholder="Name of your project"
            :disabled="!selectedPocketId || isSubmitting"
          />
        </div>

        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" :disabled="isSubmitting" @click="handleCancel">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting || !isFormValid">
            {{ isSubmitting ? 'Creating...' : 'Create Project' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import api from '@/api/axios'
import SelectPocketBadge from '@/components/features/pocket/SelectPocketBadge.vue'
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
import type { ApiResponse, CreateProjectPayload, Pocket, Project } from '@/types'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
  pockets: Pocket[]
  initialPocketId?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'created', project: Project): void
}>()

const isSubmitting = ref(false)
const selectedPocketId = ref('')
const name = ref('')

const isFormValid = computed(() => Boolean(selectedPocketId.value) && name.value.trim().length > 0)

function syncInitialPocket() {
  selectedPocketId.value = props.initialPocketId ?? ''
}

function resetForm() {
  name.value = ''
  syncInitialPocket()
}

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}

function handleCancel() {
  emit('update:open', false)
}

async function handleSubmit() {
  if (!isFormValid.value) {
    toast.error('Please choose a pocket and fill project name')
    return
  }

  isSubmitting.value = true

  const payload: CreateProjectPayload = {
    pocket_id: selectedPocketId.value,
    name: name.value.trim(),
  }

  try {
    const response = await api.post<ApiResponse<Project>>('/projects', payload)
    toast.success('Project created successfully')
    emit('created', response.data.data)
    emit('update:open', false)
  } catch (error) {
    console.error('Error creating project:', error)
    toast.error('Failed to create project')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
      return
    }

    name.value = ''
  },
)

watch(
  () => props.initialPocketId,
  () => {
    if (!props.open) return
    syncInitialPocket()
  },
)
</script>
