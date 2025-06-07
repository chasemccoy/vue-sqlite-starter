<template>
  table
</template>

<script setup lang="ts">
import useRecords from '@app/composables/useRecords';
import { watch } from 'vue';

const { data, isLoading, error } = useRecords()

watch(data, () => {
  console.log(data.value);
})


</script>