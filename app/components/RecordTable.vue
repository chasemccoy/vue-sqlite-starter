<template>
  table
</template>

<script setup lang="ts">
import useRecord from '@app/composables/useRecord';
import useRecords from '@app/composables/useRecords';
import { ref, watch } from 'vue';

const { data, isLoading, error } = useRecords()

const id = ref(3)
const { data: recordData, error: recordError } = useRecord(id)

watch([data, recordData, recordError], () => {
  if (!data.value) return

  const { ids } = data.value
  console.log(ids[0].id);

  console.log(recordData.value, recordError.value)
})


</script>