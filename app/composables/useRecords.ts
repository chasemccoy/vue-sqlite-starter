import useApiClient, { ApiEndpoints } from '@app/composables/useApiClient';
import { useQuery } from '@tanstack/vue-query';
import type { ListRecordsAPIResponse } from '@db/queries/records';

export default function useRecords() {
	const { fetch } = useApiClient();

	return useQuery({
		queryKey: ['list-records'],
		queryFn: () => fetch<ListRecordsAPIResponse>(ApiEndpoints.records),
	});
}
