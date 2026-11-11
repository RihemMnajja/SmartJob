import { RecruiterProfile } from './recruiter-profile.model';

export interface JobOffer {
  id?: number;
  recruiter?: RecruiterProfile;
  title: string;
  description: string;
  location: string;
  contractType: string;
  requiredSkills: string;
  createdDate?: string;
  status?: string; // e.g. OPEN / CLOSED
}
