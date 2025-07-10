export enum ApiEndpoints {
  record = '/record',
}

const { BACKEND_PORT } = import.meta.env;

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export default function useApiClient() {
  const hostname = window.location.hostname;
  const backendBaseUrl = `http://${hostname}:${BACKEND_PORT}`;

  async function fetch<T>(
    endpoint: ApiEndpoints | string,
    options?: RequestInit,
    formData: boolean = false,
  ): Promise<T> {
    const url = new URL(endpoint, backendBaseUrl);

    const { headers, ...restOptions } = options ?? {};

    const optionsWithDefaults = {
      headers: formData
        ? undefined
        : {
            ...defaultHeaders,
            ...headers,
          },
      ...restOptions,
    };

    let response;

    try {
      response = await window.fetch(url, optionsWithDefaults);
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
    backendBaseUrl,
    fetch,
  };
}
