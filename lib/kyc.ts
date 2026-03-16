import api, { getErrorMessage } from './api';

export interface KycScoreRequest {
  extractionId: string;
  selfieBase64: string;
  enableAml?: boolean;
}

export interface KycScoreResult {
  kycScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
  breakdown: {
    ocrConfidence: number;
    livenessScore: number | null;
    faceMatchScore: number | null;
    amlClear: boolean | null;
  };
  verifiedAt: string;
}

export interface LivenessResult {
  isLive: boolean;
  confidence: number;
  attackType: string | null;
  processingMs?: number;
  scoreSmall?: number;
  scoreLarge?: number;
}

export interface FaceMatchRequest {
  referenceImage: string;
  liveImage: string;
}

export interface FaceMatchResult {
  match: boolean;
  similarity: number;
  confidence?: string;
  distance?: number;
  threshold?: number;
  processingMs?: number;
}

export interface AmlScreenRequest {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  nationality?: string;
  documentNumber?: string;
}

export interface AmlHit {
  entityId: string;
  name: string;
  score: number;
  datasets: string[];
  topics: string[];
}

export interface AmlResult {
  screened: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  hits: AmlHit[];
  listsChecked: number;
  checkedAt: string;
}

export async function calculateKycScore(data: KycScoreRequest): Promise<KycScoreResult> {
    try {
        const response = await api.post<KycScoreResult>('/kyc/score', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function checkLiveness(file: File): Promise<LivenessResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Ne PAS définir 'Content-Type': 'multipart/form-data' manuellement avec axios/fetch
        // Le navigateur l'ajoute automatiquement avec le boundary correct
        const response = await api.post<LivenessResult>('/liveness/check', formData);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function matchFaces(data: FaceMatchRequest): Promise<FaceMatchResult> {
    try {
        const response = await api.post<FaceMatchResult>('/match/face', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function screenAml(data: AmlScreenRequest): Promise<AmlResult> {
    try {
        const response = await api.post<AmlResult>('/aml/screen', data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}
