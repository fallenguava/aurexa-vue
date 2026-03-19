<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent
      class="flex h-dvh w-screen max-w-none flex-col overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:rounded-lg sm:border"
    >
      <DialogHeader class="border-b px-4 py-3 sm:px-6">
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogDescription>
          Add a new transaction by selecting a pocket, project, category, and details.
        </DialogDescription>
      </DialogHeader>

      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="handleSubmit">
        <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="transaction-pocket" class="text-sm font-medium text-zinc-700"
                >Pocket</label
              >
              <Select
                :model-value="currentEntry.pocketId"
                :disabled="isSubmitting"
                @update:model-value="handlePocketChange"
              >
                <SelectTrigger id="transaction-pocket" class="w-full">
                  <SelectValue placeholder="Select pocket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="pocket in pockets" :key="pocket.id" :value="pocket.id">
                    {{ pocket.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <label for="transaction-project" class="text-sm font-medium text-zinc-700"
                >Project</label
              >
              <Select
                :model-value="currentEntry.projectId"
                :disabled="!canSelectProject || loadingProjects || isSubmitting"
                @update:model-value="handleProjectChange"
              >
                <SelectTrigger id="transaction-project" class="w-full">
                  <SelectValue :placeholder="projectPlaceholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <label for="transaction-category" class="text-sm font-medium text-zinc-700"
              >Category</label
            >
            <Select
              :model-value="currentEntry.categoryId"
              :disabled="!canSelectCategory || loadingCategories || isSubmitting"
              @update:model-value="handleCategoryChange"
            >
              <SelectTrigger id="transaction-category" class="w-full">
                <SelectValue :placeholder="categoryPlaceholder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                  <div class="flex w-full items-center justify-between gap-3">
                    <span>{{ category.name }}</span>
                    <Badge :class="getTypeBadgeClass(category.type)" variant="outline">
                      <ArrowDownLeft v-if="category.type === 'INCOMING'" class="size-3" />
                      <ArrowUpRight v-else class="size-3" />
                      {{ category.type }}
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="transaction-amount" class="text-sm font-medium text-zinc-700"
                >Amount</label
              >
              <Input
                id="transaction-amount"
                :model-value="currentEntry.amountInput"
                type="text"
                inputmode="numeric"
                placeholder="0"
                :disabled="!canInputAmount || isSubmitting"
                @update:model-value="handleAmountChange"
              />
              <p class="text-muted-foreground text-xs">
                {{ formattedAmountPreview }}
              </p>
            </div>

            <div class="space-y-2">
              <label for="transaction-date" class="text-sm font-medium text-zinc-700">Date</label>
              <Input
                id="transaction-date"
                :model-value="currentEntry.date"
                type="date"
                :disabled="!canInputDate || isSubmitting"
                @update:model-value="handleDateChange"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="transaction-title" class="text-sm font-medium text-zinc-700">Title</label>
            <Input
              id="transaction-title"
              :model-value="currentEntry.title"
              type="text"
              placeholder="Enter title"
              :disabled="!canInputTitle || isSubmitting"
              @update:model-value="handleTitleChange"
            />
          </div>

          <div class="space-y-2">
            <label for="transaction-description" class="text-sm font-medium text-zinc-700">
              Description (Optional)
            </label>
            <Textarea
              id="transaction-description"
              :model-value="currentEntry.description"
              rows="3"
              placeholder="Additional details"
              :disabled="!canInputDescription || isSubmitting"
              @update:model-value="handleDescriptionChange"
            />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
            <div class="flex flex-wrap items-center gap-2">
              <div
                v-for="(_, index) in entries"
                :key="`tx-entry-${index}`"
                class="inline-flex items-center gap-1"
              >
                <Button
                  type="button"
                  size="sm"
                  :variant="activeEntryIndex === index ? 'default' : 'outline'"
                  :disabled="isSubmitting"
                  @click="selectEntry(index)"
                >
                  {{ index + 1 }}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  class="h-8 px-2 text-xs"
                  :disabled="isSubmitting || entries.length === 1"
                  :aria-label="`Remove transaction ${index + 1}`"
                  @click.stop="removeEntry(index)"
                >
                  <Trash2 class="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <p class="text-muted-foreground text-xs">
                {{ entries.length }}/{{ MAX_TRANSACTION_ENTRIES }}
              </p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                :disabled="isSubmitting || !canAddMoreEntries"
                @click="addTransactionEntry"
              >
                + Add Transaction
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t px-4 py-3 sm:px-6">
          <Button type="button" variant="outline" :disabled="isSubmitting" @click="closeDialog">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting || !areAllEntriesValid">
            {{
              isSubmitting
                ? 'Creating...'
                : `Create ${entries.length} Transaction${entries.length > 1 ? 's' : ''}`
            }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AcceptableValue } from 'reka-ui'
import api from '@/api/axios'
import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-vue-next'
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter'
import type {
  ApiResponse,
  Category,
  CreateTransactionPayload,
  Pocket,
  Project,
  TransactionType,
} from '@/types'
import { toast } from 'vue-sonner'

// ─── Props & Emits ────────────────────────────────────────────────────────────

const props = defineProps<{
  pockets: Pocket[]
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

// ─── Dialog State ─────────────────────────────────────────────────────────────

const open = ref(false)
const isSubmitting = ref(false)
const loadingCategories = ref(false)

// ─── Remote Data ─────────────────────────────────────────────────────────────

const categories = ref<Category[]>([])
const projectCache = ref<Record<string, Project[]>>({})
const projectLoadingState = ref<Record<string, boolean>>({})

// categories are user-scoped and session-stable — fetch once, reuse across opens
let categoriesFetched = false

// ─── Form State ───────────────────────────────────────────────────────────────

interface TransactionDraft {
  pocketId: string
  projectId: string
  categoryId: string
  amountInput: string
  date: string
  title: string
  description: string
}

function createEmptyDraft(): TransactionDraft {
  return {
    pocketId: '',
    projectId: '',
    categoryId: '',
    amountInput: '',
    date: '',
    title: '',
    description: '',
  }
}

const entries = ref<TransactionDraft[]>([createEmptyDraft()])
const activeEntryIndex = ref(0)
const MAX_TRANSACTION_ENTRIES = 10

// ─── Derived State ────────────────────────────────────────────────────────────

const currentEntry = computed(
  () => entries.value[activeEntryIndex.value] ?? entries.value[0] ?? createEmptyDraft(),
)

const selectedPocket = computed(() =>
  props.pockets.find((p) => p.id === currentEntry.value.pocketId),
)

const projects = computed(() => projectCache.value[currentEntry.value.pocketId] ?? [])

const loadingProjects = computed(
  () => projectLoadingState.value[currentEntry.value.pocketId] ?? false,
)

const numericAmount = computed(() => Number(currentEntry.value.amountInput.replace(/,/g, '')) || 0)

const { formatCurrency } = useCurrencyFormatter()

const formattedAmountPreview = computed(() =>
  formatCurrency(numericAmount.value, selectedPocket.value?.currency ?? 'IDR'),
)

// Step-gate guards — each step unlocks the next
const canSelectProject = computed(() => Boolean(currentEntry.value.pocketId))
const canSelectCategory = computed(
  () => canSelectProject.value && Boolean(currentEntry.value.projectId),
)
const canInputAmount = computed(
  () => canSelectCategory.value && Boolean(currentEntry.value.categoryId),
)
const canInputDate = computed(() => canInputAmount.value && numericAmount.value > 0)
const canInputTitle = computed(() => canInputDate.value && Boolean(currentEntry.value.date))
const canInputDescription = computed(
  () => canInputTitle.value && currentEntry.value.title.trim().length > 0,
)

function isDraftValid(draft: TransactionDraft): boolean {
  const amount = Number(draft.amountInput.replace(/,/g, '')) || 0
  return (
    Boolean(draft.pocketId) &&
    Boolean(draft.projectId) &&
    Boolean(draft.categoryId) &&
    amount > 0 &&
    Boolean(draft.date) &&
    draft.title.trim().length > 0
  )
}

const areAllEntriesValid = computed(
  () => entries.value.length > 0 && entries.value.every((entry) => isDraftValid(entry)),
)

const canAddMoreEntries = computed(() => entries.value.length < MAX_TRANSACTION_ENTRIES)

// ─── Computed Placeholders ────────────────────────────────────────────────────

const projectPlaceholder = computed(() => {
  if (!currentEntry.value.pocketId) return 'Select pocket first'
  if (loadingProjects.value) return 'Loading projects...'
  return projects.value.length > 0 ? 'Select project' : 'No projects available'
})

const categoryPlaceholder = computed(() => {
  if (!currentEntry.value.projectId) return 'Select project first'
  if (loadingCategories.value) return 'Loading categories...'
  return categories.value.length > 0 ? 'Select category' : 'No categories available'
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeNumericInput(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(digits).toLocaleString('en-US') : ''
}

function getTypeBadgeClass(type: TransactionType): string {
  if (type === 'INCOMING') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  return 'border-rose-200 bg-rose-50 text-rose-700'
}

/**
 * Clear all form fields from a given field onward, based on the dependency order.
 * Each field depends on all fields before it, so changing one invalidates everything after it.
 */
const FIELD_ORDER = [
  'pocketId',
  'projectId',
  'categoryId',
  'amountInput',
  'date',
  'title',
  'description',
] as const
type FormField = (typeof FIELD_ORDER)[number]

function clearFrom(entry: TransactionDraft, field: FormField) {
  const startIndex = FIELD_ORDER.indexOf(field)
  for (let i = startIndex; i < FIELD_ORDER.length; i++) {
    const key = FIELD_ORDER[i]
    if (key) entry[key] = ''
  }
}

function resetForm() {
  entries.value = [createEmptyDraft()]
  activeEntryIndex.value = 0
  loadingCategories.value = false
  isSubmitting.value = false
}

// ─── Dialog Controls ──────────────────────────────────────────────────────────

function handleOpenChange(value: boolean) {
  open.value = value
  if (!value) resetForm()
}

function openDialog() {
  open.value = true
  if (!categoriesFetched) fetchCategories()
}

function closeDialog() {
  open.value = false
}

// ─── API Fetchers ─────────────────────────────────────────────────────────────

async function fetchProjectsByPocket(pocketId: string) {
  if (!pocketId || projectCache.value[pocketId]) return

  projectLoadingState.value[pocketId] = true

  try {
    const response = await api.get<ApiResponse<Project[]>>('/projects', {
      params: { pocket_id: pocketId },
    })
    projectCache.value[pocketId] = response.data.data ?? []
  } catch (error) {
    console.error('Error fetching projects:', error)
    toast.error('Failed to load projects')
  } finally {
    projectLoadingState.value[pocketId] = false
  }
}

async function fetchCategories() {
  loadingCategories.value = true

  try {
    const response = await api.get<ApiResponse<Category[]>>('/categories/')
    categories.value = response.data.data ?? []
    categoriesFetched = true
  } catch (error) {
    console.error('Error fetching categories:', error)
    toast.error('Failed to load categories')
  } finally {
    loadingCategories.value = false
  }
}

// ─── Field Handlers ───────────────────────────────────────────────────────────

function handlePocketChange(value: AcceptableValue) {
  const entry = currentEntry.value
  const next = typeof value === 'string' ? value : ''
  if (next === entry.pocketId) return

  entry.pocketId = next
  clearFrom(entry, 'projectId')

  if (next) fetchProjectsByPocket(next)
}

function handleProjectChange(value: AcceptableValue) {
  const entry = currentEntry.value
  const next = typeof value === 'string' ? value : ''
  if (next === entry.projectId) return

  entry.projectId = next
  clearFrom(entry, 'categoryId')
}

function handleCategoryChange(value: AcceptableValue) {
  const entry = currentEntry.value
  const next = typeof value === 'string' ? value : ''
  if (next === entry.categoryId) return

  entry.categoryId = next
  clearFrom(entry, 'amountInput')
}

function handleAmountChange(value: string | number) {
  const entry = currentEntry.value
  const raw = typeof value === 'number' ? String(value) : value
  const next = normalizeNumericInput(raw)
  if (next === entry.amountInput) return

  entry.amountInput = next
  clearFrom(entry, 'date')
}

function handleDateChange(value: string | number) {
  const entry = currentEntry.value
  const next = typeof value === 'string' ? value : String(value)
  if (next === entry.date) return

  entry.date = next
  clearFrom(entry, 'title')
}

function handleTitleChange(value: string | number) {
  const entry = currentEntry.value
  const next = typeof value === 'string' ? value : String(value)
  entry.title = next
  // description clears only if title becomes empty
  if (!next.trim()) entry.description = ''
}

function handleDescriptionChange(value: string | number) {
  currentEntry.value.description = typeof value === 'string' ? value : String(value)
}

function addTransactionEntry() {
  if (!canAddMoreEntries.value) {
    toast.error(`Maximum ${MAX_TRANSACTION_ENTRIES} transactions per create`)
    return
  }

  entries.value.push(createEmptyDraft())
  activeEntryIndex.value = entries.value.length - 1
}

function removeEntry(index: number) {
  if (entries.value.length === 1) return
  if (index < 0 || index >= entries.value.length) return

  entries.value.splice(index, 1)

  if (activeEntryIndex.value > index) {
    activeEntryIndex.value -= 1
    return
  }

  if (activeEntryIndex.value >= entries.value.length) {
    activeEntryIndex.value = entries.value.length - 1
  }
}

function selectEntry(index: number) {
  if (index < 0 || index >= entries.value.length) return

  activeEntryIndex.value = index
  const selectedPocketId = entries.value[index]?.pocketId
  if (selectedPocketId) fetchProjectsByPocket(selectedPocketId)
}

// ─── Submit ───────────────────────────────────────────────────────────────────

async function handleSubmit() {
  if (!areAllEntriesValid.value) {
    toast.error('Please complete all required fields')
    return
  }

  isSubmitting.value = true

  const payload: CreateTransactionPayload[] = entries.value.map((entry) => ({
    pocket_id: entry.pocketId,
    project_id: entry.projectId,
    category_id: entry.categoryId,
    amount: Number(entry.amountInput.replace(/,/g, '')) || 0,
    date: entry.date,
    title: entry.title.trim(),
    description: entry.description.trim() || undefined,
  }))

  try {
    await api.post<ApiResponse<unknown>>('/transactions', payload)
    toast.success(
      `${entries.value.length} transaction${entries.value.length > 1 ? 's' : ''} created successfully`,
    )
    emit('success')
    closeDialog()
  } catch (error) {
    console.error('Error creating transaction:', error)
    toast.error('Failed to create transaction')
  } finally {
    isSubmitting.value = false
  }
}

// ─── Expose ───────────────────────────────────────────────────────────────────

defineExpose({ open: openDialog })
</script>
