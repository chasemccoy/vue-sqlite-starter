<template>
  <RecordTable
    v-if="data"
    v-model="data"
    :hideColumns="['slug']"
  />
</template>

<script setup lang="ts">
import RecordTable from '@app/components/RecordTable.vue';
import useRecords from '@app/composables/useRecords';

const { data } = useRecords({
  limit: 200
})
</script>