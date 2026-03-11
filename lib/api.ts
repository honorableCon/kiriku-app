import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { useAuthStore } from './auth-store';

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009/v1';

// Instance pour le client (avec intercepteurs Zustand)
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Instance pour le serveur (sans intercepteurs Zustand)
export const serverApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

let sessionTokenCache: { token: string | null; expiresAt: number } | null = null;

async function getClientAccessToken(): Promise<string | null> {
    const zustandToken = useAuthStore.getState().token;
    if (zustandToken) return zustandToken;

    if (typeof window === 'undefined') return null;

    const now = Date.now();
    if (sessionTokenCache && sessionTokenCache.expiresAt > now) {
        return sessionTokenCache.token;
    }

    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    const token =
        (session as unknown as { accessToken?: string } | null)?.accessToken ?? null;

    sessionTokenCache = { token, expiresAt: now + 15_000 };
    return token;
}

api.interceptors.request.use(
    async (config) => {
        // Only run this interceptor in the browser where useAuthStore works
        if (typeof window !== 'undefined') {
            const token = await getClientAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            sessionTokenCache = null;
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export function isApiError(error: unknown): error is AxiosError {
    return isAxiosError(error);
}

export function getErrorMessage(error: unknown): string {
    if (isAxiosError(error) && error.response) {
        const data = error.response.data;
        if (typeof data === 'object' && data !== null && 'message' in data) {
            const message = (data as { message?: unknown }).message;
            if (typeof message === 'string' && message.length > 0) {
                return message;
            }
            if (Array.isArray(message) && message.every((m) => typeof m === 'string')) {
                return message.join(' • ');
            }
        }
        return error.message;
    }
    return (error as Error).message || 'An unknown error occurred';
}

export default api;
