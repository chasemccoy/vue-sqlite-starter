import useApiClient from '@app/composables/useApiClient';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { GetRecordAPIResponse, UpsertRecordAPIResponse } from '@db/queries/records';
import type { Ref } from 'vue';
import type { DbId } from '@shared/types/api';
import type { RecordInsert } from '@db/schema';

export default function useRecord() {
	const { fetch } = useApiClient();

	function getRecord(id: Ref<DbId>) {
		return useQuery({
			queryKey: ['get-record', id],
			queryFn: () => fetch<GetRecordAPIResponse>(`/record/${id.value}`),
		});
	}

	function upsertRecord() {
		return useMutation({
			mutationFn: (data: RecordInsert) =>
				fetch<UpsertRecordAPIResponse>(`/record`, {
					method: 'PUT',
					body: JSON.stringify(data),
				}),
		});
	}

	return {
		getRecord,
		upsertRecord,
	};
}
