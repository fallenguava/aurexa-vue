<template>
  <section class="space-y-6">
    <PageTopBar
      title="Pockets"
      eyebrow="Workspace"
      description="Manage all your saving pockets."
      :show-back="false"
    >
      <template #actions>
        <Button variant="outline" @click="handleCreatePocketClick">Create Pocket</Button>
      </template>
    </PageTopBar>

    <PocketTable :rows="pockets" :loading="loading" />

    <CreatePocketDialog v-model:open="isCreatePocketDialogOpen" @created="handlePocketCreated" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CreatePocketDialog from '@/components/features/pocket/CreatePocketDialog.vue'
import PocketTable from '@/components/features/pocket/PocketTable.vue'
import PageTopBar from '@/components/layout/PageTopBar.vue'
import { Button } from '@/components/ui/button'
import api from '@/api/axios'
import type { ApiResponse, Pocket } from '@/types'
import { toast } from 'vue-sonner'

const loading = ref(false)
const pockets = ref<Pocket[]>([])
const isCreatePocketDialogOpen = ref(false)

const handleCreatePocketClick = () => {
  isCreatePocketDialogOpen.value = true
}

const handlePocketCreated = async () => {
  await fetchPockets()
}

const fetchPockets = async () => {
  loading.value = true

  try {
    const response = await api.get<ApiResponse<Pocket[]>>('/pockets')
    pockets.value = response.data.data
    console.log('Fetched pockets:', pockets.value)
  } catch (error) {
    console.error('Error fetching pockets:', error)
    toast.error('Failed to load pockets')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPockets()
})
</script>
