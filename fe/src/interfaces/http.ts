export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

export interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}