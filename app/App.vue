<template>
  <Button label="Click" />

  <RecordTable />

  <DataTable :value="products" table-style="min-width: 50rem">
    <Column field="code" header="Code" />
    <Column field="name" header="Name" />
    <Column field="category" header="Category" />
    <Column field="quantity" header="Quantity" />
  </DataTable>
</template>

<script async setup lang="ts">
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref } from 'vue';
import RecordTable from '@app/components/RecordTable.vue';

const products = ref([
  {
    code: '1',
    name: 'Product 1',
    category: 'Category 1',
    quantity: 10,
  },
]);
</script>
