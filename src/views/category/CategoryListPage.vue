<template>
  <section class="space-y-6">
    <PageTopBar
      title="Categories"
      eyebrow="Workspace"
      description="Manage incoming and outcoming transaction categories."
      :show-back="false"
    >
      <template #actions>
        <Button variant="outline" @click="handleCreateCategoryClick">Create Category</Button>
      </template>
    </PageTopBar>

    <CategoryTable :rows="categories" :loading="loadingCategories" />

    <CreateCategoryDialog
      v-model:open="isCreateCategoryDialogOpen"
      @created="handleCategoryCreated"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api/axios'
import CreateCategoryDialog from '@/components/features/category/CreateCategoryDialog.vue'
import CategoryTable from '@/components/features/category/CategoryTable.vue'
import PageTopBar from '@/components/layout/PageTopBar.vue'
import { Button } from '@/components/ui/button'
import type { ApiResponse, Category } from '@/types'
import { toast } from 'vue-sonner'

const categories = ref<Category[]>([])
const loadingCategories = ref(false)
const isCreateCategoryDialogOpen = ref(false)

async function fetchCategories() {
  loadingCategories.value = true

  try {
    const response = await api.get<ApiResponse<Category[]>>('/categories')
    categories.value = response.data.data ?? []
  } catch (error) {
    categories.value = []
    console.error('Error fetching categories:', error)
    toast.error('Failed to load categories')
  } finally {
    loadingCategories.value = false
  }
}

function handleCreateCategoryClick() {
  isCreateCategoryDialogOpen.value = true
}

async function handleCategoryCreated() {
  await fetchCategories()
}

onMounted(async () => {
  await fetchCategories()
})
</script>
