<template>
  <section class="space-y-6">
    <PageTopBar
      title="Reports"
      eyebrow="Workspace"
      description="Generate monthly financial reports and download signed PDF URLs."
      :show-back="false"
    />

    <GenerateReportCard
      :pockets="pockets"
      :loading-pockets="loadingPockets"
      :is-generating="isGenerating"
      :report-url="reportUrl"
      @generate="handleGenerateReport"
      @clear-report-url="handleClearReportUrl"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api/axios'
import GenerateReportCard from '@/components/features/report/GenerateReportCard.vue'
import PageTopBar from '@/components/layout/PageTopBar.vue'
import type {
  ApiResponse,
  GenerateMonthlyReportQuery,
  GenerateMonthlyReportResult,
  Pocket,
} from '@/types'
import { toast } from 'vue-sonner'

const pockets = ref<Pocket[]>([])
const loadingPockets = ref(false)
const isGenerating = ref(false)
const reportUrl = ref('')

async function fetchPockets() {
  loadingPockets.value = true

  try {
    const response = await api.get<ApiResponse<Pocket[]>>('/pockets')
    pockets.value = response.data.data ?? []
  } catch (error) {
    console.error('Error fetching pockets:', error)
    toast.error('Failed to load pockets for report generator')
  } finally {
    loadingPockets.value = false
  }
}

async function handleGenerateReport(query: GenerateMonthlyReportQuery) {
  isGenerating.value = true
  reportUrl.value = ''

  try {
    const response = await api.get<ApiResponse<GenerateMonthlyReportResult>>('/reports/generate', {
      params: query,
    })

    reportUrl.value = response.data.data?.url ?? ''

    if (!reportUrl.value) {
      toast.error('Report generated but URL is missing')
      return
    }

    toast.success('Report generated successfully')
  } catch (error) {
    console.error('Error generating report:', error)
    toast.error('Failed to generate report')
  } finally {
    isGenerating.value = false
  }
}

function handleClearReportUrl() {
  reportUrl.value = ''
}

onMounted(async () => {
  await fetchPockets()
})
</script>
