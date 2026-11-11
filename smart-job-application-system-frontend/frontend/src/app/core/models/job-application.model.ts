import { CandidateProfile } from './candidate-profile.model';
import { JobOffer } from './job-offer.model';

export type ApplicationStatus =
  | 'SENT'
  | 'VIEWED'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'ACCEPTED'
  | 'REJECTED';

export interface JobApplication {
  id?: number;
  candidate?: CandidateProfile;
  jobOffer?: JobOffer;
  cvPath?: string | null;
  status?: ApplicationStatus;
  applicationDate?: string;
  scoreIa?: number | null;
  aiFeedback?: string | null;
  strengths?: string[];
  missingSkills?: string[];
}

export interface ApplicationRequest {
  candidateId: number;
  jobOfferId: number;
}

export interface StatusRequest {
  status: ApplicationStatus;
}

export interface AiResponse {
  score: number;
  strengths: string[];
  missingSkills: string[];
  feedback: string;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  SENT: 'Sent',
  VIEWED: 'Viewed',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};
