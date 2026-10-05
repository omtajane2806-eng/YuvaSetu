// Real Backend API Client for YuvaSetu
// Communicates with the Express + SQLite backend on /api/*

const CURRENT_USER_STORAGE_KEY = 'yuvasetu_current_user_v4';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const rawUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user?.id) {
        headers['x-user-id'] = user.id;
      }
      if (user?.role) {
        headers['x-user-role'] = user.role;
      }
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    // Ignore localStorage parse errors
  }

  return headers;
}

// Resolve base API URL: defaults to relative '/api' in monolith / dev mode, or custom URL in separated hosting
const BASE_API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function formatUrl(endpoint: string): string {
  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!path.startsWith('/api')) {
    path = `/api${path}`;
  }
  return `${BASE_API_URL}${path}`;
}

export async function apiGet<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
  let url = formatUrl(endpoint);

  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.message || body.error || `HTTP ${res.status}`, res.status, body);
  }
  return body as T;
}

export async function apiPost<T = any>(endpoint: string, data?: any): Promise<T> {
  const url = formatUrl(endpoint);

  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.message || body.error || `HTTP ${res.status}`, res.status, body);
  }
  return body as T;
}

export async function apiPut<T = any>(endpoint: string, data?: any): Promise<T> {
  const url = formatUrl(endpoint);

  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.message || body.error || `HTTP ${res.status}`, res.status, body);
  }
  return body as T;
}

export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  const url = formatUrl(endpoint);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.message || body.error || `HTTP ${res.status}`, res.status, body);
  }
  return body as T;
}
