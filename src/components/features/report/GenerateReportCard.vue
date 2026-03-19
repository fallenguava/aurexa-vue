<template>
  <div class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <div class="space-y-1">
      <h3 class="text-base font-semibold text-zinc-900">Generate Monthly Report</h3>
      <p class="text-sm text-zinc-500">
        Choose a pocket, month, and year to generate a PDF report.
      </p>
    </div>

    <div class="space-y-2">
      <p class="text-sm font-medium text-zinc-700">Choose pocket</p>
      <SelectPocketBadge
        v-model="selectedPocketId"
        :pockets="pockets"
        :loading="loadingPockets"
        :disabled="isGenerating"
      />
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="report-month" class="text-sm font-medium text-zinc-700">Month</label>
        <Input
          id="report-month"
          v-model="monthInput"
          type="number"
          inputmode="numeric"
          min="1"
          max="12"
          :disabled="isGenerating"
          placeholder="1 - 12"
        />
      </div>

      <div class="space-y-2">
        <label for="report-year" class="text-sm font-medium text-zinc-700">Year</label>
        <Input
          id="report-year"
          v-model="yearInput"
          type="number"
          inputmode="numeric"
          min="2000"
          max="2100"
          :disabled="isGenerating"
          placeholder="2000 - 2100"
        />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <Button type="button" :disabled="isGenerating || !isFormValid" @click="handleGenerate">
        {{ isGenerating ? 'Generating...' : 'Generate Report' }}
      </Button>
    </div>

    <p class="text-xs text-zinc-500">Report URL is temporary signed URL from backend.</p>

    <Dialog :open="isDownloadDialogOpen" @update:open="handleDownloadDialogOpenChange">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Ready</DialogTitle>
          <DialogDescription>
            This signed URL is temporary. Download now. You need to regenerate if you close this
            dialog.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" @click="handleCloseDownloadDialog">Close</Button>
          <Button type="button" @click="downloadAndInvalidate">Download Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
import type { GenerateMonthlyReportQuery, Pocket } from '@/types'

const now = new Date()

const props = withDefaults(
  defineProps<{
    pockets: Pocket[]
    loadingPockets?: boolean
    isGenerating?: boolean
    reportUrl?: string
  }>(),
  {
    loadingPockets: false,
    isGenerating: false,
    reportUrl: '',
  },
)

const emit = defineEmits<{
  (e: 'generate', query: GenerateMonthlyReportQuery): void
  (e: 'clear-report-url'): void
}>()

const selectedPocketId = ref('')
const monthInput = ref(String(now.getMonth() + 1))
const yearInput = ref(String(now.getFullYear()))
const isDownloadDialogOpen = ref(false)

const parsedMonth = computed(() => Number(monthInput.value))
const parsedYear = computed(() => Number(yearInput.value))

const isFormValid = computed(
  () =>
    Boolean(selectedPocketId.value) &&
    Number.isInteger(parsedMonth.value) &&
    parsedMonth.value >= 1 &&
    parsedMonth.value <= 12 &&
    Number.isInteger(parsedYear.value) &&
    parsedYear.value >= 2000 &&
    parsedYear.value <= 2100,
)

function handleGenerate() {
  if (!isFormValid.value) return

  emit('generate', {
    pocket_id: selectedPocketId.value,
    month: String(parsedMonth.value),
    year: String(parsedYear.value),
  })
}

function invalidateReportUrl() {
  emit('clear-report-url')
}

function handleDownloadDialogOpenChange(value: boolean) {
  if (!value && props.reportUrl) {
    invalidateReportUrl()
  }

  isDownloadDialogOpen.value = value
}

function handleCloseDownloadDialog() {
  isDownloadDialogOpen.value = false
  invalidateReportUrl()
}

function downloadAndInvalidate() {
  if (!props.reportUrl) return
  window.open(props.reportUrl, '_blank', 'noopener,noreferrer')
  isDownloadDialogOpen.value = false
  invalidateReportUrl()
}

watch(
  () => props.reportUrl,
  (nextUrl) => {
    isDownloadDialogOpen.value = Boolean(nextUrl)
  },
)
</script>
