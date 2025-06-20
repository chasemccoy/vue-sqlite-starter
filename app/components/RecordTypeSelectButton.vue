<template>
  <UTabs
    v-model="modelValue"
    class="RecordTypeSelectButton"
    :content="false"
    :items="options"
  />
</template>

<script setup lang="ts">
import { getIconForRecordType } from '@app/utils';
import { capitalize } from '@shared/lib/formatting';
import { recordTypeEnum, type RecordType } from '@shared/types';

const modelValue = defineModel<RecordType>({ required: true });

const options = [...recordTypeEnum]
  .sort()
  .map((type) => ({ label: capitalize(type), value: type, icon: getIconForRecordType(type) }));
</script>
