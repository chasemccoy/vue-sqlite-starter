<template>
  <DataTable v-if="data" :value="data" size="small" showGridlines>
    <Column field="title" header="Title">
      <template #body="slotProps">
        <RouterLink :to="`/edit/${slotProps.data.id}`">
          {{ slotProps.data.title }}
        </RouterLink>
      </template>
    </Column>
    <Column field="type" header="Type">
      <template #body="slotProps">
        <Tag :value="capitalize(slotProps.data.type)" />
      </template>
    </Column>
    <Column field="url" header="URL"></Column>
    <Column field="content" header="Content" />
    <Column field="recordUpdatedAt" header="Updated" />
    <Column field="recordCreatedAt" header="Created" />
  </DataTable>
</template>

<script setup lang="ts">
import useRecords from '@app/composables/useRecords';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { RouterLink } from 'vue-router';
import Tag from 'primevue/tag';
import { capitalize } from '@shared/lib/formatting';

const { data } = useRecords()
</script>