<template>
  <!-- TopBar component -->
  <PageTopBar :title="pocketDetails ? pocketDetails.name : 'Pocket Details'" back-link="/pockets" />
  <section class="space-y-6 mt-6">
    <div
      v-if="loading"
      class="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm"
    >
      <LoadingIndicator class="text-lg" variant="dots" text="Loading..." />
    </div>

    <PocketDetailCard v-else-if="pocketDetails" :pocket="pocketDetails" />

    <div
      v-else
      class="rounded-3xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500"
    >
      Pocket not found.
    </div>
  </section>
</template>
<script setup lang="ts">
import api from '@/api/axios'
import PocketDetailCard from '@/components/features/pocket/PocketDetailCard.vue'
import PageTopBar from '@/components/layout/PageTopBar.vue'
import LoadingIndicator from '@/components/ui/loading/LoadingIndicator.vue'
import type { ApiResponse, Pocket } from '@/types'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const loading = ref(false)

const pocketDetails = ref<Pocket | null>(null)

const fetchDetails = async () => {
  if (!id.value) {
    pocketDetails.value = null
    return
  }

  loading.value = true

  try {
    const response = await api.get<ApiResponse<Pocket>>(`/pockets/${id.value}`)
    pocketDetails.value = response.data.data
  } catch (error) {
    pocketDetails.value = null
    console.error('Error fetching pocket details:', error)
    toast.error('Failed to load pocket details')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetails()
})

watch(id, () => {
  fetchDetails()
})
</script>
