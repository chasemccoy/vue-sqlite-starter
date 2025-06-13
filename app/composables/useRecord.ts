import useApiClient from '@app/composables/useApiClient';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type {
	GetRecordAPIResponse,
	GetRecordBySlugAPIResponse,
	GetRecordWithOutgoingLinksAPIResponse,
	LinksForRecordAPIResponse,
	UpsertRecordAPIResponse,
} from '@db/queries/records';
import type { GetFamilyTreeAPIResponse } from '@db/queries/tree';
import { toValue, type MaybeRef } from 'vue';
import type { DbId } from '@shared/types/api';
import type { RecordInsert } from '@db/schema';

type OptionalMaybeRef<T> = MaybeRef<T | null>;

type GetRecordOptions = { includeOutgoingLinks?: boolean };

type GetRecordResponse<T> = T extends { includeOutgoingLinks: true }
	? GetRecordWithOutgoingLinksAPIResponse
	: GetRecordAPIResponse;

export default function useRecord() {
	const { fetch } = useApiClient();

	function getRecord<T extends GetRecordOptions>(
		id: OptionalMaybeRef<DbId>,
		enabled: MaybeRef<boolean> = true,
		options?: T,
	) {
		const params = new URLSearchParams();

		if (options?.includeOutgoingLinks) {
			params.set('outgoing_links', 'true');
		}

		return useQuery({
			queryKey: ['get-record', id],
			queryFn: () => fetch<GetRecordResponse<T>>(`/record/${toValue(id)}?${params}`),
			enabled,
		});
	}

	function getRecordBySlug(slug: OptionalMaybeRef<string>) {
		return useQuery({
			queryKey: ['get-record-by-slug', slug],
			queryFn: () => fetch<GetRecordBySlugAPIResponse>(`/record/slug/${toValue(slug)}`),
		});
	}

	function getRecordTree(id: OptionalMaybeRef<DbId>, enabled: MaybeRef<boolean> = true) {
		return useQuery({
			queryKey: ['get-record-tree', id],
			queryFn: () => fetch<GetFamilyTreeAPIResponse>(`/record/${toValue(id)}/tree`),
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
