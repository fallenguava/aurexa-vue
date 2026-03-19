<template>
  <section class="space-y-6">
    <PageTopBar
      title="Projects"
      eyebrow="Workspace"
      description="Browse projects by selecting a pocket first."
      :show-back="false"
    >
      <template #actions>
        <Button variant="outline" @click="handleCreateProjectClick">Create Project</Button>
      </template>
    </PageTopBar>

    <ProjectPocketFilter v-model="selectedPocketId" :pockets="pockets" :loading="loadingPockets" />

    <ProjectTable
      :rows="projects"
      :loading="loadingProjects"
      :has-pocket-selected="Boolean(selectedPocketId)"
      :page="page"
      :total-pages="totalPages"
      @change-page="handlePageChange"
    />

    <CreateProjectDialog
      v-model:open="isCreateProjectDialogOpen"
      :pockets="pockets"
      :initial-pocket-id="selectedPocketId"
      @created="handleProjectCreated"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import api from '@/api/axios'
import CreateProjectDialog from '@/components/features/project/CreateProjectDialog.vue'
import ProjectPocketFilter from '@/components/features/project/ProjectPocketFilter.vue'
import ProjectTable from '@/components/features/project/ProjectTable.vue'
import PageTopBar from '@/components/layout/PageTopBar.vue'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/composables/usePagination'
import type { ApiResponse, PaginationMeta, Pocket, Project } from '@/types'
import { toast } from 'vue-sonner'

const pockets = ref<Pocket[]>([])
const loadingPockets = ref(false)
const selectedPocketId = ref('')
const projects = ref<Project[]>([])
const loadingProjects = ref(false)
const isCreateProjectDialogOpen = ref(false)
const { page, limit, totalPages, applyMeta, setPage, resetPage, resetPagination } =
  usePagination(10)

async function fetchPockets() {
  loadingPockets.value = true

  try {
    const response = await api.get<ApiResponse<Pocket[]>>('/pockets')
    pockets.value = response.data.data ?? []
  } catch (error) {
    console.error('Error fetching pockets:', error)
    toast.error('Failed to load pockets for project filter')
  } finally {
    loadingPockets.value = false
  }
}

async function fetchProjects() {
  if (!selectedPocketId.value) {
    projects.value = []
    resetPagination()
    return
  }

  loadingProjects.value = true

  try {
    const response = await api.get<ApiResponse<Project[], Partial<PaginationMeta>>>('/projects', {
      params: {
        pocket_id: selectedPocketId.value,
        page: page.value,
        limit: limit.value,
      },
    })

    projects.value = response.data.data ?? []
    applyMeta(response.data.meta)
  } catch (error) {
    projects.value = []
    totalPages.value = 1
    console.error('Error fetching projects:', error)
    toast.error('Failed to load projects')
  } finally {
    loadingProjects.value = false
  }
}

function handlePageChange(nextPage: number) {
  setPage(nextPage)
}

function handleCreateProjectClick() {
  isCreateProjectDialogOpen.value = true
}

async function handleProjectCreated(project: Project) {
  if (selectedPocketId.value !== project.pocket_id) {
    selectedPocketId.value = project.pocket_id
    return
  }

  resetPage()
  await fetchProjects()
}

watch(selectedPocketId, () => {
  resetPage()
  fetchProjects()
})

watch(page, () => {
  fetchProjects()
})

onMounted(async () => {
  await fetchPockets()
})
</script>
