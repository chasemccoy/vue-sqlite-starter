<template>
  <DataTable v-if="data" :value="data" size="small">
    <Column field="title" header="Title">
      <template #body="slotProps">
        <RouterLink :to="`/edit/${slotProps.data.id}`">
          {{ slotProps.data.title }}
        </RouterLink>
      </template>
    </Column>
    <Column field="url" header="URL"></Column>
    <Column field="recordUpdatedAt" header="Updated"></Column>
    <Column field="recordCreatedAt" header="Created"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import useRecords from '@app/composables/useRecords';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { RouterLink } from 'vue-router';

const { data } = useRecords()
</script>