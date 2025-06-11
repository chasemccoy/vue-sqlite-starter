<template>
  <UTable v-if="data" :data="data" />
</template>

<script setup lang="ts">
import useRecords from '@app/composables/useRecords';

const { data } = useRecords()
</script>