import useApiClient, { ApiEndpoints } from '@app/composables/useApiClient';
import { useQuery } from '@tanstack/vue-query';

export default function useRecords() {
	const { fetch } = useApiClient();

	return useQuery({
		queryKey: ['records'],
		queryFn: () => fetch(ApiEndpoints.records),
	});
}
