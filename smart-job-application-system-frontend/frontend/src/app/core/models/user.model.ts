export type Role = 'ROLE_CANDIDAT' | 'ROLE_ADMIN' | 'ROLE_RH';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface RegisterCandidateRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterRecruiterRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyEmail: string;
}

export interface RegisterResponse {
  message: string;
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
