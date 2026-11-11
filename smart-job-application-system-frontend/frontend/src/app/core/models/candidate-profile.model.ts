export interface Experience {
  id?: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  technologies?: string;
}

export interface Education {
  id?: number;
  diploma: string;
  establishment: string;
  year: string;
}

export interface Skill {
  id?: number;
  name: string;
  category?: string;
}

export interface Language {
  id?: number;
  name: string;
  level: string;
}

export interface Certification {
  id?: number;
  name: string;
  organization?: string;
  year?: string;
}

export interface Project {
  id?: number;
  name: string;
  description?: string;
  technologies?: string;
  githubLink?: string;
  imagePath?: string;
}

export interface CandidateProfile {
  id?: number;
  user?: { id: number; name: string; email: string; role: string };
  photo?: string | null;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string | null;
  nationality?: string;
  city?: string;
  address?: string;
  phone?: string;
  professionalTitle?: string;
  summary?: string;
  availability?: string;
  educationLevel?: string;
  school?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  cvPath?: string | null;
  experiences?: Experience[];
  educations?: Education[];
  skills?: Skill[];
  languages?: Language[];
  certifications?: Certification[];
  projects?: Project[];
}
