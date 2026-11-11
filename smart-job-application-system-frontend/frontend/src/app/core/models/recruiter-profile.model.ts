export interface RecruiterProfile {
  id?: number;
  user?: { id: number; name: string; email: string; role: string };
  companyName?: string;
  companyEmail?: string;
  phone?: string;
  position?: string;
}
