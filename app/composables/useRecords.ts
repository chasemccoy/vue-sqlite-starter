import useApiClient, { ApiEndpoints } from '@app/composables/useApiClient';
import { useQuery } from '@tanstack/vue-query';
import type { ListRecordsAPIResponse } from '@db/queries/records';
import type { ListRecordsInput } from '@shared/types/api';

export default function useRecords(options?: ListRecordsInput) {
	const { fetch } = useApiClient();

	return useQuery({
		queryKey: ['list-records'],
		queryFn: () =>
			fetch<ListRecordsAPIResponse>(ApiEndpoints.records, {
				method: 'POST',
				body: JSON.stringify(options),
			}),
	});
}
