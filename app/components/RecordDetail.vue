<template>
  <div
    v-if="modelValue"
    class="RecordDetail"
  >
    <div class="RecordDetail__badges">
      <UBadge
        v-if="modelValue.isCurated !== true"
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
        icon="i-lucide-inbox"
        label="Needs curating"
      />

      <UBadge
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
        :icon="getIconForRecordType(modelValue.type)"
      >
        {{ capitalize(modelValue.type) }}
      </UBadge>

      <UBadge
        v-if="modelValue.source && modelValue.source !== 'manual'"
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
      >
        {{ capitalize(modelValue.source) }}
      </UBadge>

      <UBadge
        v-if="modelValue"
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
        icon="i-lucide-hash"
      >
        {{ modelValue.id }}
      </UBadge>
    </div>

    <UFormField aria-label="Title">
      <UTextarea
        v-model.trim="modelValue.title"
        type="text"
        size="lg"
        variant="none"
        placeholder="Untitled record"
        :rows="1"
        :ui="{
          base: 'RecordDetail__titleInput',
        }"
        autoresize
      />
    </UFormField>

    <div
      v-if="parent || creator"
      class="RecordDetail__byline"
    >
      <span
        v-if="parent"
        class="RecordDetail__bylineItem"
      >
        from
        <UButton
          icon="i-lucide-workflow"
          size="sm"
          color="neutral"
          variant="link"
          class="RecordDetail__bylineButton"
          :to="`/${parent.slug}`"
        >
          <span>{{ parent.title }}</span>
        </UButton>
      </span>

      <span
        v-if="creator"
        class="RecordDetail__bylineItem"
      >
        by
        <UButton
          icon="i-lucide-user-pen"
          size="sm"
          color="neutral"
          variant="link"
          class="RecordDetail__bylineButton"
          :to="`/${creator.slug}`"
        >
          <span>{{ creator.title }}</span>
        </UButton>
      </span>
    </div>

    <div class="RecordDetail__combinedFields">
      <UFormField
        aria-label="Summary"
        size="xs"
      >
        <UTextarea
          v-model.trim="modelValue.summary"
          size="lg"
          placeholder="A brief summary of this record"
          variant="outline"
          :rows="1"
          autoresize
        />
      </UFormField>

      <UButtonGroup>
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          label="URL"
          class="RecordDetail__badge"
        />

        <UInput
          v-model="modelValue.url"
          class="RecordDetail__input"
          variant="outline"
          placeholder="example.com"
        >
          <template
            v-if="modelValue.url"
            #trailing
          >
            <UTooltip text="Open source URL">
              <UButton
                variant="link"
                size="sm"
                icon="i-lucide-external-link"
                aria-label="Open source URL"
                target="_blank"
                :to="modelValue.url"
              />
            </UTooltip>
          </template>
        </UInput>
      </UButtonGroup>

      <SlugField v-model="modelValue.slug" />

      <UButtonGroup>
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          label="Created"
          class="RecordDetail__badge"
        />

        <UInput
          v-model="createdAt"
          class="RecordDetail__input"
          variant="outline"
          placeholder="May 4, 1995"
          readonly
        />
      </UButtonGroup>

      <UButtonGroup>
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          label="Saved"
          class="RecordDetail__badge"
        />

        <UInput
          v-model="capturedAt"
          class="RecordDetail__input"
          variant="outline"
          placeholder="May 4, 2025"
          readonly
        />
      </UButtonGroup>
    </div>

    <div class="RecordDetail__actions">
      <RelationshipSelect
        :sourceRecordId="modelValue.id"
        @createLink="handleCreateLink"
      />

      <FileUploadButton @fileUpload="({ file, altText }) => emit('mediaUpload', { file, altText })" />

      <USwitch
        v-model="modelValue.isCurated"
        label="Curated"
        size="lg"
        class="RecordDetail__curatedSwitch"
      />
    </div>

    <UFormField
      aria-label="Content"
      size="xs"
      class="RecordDetail__content"
    >
      <UTextarea
        v-model.trim="modelValue.content"
        size="xl"
        placeholder="Main content of the record"
        variant="none"
        :rows="1"
        autoresize
      />
    </UFormField>

    <AttachmentGallery
      v-model="modelValue.media"
      @mediaUpload="({ file, altText }) => emit('mediaUpload', { file, altText })"
      @mediaDelete="({ mediaId }) => emit('mediaDelete', { mediaId })"
    />

    <div v-if="children && children.length > 0">
      <h2 class="RecordDetail__sectionTitle">
        Children
      </h2>

      <ul class="RecordDetail__children">
        <li
          v-for="child in children"
          :key="child.id"
        >
          <blockquote>
            {{ child.source.content }}
          </blockquote>
        </li>
      </ul>
    </div>


    <UFormField
      label="Notes"
      size="xs"
    >
      <UTextarea
        v-model.trim="modelValue.notes"
        size="lg"
        placeholder="Additional notes"
        variant="subtle"
        :rows="1"
        autoresize
      />
    </UFormField>

    <div class="RecordDetail__links">
      <div
        v-if="outgoingLinks && outgoingLinks.length > 0"
        class="RecordDetail__section"
      >
        <h2 class="RecordDetail__sectionTitle">
          <UIcon name="i-lucide-arrow-up-right" /> Outgoing links ({{ outgoingLinks.length }})
        </h2>
        <ul class="RecordDetail__list">
          <li
            v-for="link in outgoingLinks"
            :key="link.id"
          >
            <RecordLink
              :modelValue="link.targetId"
              :relationship="link.predicate.name"
              :predicate="link.predicate"
              @updatePredicate="(predicate) => handleUpdatePredicate(link, predicate)"
              @deleteLink="() => handleDeleteLink(link.id)"
            />
          </li>
        </ul>
      </div>

      <div
        v-if="incomingLinks && incomingLinks.length > 0"
        class="RecordDetail__section"
      >
        <h2 class="RecordDetail__sectionTitle">
          <UIcon name="i-lucide-arrow-down-right" /> Incoming links ({{ incomingLinks.length }})
        </h2>
        <ul class="RecordDetail__list">
          <li
            v-for="link in incomingLinks"
            :key="link.id"
          >
            <RecordLink
              v-model:predicate="link.predicate"
              linkDirection="incoming"
              :modelValue="link.sourceId"
              :relationship="link.predicate.inverse?.name"
              @updatePredicate="(predicate) => handleUpdatePredicate(link, predicate)"
              @deleteLink="() => handleDeleteLink(link.id)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttachmentGallery from '@app/components/AttachmentGallery.vue';
