import useApiClient from '@app/composables/useApiClient';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { MediaUploadInput } from '@shared/types/api';
import type { DeleteMediaAPIResponse, InsertMediaAPIResponse } from '@db/queries/media';

export default function useMedia() {
	const { fetch } = useApiClient();
	const queryClient = useQueryClient();

	function uploadMedia() {
		return useMutation({
			mutationFn: ({ file, ...uploadData }: { file: File } & MediaUploadInput) => {
				const formData = new FormData();
				formData.append('file', file);

				if (uploadData.recordId) {
					formData.append('recordId', uploadData.recordId.toString());
				}

				if (uploadData.altText) {
					formData.append('altText', uploadData.altText);
				}

				return fetch<InsertMediaAPIResponse>(
					'/media',
					{
						method: 'POST',
						body: formData,
					},
					true,
				);
			},
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['get-record'] });
				queryClient.invalidateQueries({ queryKey: ['get-record-by-slug'] });
			},
		});
	}

	function deleteMedia() {
		return useMutation({
			mutationFn: (id: number) =>
				fetch<DeleteMediaAPIResponse>(`/media/${id}`, {
					method: 'DELETE',
				}),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['get-record'] });
				queryClient.invalidateQueries({ queryKey: ['get-record-by-slug'] });
			},
		});
	}

	return {
		uploadMedia,
		deleteMedia,
	};
}
