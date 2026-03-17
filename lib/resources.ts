import api, { getErrorMessage } from './api';
import type { Extraction, Template, Webhook, UsageStats, AnalyticsOverview, TimeSeriesData, User, Plan, Subscription, Invoice } from '@/types';

export async function getCurrentUser(): Promise<User> {
    try {
        const response = await api.get<User>('/users/me');
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

export async function getPublicPlans(): Promise<Plan[]> {
    try {
        // Use standard fetch to bypass axios interceptors that might attach tokens
        // and trigger a 401 redirect loop
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009/v1';
        const response = await fetch(`${apiUrl}/plans/public`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // next: { revalidate: 3600 } // Cache for 1 hour if using App Router Server Components
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.plans;
    } catch (error) {
        console.error("Failed to fetch public plans", error);
        return [];
    }
}

export async function updateUser(data: Partial<User>): Promise<User> {
    try {
        const response = await api.put<User>('/users/me', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function changePassword(data: any): Promise<void> {
    try {
        await api.put('/users/me/password', data);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function updateNotifications(data: {
    extractionEmails?: boolean;
    billingAlerts?: boolean;
    productNewsletter?: boolean;
}): Promise<User> {
    try {
        const response = await api.put<User>('/users/me/notifications', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function requestPasswordReset(email: string): Promise<void> {
    try {
        await api.post('/auth/forgot-password', { email });
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    try {
        await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function verifyEmail(token: string): Promise<void> {
    try {
        await api.post('/auth/verify-email', { token });
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getExtractions(params?: {
    limit?: number;
    offset?: number;
    status?: string;
}): Promise<{ data: Extraction[]; total: number }> {
    try {
        const response = await api.get<{ data: Extraction[]; total: number }>('/extractions', { params });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getExtraction(id: string): Promise<Extraction> {
    try {
        const response = await api.get<Extraction>(`/extractions/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createExtraction(
    file: File,
    documentType: string,
    options?: {
        fraudCheck?: boolean;
        returnConfidence?: boolean;
        returnRawText?: boolean;
    },
    fileBack?: File
): Promise<Extraction> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (fileBack) {
            formData.append('fileBack', fileBack);
        }
        formData.append('documentType', documentType);
        
        if (options) {
            if (typeof options.fraudCheck === 'boolean') {
                formData.append('fraudCheck', String(options.fraudCheck));
            }
            if (typeof options.returnConfidence === 'boolean') {
                formData.append('returnConfidence', String(options.returnConfidence));
            }
            if (typeof options.returnRawText === 'boolean') {
                formData.append('returnRawText', String(options.returnRawText));
            }
        }

        const response = await api.post<Extraction>('/extract', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function deleteExtraction(id: string): Promise<void> {
    try {
        await api.delete(`/extractions/${id}`);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function submitFeedback(id: string, correctedData: Record<string, any>): Promise<Extraction> {
    try {
        const response = await api.post<Extraction>(`/extractions/${id}/feedback`, { correctedData });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getTemplates(): Promise<Template[]> {
    try {
        const response = await api.get<Template[]>('/templates');
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getTemplate(slug: string): Promise<Template> {
    try {
        const response = await api.get<Template>(`/templates/${slug}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createCheckoutSession(planId: string): Promise<{ paymentUrl: string; reference: string }> {
    try {
        const response = await api.post('/billing/checkout', { planId });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createSubscription(plan: string, phone?: string): Promise<{ subscription: any; paymentUrl?: string | null }> {
    try {
        const response = await api.post('/billing/subscribe', { plan, phone });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function cancelSubscription(subscriptionId?: string): Promise<{ subscription: Subscription }> {
    try {
        const response = await api.post('/billing/subscription/cancel', { subscriptionId });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getActiveSubscription(): Promise<Subscription | null> {
    try {
        const response = await api.get<Subscription>('/billing/subscription/active');
        return response.data;
    } catch (error) {
        // If 404, return null (no active subscription)
        return null;
    }
}

export async function getInvoices(): Promise<Invoice[]> {
    try {
        const response = await api.get<Invoice[]>('/billing/invoices');
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getTransactions(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}): Promise<{ data: any[]; total: number }> {
    try {
        const response = await api.get<{ data: any[]; total: number }>('/billing/transactions', { params });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createTemplate(data: Partial<Template>): Promise<Template> {
    try {
        const response = await api.post<Template>('/templates', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function updateTemplate(slug: string, data: Partial<Template>): Promise<Template> {
    try {
        const response = await api.put<Template>(`/templates/${slug}`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function deleteTemplate(slug: string): Promise<void> {
    try {
        await api.delete(`/templates/${slug}`);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function getTemplateRequests(): Promise<import('@/types').TemplateRequest[]> {
    try {
        const response = await api.get<import('@/types').TemplateRequest[]>('/template-requests');
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createTemplateRequest(data: FormData): Promise<import('@/types').TemplateRequest> {
    try {
        // We pass FormData directly so axios sets the correct multipart/form-data boundary
        const response = await api.post<import('@/types').TemplateRequest>('/template-requests', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}