import RelationshipSelect from '@app/components/RelationshipSelect.vue';
import RecordLink from '@app/components/RecordLink.vue';
import type {
  GetRecordBySlugQueryResponse,
  LinksForRecordQueryResponse,
} from '@db/queries/records';
import { capitalize, formatDate } from '@shared/lib/formatting';
import { computed } from 'vue';
import type { LinkInsert, LinkSelect, PredicateSelect } from '@db/schema';
import { getIconForRecordType } from '@app/utils';
import type { DbId } from '@shared/types/api';
import SlugField from '@app/components/SlugField.vue';
import FileUploadButton from '@app/components/FileUploadButton.vue';

const modelValue = defineModel<GetRecordBySlugQueryResponse>({ required: true });

const emit = defineEmits<{
  mediaUpload: [{ file: File; altText?: string }];
  mediaDelete: [{ mediaId: number }];
  createLink: [{ link: LinkInsert }]
  deleteLink: [{ linkId: DbId }],
  updatePredicate: [{ link: LinkSelect; predicate: PredicateSelect }]
}>();

const { links } = defineProps<{
  links?: LinksForRecordQueryResponse;
}>();

const capturedAt = computed(() => {
  if (!modelValue.value) return null;
  return formatDate(new Date(modelValue.value.recordCreatedAt));
});

