// User Types
export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  jobDescription: string;
  annualLeaveQuota: number;
  projects: string[];
  notes?: string;
  profileImage?: string;
}

// Leave Types
export type LeaveType = 'annual' | 'normal';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type HalfDayType = 'morning' | 'afternoon' | null;

export interface Leave {
  id: string;
  userId: string;
  type: LeaveType;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  halfDay: HalfDayType;
  reason: string;
  status: LeaveStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  reviewedBy?: string; // Admin user ID who reviewed the leave
  reviewNote?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  members: string[]; // User IDs
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Holiday Types
export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO date string
  country: string;
}

// Settings Types
export interface SystemSettings {
  country: string;
  defaultAnnualLeaveQuota: number;
}

// Dashboard Types
export interface LeaveSummary {
  approved: number;
  rejected: number;
  pending: number;
  total: number;
  used: number;
  remaining: number;
}