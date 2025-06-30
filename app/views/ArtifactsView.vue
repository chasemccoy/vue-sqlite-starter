<template>
  <RecordTable
    v-if="data"
    v-model="data"
    :hideColumns="['id', 'type']"
  />
</template>

<script setup lang="ts">
import RecordTable from '@app/components/RecordTable.vue';
import useRecords from '@app/composables/useRecords';

const { data } = useRecords({
  limit: 300,
  filters: {
    type: 'artifact',
    hasParent: false,
  },
  orderBy: [
    {
      field: 'recordCreatedAt',
      direction: 'desc',
    },
  ],
});
</script>
