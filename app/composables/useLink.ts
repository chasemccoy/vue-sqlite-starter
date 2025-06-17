import useApiClient from '@app/composables/useApiClient';
import type { DeleteLinkQueryResponse, UpsertLinkAPIResponse } from '@db/queries/links';
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

	function deleteLink() {
		return useMutation({
			mutationFn: (id: number) =>
				fetch<DeleteLinkQueryResponse>(`/link/${id}`, {
					method: 'DELETE',
				}),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['get-record'] });
				queryClient.invalidateQueries({ queryKey: ['get-record-by-slug'] });
				queryClient.invalidateQueries({ queryKey: ['get-record-links'] });
			},
		});
	}

	return {
		upsertLink,
		deleteLink,
	};
}
