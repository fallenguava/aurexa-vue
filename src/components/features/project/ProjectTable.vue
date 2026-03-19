<template>
  <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="3" class="py-8 text-center text-zinc-500">
            <LoadingIndicator class="text-lg" variant="dots" text="Loading..." />
          </TableCell>
        </TableRow>

        <TableRow v-else-if="!hasPocketSelected">
          <TableCell colspan="3" class="py-8 text-center text-zinc-500">
            Select a pocket to load projects.
          </TableCell>
        </TableRow>

        <TableRow v-else-if="rows.length === 0">
          <TableCell colspan="3" class="py-8 text-center text-zinc-500">
            No projects found for this pocket.
          </TableCell>
        </TableRow>

        <TableRow v-for="project in rows" v-else :key="project.id">
          <TableCell class="font-medium text-zinc-900">{{ project.name }}</TableCell>
          <TableCell class="text-zinc-600">{{
            formatDate(project.created_at, 'dateTime')
          }}</TableCell>
          <TableCell class="text-zinc-600">{{
            formatDate(project.updated_at, 'dateTime')
          }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/60 px-4 py-3">
      <p class="text-sm text-zinc-500">Page {{ page }} of {{ totalPages }}</p>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="loading || page <= 1 || !hasPocketSelected"
          @click="goToPage(page - 1)"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="loading || page >= totalPages || !hasPocketSelected"
          @click="goToPage(page + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { LoadingIndicator } from '@/components/ui/loading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDateFormatter } from '@/composables/useDateFormatter'
import type { Project } from '@/types'

const props = defineProps<{
  rows: Project[]
  loading: boolean
  hasPocketSelected: boolean
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'change-page', page: number): void
}>()

const { formatDate } = useDateFormatter('id-ID')

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > props.totalPages) return
  emit('change-page', nextPage)
}
</script>