const createdAt = computed(() => {
  if (!modelValue.value?.contentCreatedAt) return null;
  return formatDate(new Date(modelValue.value.contentCreatedAt));
});

const incomingLinks = computed(() => links?.incomingLinks ?? null);
const outgoingLinks = computed(() => links?.outgoingLinks ?? null);

const parent = computed(() => {
  if (!outgoingLinks.value) return null;

  return outgoingLinks.value.find((link) => link.predicate.type === 'containment')?.target ?? null;
});

const creator = computed(() => {
  if (!outgoingLinks.value) return null;

  return outgoingLinks.value.find((link) => link.predicate.slug === 'created_by')?.target ?? null;
});

const children = computed(() => {
  if (!incomingLinks.value) return null;

  return incomingLinks.value.filter((link) => link.predicate.type === 'containment');
})

function handleCreateLink({
  targetRecordId,
  predicateId,
}: {
  targetRecordId: number;
  predicateId: number;
}) {
  if (!modelValue.value) return;

  emit('createLink', {
    link: {
      sourceId: modelValue.value.id,
      targetId: targetRecordId,
      predicateId,
    },
  });
}

function handleUpdatePredicate(link: LinkSelect, predicate: PredicateSelect) {
  emit('updatePredicate', { link, predicate });
}

function handleDeleteLink(linkId: DbId) {
  emit('deleteLink', { linkId });
}
</script>

<style scoped>
.RecordDetail {
  display: grid;
  gap: 1rem;
}

.RecordDetail__badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.RecordDetail__title {
  font-size: 1.5rem;
}

:deep(.RecordDetail__titleInput) {
  font-size: 1.5rem;
  margin-inline: -12px;
  padding-block: 0;
}

.RecordDetail__byline {
  display: inline-flex;
  margin-top: -12px;
}

.RecordDetail__bylineItem {
  display: flex;
  align-items: center;
  color: var(--ui-text-muted);
  font-size: 0.8rem;
}

:deep(.RecordDetail__bylineButton) {
  max-width: 250px;
  margin-left: -2px;

  & :deep(span) {
    min-width: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.RecordDetail__content {
  margin-inline: -12px;
}

.RecordDetail__children {
  font-size: 1rem;

  &>*+* {
    border-top: 1px dashed var(--ui-border);
    padding-top: 16px;
    margin-top: 16px;
  }

  blockquote {
    padding-left: 20px;
    position: relative;
  }

  blockquote::before {
    content: "";
    width: 5px;
    height: 100%;
    background-color: var(--ui-border);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 8px;
  }
}

.RecordDetail__links {
  margin-top: 16px;
  display: grid;
  gap: 2rem;
  align-items: start;
}

.RecordDetail__section {
  display: grid;
  gap: 0.25rem;
}

.RecordDetail__sectionTitle {
  font-size: 0.75rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  color: var(--ui-text-dimmed);
}

.RecordDetail__badge {
  width: fit-content;

  & :deep(svg) {
    width: 12px;
    height: 12px;
    color: var(--ui-text-muted);
  }
}

.RecordDetail__list {
  li+li {
    margin-top: 1rem;
  }
}

.RecordDetail__input {
  & :deep(input) {
    color: var(--ui-text-muted);
  }

  & :deep(input:hover),
  & :deep(input:focus) {
    color: var(--ui-text);
  }

  & :deep(svg) {
    width: 12px;
    height: 12px;
    color: var(--ui-text-muted);
  }
}

.RecordDetail__combinedFields {
  display: grid;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--ui-border);

  --ui-radius: 0;

  & :deep(input),
  & :deep(textarea),
  & :deep(span) {
    box-shadow: none;
  }

  &>*+* {
    border-top: 1px solid var(--ui-border);
  }
}

.RecordDetail__combinedFields .RecordDetail__badge {
  min-width: 72px;
}

.RecordDetail__actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: -4px;
}

.RecordDetail__curatedSwitch {
  margin-left: 4px;
}
</style>
