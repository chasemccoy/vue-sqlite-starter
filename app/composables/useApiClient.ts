export enum ApiEndpoints {
	records = '/records',
}

const { BACKEND_PORT } = import.meta.env;

export default function useApiClient() {
	const baseUrl = `http://localhost:${BACKEND_PORT}`;

	async function fetch<T>(endpoint: ApiEndpoints, options?: RequestInit) {
		const url = new URL(endpoint, baseUrl);
		return window.fetch(url, options).then<T>((res) => res.json());
	}

	return {
		fetch,
	};
}
