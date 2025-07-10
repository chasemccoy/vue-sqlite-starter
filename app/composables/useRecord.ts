import useApiClient from '@app/composables/useApiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type {
  DeleteRecordAPIResponse,
  GetRecordAPIResponse,
  LinksForRecordAPIResponse,
  UpsertRecordAPIResponse,
} from '@db/queries/records';
import { toValue, type MaybeRef } from 'vue';
import type { DbId } from '@shared/types/api';
import type { RecordInsert } from '@db/schema';

type OptionalMaybeRef<T> = MaybeRef<T | null>;

export default function useRecord() {
  const { fetch } = useApiClient();
  const queryClient = useQueryClient();

  function getRecord(id: OptionalMaybeRef<DbId>, enabled: MaybeRef<boolean> = true) {
    return useQuery({
      queryKey: ['get-record', id],
      queryFn: () => fetch<GetRecordAPIResponse>(`/record/${toValue(id)}`),
      enabled,
    });
  }

  function getRecordLinks(id: OptionalMaybeRef<DbId>, enabled: MaybeRef<boolean> = true) {
    return useQuery({
      queryKey: ['get-record-links', id],
      queryFn: () => fetch<LinksForRecordAPIResponse>(`/record/${toValue(id)}/links`),
      enabled,
    });
  }

  function upsertRecord() {
    return useMutation({
      mutationFn: (data: RecordInsert) =>
        fetch<UpsertRecordAPIResponse>(`/record`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['list-records'] });
      },
    });
  }

  function deleteRecord() {
    return useMutation({
      mutationFn: (id: number) =>
        fetch<DeleteRecordAPIResponse>(`/record/${id}`, {
          method: 'DELETE',
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['list-records'] });
      },
    });
  }

  return {
    getRecord,
    getRecordLinks,
    upsertRecord,
    deleteRecord,
  };
}
