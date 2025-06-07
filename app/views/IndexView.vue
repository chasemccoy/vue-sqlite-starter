<template>
  <DataTable v-if="data" :value="data" size="small">
    <Column field="title" header="Title"></Column>
    <Column field="slug" header="Slug"></Column>
    <Column field="url" header="URL"></Column>
    <Column field="recordCreatedAt" header="Created"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import useRecords from '@app/composables/useRecords';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const { data } = useRecords()
</script>