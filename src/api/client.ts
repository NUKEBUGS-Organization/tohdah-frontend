const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const ACCESS_TOKEN_KEY = 'tohdah_access';
const REFRESH_TOKEN_KEY = 'tohdah_refresh';

export interface ApiErrorBody {
  statusCode: number;
  message: string;
  error: string;
}

export class ApiRequestError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, message: string, error: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.error = error;
  }
}

let refreshPromise: Promise<boolean> | null = null;

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function tryRefreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  const p = (async () => {
    try {
      const rt = getRefreshToken();
      if (!rt) return false;
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  refreshPromise = p;
  return p;
}

export type ApiRequestOptions = {
  skipAuth?: boolean;
  isFormData?: boolean;
  /** Internal: prevent infinite 401 → refresh loop */
  isRetry?: boolean;
  /** @deprecated use isRetry */
  _didRefresh?: boolean;
};

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  path: string,
  body?: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  const skipAuth = options?.skipAuth === true;
  const isFormData = options?.isFormData === true;
  const isRetry =
    options?.isRetry === true || options?._didRefresh === true;

  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (!skipAuth) {
    const at = getAccessToken();
    if (at) {
      headers.Authorization = `Bearer ${at}`;
    }
  }

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData && body instanceof FormData
          ? body
          : JSON.stringify(body),
    cache: method === 'GET' ? 'no-store' : undefined,
  });

  if (res.status === 401 && !skipAuth && !isRetry) {
    const ok = await tryRefreshSession();
    if (ok) {
      return apiRequest<T>(method, path, body, {
        ...options,
        isRetry: true,
      });
    }
    clearTokens();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tohdah:session-expired'));
    }
    return null as T;
  }

  if (!res.ok) {
    let message = res.statusText;
    let error = 'Error';
    try {
      const errBody = (await res.json()) as Partial<ApiErrorBody> & {
        message?: string | string[];
      };
      const rawMsg = errBody.message;
      if (typeof rawMsg === 'string') {
        message = rawMsg;
      } else if (Array.isArray(rawMsg)) {
        message = (rawMsg as string[]).join(', ');
      }
      if (typeof errBody.error === 'string') {
        error = errBody.error;
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiRequestError(res.status, message, error);
  }

  if (res.status === 204) {
    return null as T;
  }

  const text = await res.text();
  if (!text.trim()) {
    return null as T;
  }

  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>('GET', path),
  post: <T>(path: string, body?: unknown, opts?: ApiRequestOptions) =>
    apiRequest<T>('POST', path, body, opts),
  patch: <T>(path: string, body?: unknown, opts?: ApiRequestOptions) =>
    apiRequest<T>('PATCH', path, body, opts),
  delete: <T>(path: string, body?: unknown) =>
    apiRequest<T>('DELETE', path, body),
  upload: <T>(path: string, formData: FormData) =>
    apiRequest<T>('POST', path, formData, { isFormData: true }),
};
