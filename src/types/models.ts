export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
export type UserSex = 'MALE' | 'FEMALE';

export interface User {
  id: string;
  email: string;
  password?: string | null;
  firstName: string;
  lastName: string;
  preferredName?: string | null;
  dateOfBirth?: string | null; // ISO string
  gender?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country: string;
  role: UserRole;
  schoolId?: number | null;
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Teacher {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img?: string | null;
  bloodType: string;
  sex: UserSex;
  createdAt: string;
  birthday: string;
  classId?: number | null;
  schoolId?: number | null;
  userId?: string | null;
}

export interface Student {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img?: string | null;
  bloodType: string;
  sex: UserSex;
  gender: string;
  homeLanguage?: string | null;
  allergies?: string | null;
  medicalInfo?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  guardianRelationship?: string | null;
  specialNeeds?: string | null;
  extracurriculars?: string | null;
  admissionYear?: number | null;
  status?: string | null;
  profileImage?: string | null;
  createdAt: string;
  birthday: string;
  parentId?: string | null;
  classId?: number | null;
  gradeId?: number | null;
  schoolId?: number | null;
  userId?: string | null;
  parent?: Parent | null;
  class?: Class | null;
  grade?: Grade | null;
}

export interface Parent {
  id: string;
  username?: string;
  name: string;
  surname?: string;
  email: string;
  phone: string;
  address: string;
  img?: string | null;
  sex?: UserSex;
  createdAt?: string;
  schoolId?: number | null;
  userId?: string | null;
  children?: string[];
}

export interface Class {
  id: number;
  name: string;
  capacity: number;
  supervisorId?: string | null;
  gradeId?: number | null;
  schoolId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: number;
  level: number;
  createdAt?: string;
  updatedAt?: string;
}
