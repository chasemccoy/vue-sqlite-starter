import useApiClient from '@app/composables/useApiClient';
import { useQuery } from '@tanstack/vue-query';
import type { GetRecordAPIResponse } from '@db/queries/records';
import type { Ref } from 'vue';
import type { DbId } from '@shared/types/api';

export default function useRecord(id: Ref<DbId>) {
	const { fetch } = useApiClient();

	return useQuery({
		queryKey: ['get-record'],
		queryFn: () => fetch<GetRecordAPIResponse>(`/record/${id.value}`),
	});
}
