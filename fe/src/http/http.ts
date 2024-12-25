import type { ApiResponse, RequestOptions } from "../interfaces/http";

const BASE_URL: string = 'http://localhost:3030/api'; 


export async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error("Error");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}