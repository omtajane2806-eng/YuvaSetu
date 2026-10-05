export type UserPlan = 'FREE' | 'PREMIUM';

export type UserRole = 'student' | 'admin' | 'guest';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  branch: string;
  year: string;
  bio: string;
  profileImage?: string;
  plan: UserPlan;
  role: UserRole;
  status?: UserStatus;
  learningSubjects: string[];
  teachingSubjects: string[];
  reputation: number;
  followersCount: number;
  contentUploadedCount: number;
  helpfulAnswersCount: number;
  earnings: number;
  createdAt: string;
  isProfileSetupCompleted?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  college: string;
  course: string;
  branch: string;
  year: string;
}

export interface AddStudentFormData {
  name: string;
  email: string;
  password?: string;
  college: string;
  course: string;
  branch: string;
  year: string;
  bio?: string;
  status?: UserStatus;
}

export interface EditStudentFormData {
  name: string;
  email: string;
  college: string;
  course: string;
  branch: string;
  year: string;
  bio: string;
  status: UserStatus;
}

export interface CreateAdminFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface EditAdminFormData {
  name: string;
  email: string;
  bio?: string;
  college?: string;
  course?: string;
  branch?: string;
  status?: UserStatus;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ProfileSetupData {
  learningSubjects: string[];
  teachingSubjects: string[];
  bio?: string;
}
