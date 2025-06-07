export enum ApiEndpoints {
	records = '/records',
}

const { BACKEND_PORT } = import.meta.env;
const baseUrl = `http://localhost:${BACKEND_PORT}`;

export default function useApiClient() {
	async function fetch<T>(endpoint: ApiEndpoints | string, options?: RequestInit): Promise<T> {
		const url = new URL(endpoint, baseUrl);
		let response;

		try {
			response = await window.fetch(url, options);
		} catch (error) {
			throw new Error(`Error in useApiClient: ${error}`);
		}

		if (!response.ok) {
			const body = await response.text();
			throw new Error(`HTTP response error in useApiClient: ${response.status}, ${body}`);
		}

		return response.json();
	}

	return {
		fetch,
	};
}
