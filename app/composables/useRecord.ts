import useApiClient from '@app/composables/useApiClient';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type {
	GetRecordAPIResponse,
	LinksForRecordAPIResponse,
	UpsertRecordAPIResponse,
} from '@db/queries/records';
import { toValue, type MaybeRef, type Ref } from 'vue';
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

	function getRecordBySlug(slug: Ref<string>) {
		return useQuery({
			queryKey: ['get-record-by-slug', slug],
			queryFn: () => fetch<GetRecordAPIResponse>(`/record/slug/${slug.value}`),
		});
	}

	function getRecordTree(id: MaybeRef<DbId>, enabled: MaybeRef<boolean>) {
		return useQuery({
			queryKey: ['get-record-tree', id],
			queryFn: () => fetch<GetRecordAPIResponse>(`/record/${toValue(id)}/tree`),
			enabled,
		});
	}

	function getRecordLinks(id: MaybeRef<DbId>, enabled: MaybeRef<boolean>) {
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
		});
	}

	return {
		getRecord,
		getRecordBySlug,
		getRecordTree,
		getRecordLinks,
		upsertRecord,
	};
}
