export type DocumentType =
    | 'cni-senegal'
    | 'passeport-senegal'
    | 'permis-conduire'
    | 'ninea'
    | 'extrait-naissance'
    | 'auto';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organization?: string;
    phone?: string;
    country: string;
    plan: 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';
    role: 'user' | 'admin';
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    notifications?: {
        extractionEmails: boolean;
        billingAlerts: boolean;
        productNewsletter: boolean;
    };
    credits?: number;
    createdAt: string;
}

export interface OpenRouterConfig {
    apiKey: string;
    primaryModel: string;
    fallbackModels: string[];
    isEnabled: boolean;
}

export interface CloudflareAiConfig {
    apiKey: string;
    primaryModel: string;
    fallbackModels: string[];
    isEnabled: boolean;
}

export interface SystemSettings {
    key: string;
    openRouter: OpenRouterConfig;
    cloudflareAi: CloudflareAiConfig;
    otherConfigs: Record<string, any>;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface ApiKey {
    id: string;
    name: string;
    key?: string;
    keyPrefix: string;
    environment: 'live' | 'test';
    scopes: string[];
    usage: {
        thisMonth: number;
        today: number;
        allTime: number;
    };
    expiresAt?: string;
    lastUsedAt?: string;
    createdAt: string;
}

export interface Extraction {
    referenceId: string;
    documentType: string;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'reviewed';
    provider?: string;
    creditsUsed: number;
    processingMs?: number;
    file: {
        originalName: string;
        storageKey: string;
        mimeType: string;
        sizeBytes: number;
    };
    result?: {
        extractedData: Record<string, FieldResult>;
        globalConfidence: number;
        validation?: ValidationResult;
        fraud?: FraudResult;
        rawText?: string;
    };
    userCorrection?: Record<string, any>;
    correctedAt?: string;
    createdAt: string;
    completedAt?: string;
}

export interface FieldResult {
    value: string | number | boolean | null;
    confidence: number;
    rawText?: string;
}

export interface ValidationResult {
    isValid: boolean;
    score: number;
    errors: ValidationError[];
    warnings: ValidationError[];
}

export interface ValidationError {
    field: string;
    code: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface FraudResult {
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    isAlert: boolean;
    indicators: string[];
    details: Record<string, unknown>;
}

export interface AnalyticsOverview {
    totalExtractions: number;
    successRate: number;
    avgConfidence: number;
    avgProcessingMs: number;
    fraudDistribution: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    distribution: Record<string, number>;
    providerDistribution: Record<string, number>;
}

export interface ExtractionResult {
    id: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    documentType: DocumentType;
    createdAt: string;
    completedAt?: string;
    processingMs?: number;
    data?: Record<string, { value: string; confidence: number }>;
    validation?: {
        isValid: boolean;
        score: number;
        errors: Array<{ field: string; code: string; message: string }>;
    };
    fraud?: {
        score: number;
        level: 'low' | 'medium' | 'high' | 'critical';
        indicators: string[];
    };
}

export interface Template {
    slug: string;
    name: string;
    version: string;
    category: string;
    country: string;
    language: string;
    description?: string;
    isBuiltin: boolean;
    isPublic: boolean;
    fields: TemplateField[];
    ocrConfig?: {
        preferredProvider?: string;
        fallbackProvider?: string;
        preprocessingSteps?: string[];
        promptTemplate?: string;
    };
    validationRules?: ValidationRule[];
    fraudIndicators?: string[];
    isActive: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface TemplateField {
    key: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'mrz' | 'address' | 'phone' | 'email';
    required: boolean;
    extractionHint?: string;
    region?: 'top_left' | 'top_right' | 'center' | 'bottom' | 'mrz_zone' | 'full';
    validation?: {
        regex?: string;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        dateFormat?: string;
        minDate?: string;
        maxDate?: string;
        futureAllowed?: boolean;
        enumValues?: string[];
    };
}

export interface ValidationRule {
    type: string;
    field?: string;
    rule?: string;
    errorMessage?: string;
    severity?: 'error' | 'warning';
}

export interface Webhook {
    id: string;
    name: string;
    url: string;
    events: string[];
    isActive: boolean;
    lastTriggeredAt?: string;
    lastStatus?: number;
    successCount: number;
    failureCount: number;
    createdAt: string;
}

export interface UsageStats {
    totalCredits: number;
    thisMonth: number;
    today: number;
    remainingCredits: number;
    plan: string;
    quota: number;
}

export interface AnalyticsOverview {
    totalExtractions: number;
    successRate: number;
    avgConfidence: number;
    avgProcessingMs: number;
    fraudDistribution: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    documentTypeDistribution: Record<string, number>;
    providerDistribution: Record<string, number>;
}

export interface TimeSeriesData {
    date: string;
    count: number;
    successCount: number;
    avgConfidence: number;
    avgLatency: number;
}

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year' | 'one_time';
    credits: number;
    features: string[];
    type?: 'subscription' | 'pack';
    quotas?: {
        monthly: number;
        daily: number;
        concurrent: number;
    };
    creditCost?: number;
    stripePriceId?: string;
    dexpayProductId?: string;
    isActive: boolean;
}

export interface Subscription {
    id: string;
    planId: string;
    status: 'active' | 'pending' | 'cancelled' | 'expired' | 'past_due';
    interval: 'month' | 'year';
    startDate: string;
    endDate: string;
    price: number;
    currency: string;
}

export interface Invoice {
    _id: string;
    reference: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    dueDate: string;
    paidAt?: string;
    paymentUrl?: string;
    createdAt: string;
}
