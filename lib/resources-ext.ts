import { api, getErrorMessage } from './api';
import type { ApiKey, Webhook, UsageStats, AnalyticsOverview, TimeSeriesData, User, Plan, Template } from '@/types';

export async function getAdminUsers(params: { limit: number; offset: number }): Promise<{ data: User[]; total: number }> {
    try {
        const response = await api.get<{ data: User[]; total: number }>('/users/admin/users', { params });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getAdminInvoices(params: {
    limit: number;
    offset: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}): Promise<{ data: any[]; total: number }> {
    try {
        const response = await api.get<{ data: any[]; total: number }>('/billing/admin/invoices', { params });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getAdminTransactions(params: {
    limit: number;
    offset: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}): Promise<{ data: any[]; total: number }> {
    try {
        const response = await api.get<{ data: any[]; total: number }>('/billing/admin/transactions', { params });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getApiKeys(): Promise<ApiKey[]> {
    try {
        const response = await api.get<ApiKey[]>('/api-keys');
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createApiKey(data: {
    name: string;
    environment?: 'live' | 'test';
    scopes?: string[];
    expiresAt?: string;
}): Promise<ApiKey & { key: string }> {
    try {
        const response = await api.post<ApiKey & { key: string }>('/api-keys', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function revokeApiKey(id: string): Promise<void> {
    try {
        await api.delete(`/api-keys/${id}`);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getWebhooks(): Promise<Webhook[]> {
    try {
        const response = await api.get<Webhook[]>('/webhooks');
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createWebhook(data: {
    name: string;
    url: string;
    events?: string[];
}): Promise<Webhook> {
    try {
        const response = await api.post<Webhook>('/webhooks', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook> {
    try {
        const response = await api.put<Webhook>(`/webhooks/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function deleteWebhook(id: string): Promise<void> {
    try {
        await api.delete(`/webhooks/${id}`);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function testWebhook(id: string): Promise<void> {
    try {
        await api.post(`/webhooks/${id}/test`);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getUsageStats(plan: string = 'free'): Promise<UsageStats> {
    try {
        const response = await api.get<UsageStats>('/usage', { params: { plan } });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getUsageHistory(params?: {
    startDate?: string;
    endDate?: string;
}): Promise<{ month: string; credits: number; cost: number }[]> {
    try {
        const response = await api.get<{ month: string; credits: number; cost: number }[]>('/usage/history', { params });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getAnalytics(): Promise<AnalyticsOverview> {
    try {
        const response = await api.get<AnalyticsOverview>('/analytics');
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getTimeSeries(
    granularity: 'hour' | 'day' | 'week' | 'month' = 'day'
): Promise<TimeSeriesData[]> {
    try {
        const response = await api.get<TimeSeriesData[]>('/analytics/timeseries', {
            params: { granularity },
        });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function exportAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'json';
}): Promise<{ data: string; format: string }> {
    try {
        const response = await api.get<{ data: string; format: string }>('/analytics/export', { params });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getPlans(): Promise<Plan[]> {
    try {
        const response = await api.get<{ plans: Plan[] }>('/plans');
        return response.data.plans;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createPlan(data: {
    name: string;
    description: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year' | 'one_time';
    credits: number;
    features: string[];
    type?: 'subscription' | 'pack';
    quotas?: { monthly?: number; daily?: number; concurrent?: number };
    creditCost?: number;
}): Promise<{ plan: Plan }> {
    try {
        const response = await api.post<{ plan: Plan }>('/plans', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function updatePlan(id: string, data: {
    name?: string;
    description?: string;
    amount?: number;
    currency?: string;
    interval?: 'month' | 'year' | 'one_time';
    credits?: number;
    features?: string[];
    isActive?: boolean;
    type?: 'subscription' | 'pack';
    quotas?: { monthly?: number; daily?: number; concurrent?: number };
    creditCost?: number;
}): Promise<{ plan: Plan }> {
    try {
        const response = await api.put<{ plan: Plan }>(`/plans/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function deletePlan(id: string): Promise<{ message: string }> {
    try {
        const response = await api.delete<{ message: string }>(`/plans/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function updatePlanStatus(id: string, isActive: boolean): Promise<{ plan: Plan }> {
    try {
        const response = await api.patch<{ plan: Plan }>(`/plans/${id}/status`, { isActive });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function syncPlanWithDexpay(id: string, dexpayProductId: string): Promise<{ plan: Plan }> {
    try {
        const response = await api.patch<{ plan: Plan }>(`/plans/${id}/sync`, { dexpayProductId });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getAdminTemplates(): Promise<Template[]> {
    try {
        const response = await api.get<Template[]>('/templates/admin');
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function setAdminTemplateActive(slug: string, isActive: boolean): Promise<Template> {
    try {
        const response = await api.patch<Template>(`/templates/admin/${slug}/active`, { isActive });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}
