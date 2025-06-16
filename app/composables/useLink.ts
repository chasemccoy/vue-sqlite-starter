import useApiClient from '@app/composables/useApiClient';
import type { UpsertLinkAPIResponse } from '@db/queries/links';
import type { LinkInsert } from '@db/schema';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

export default function useLink() {
	const { fetch } = useApiClient();
	const queryClient = useQueryClient();

	function upsertLink() {
		return useMutation({
			mutationFn: (data: LinkInsert) =>
				fetch<UpsertLinkAPIResponse>(`/link`, {
					method: 'PUT',
					body: JSON.stringify(data),
				}),
			onSuccess: ({ sourceId }) => {
				queryClient.invalidateQueries({ queryKey: ['get-record', sourceId] });
				queryClient.invalidateQueries({ queryKey: ['get-record-by-slug', sourceId] });
				queryClient.invalidateQueries({ queryKey: ['get-record-links', sourceId] });
			},
		});
	}

	return {
		upsertLink,
	};
}
