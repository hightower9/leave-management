import { User, Leave, Project, Holiday, SystemSettings } from '@/lib/types';
import { addDays, format, parseISO, differenceInDays } from 'date-fns';

// Helper to generate an ISO date for today + days
const dateFromNow = (days: number) => {
  return addDays(new Date(), days).toISOString();
};

// Helper to generate random date in the future (1-60 days)
const randomFutureDate = () => {
  const daysToAdd = Math.floor(Math.random() * 60) + 1;
  return addDays(new Date(), daysToAdd).toISOString();
};

// Users mock data
export const users: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin',
    jobDescription: 'HR Manager',
    annualLeaveQuota: 25,
    projects: ['1', '2'],
    notes: 'Main admin account',
    profileImage: 'https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    firstName: 'Member',
    lastName: 'User',
    email: 'member@example.com',
    role: 'member',
    jobDescription: 'Software Developer',
    annualLeaveQuota: 20,
    projects: ['1', '3'],
    notes: 'Frontend developer',
    profileImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    role: 'member',
    jobDescription: 'Product Manager',
    annualLeaveQuota: 22,
    projects: ['2', '3'],
    notes: 'Product team lead',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael@example.com',
    role: 'member',
    jobDescription: 'Backend Developer',
    annualLeaveQuota: 20,
    projects: ['1'],
    notes: 'Works on API development',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '5',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma@example.com',
    role: 'member',
    jobDescription: 'UX Designer',
    annualLeaveQuota: 21,
    projects: ['2'],
    notes: 'Design team member',
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

// Leaves mock data
export const leaves: Leave[] = [
  {
    id: '1',
    userId: '2',
    type: 'annual',
    startDate: dateFromNow(5),
    endDate: dateFromNow(9),
    halfDay: null,
    reason: 'Family vacation',
    status: 'approved',
    createdAt: dateFromNow(-2),
    updatedAt: dateFromNow(-1),
    reviewedBy: '1',
  },
  {
    id: '2',
    userId: '2',
    type: 'annual',
    startDate: dateFromNow(20),
    endDate: dateFromNow(20),
    halfDay: 'morning',
    reason: 'Doctor appointment',
    status: 'pending',
    createdAt: dateFromNow(-1),
    updatedAt: dateFromNow(-1),
  },
  {
    id: '3',
    userId: '3',
    type: 'annual',
    startDate: dateFromNow(15),
    endDate: dateFromNow(19),
    halfDay: null,
    reason: 'Personal time off',
    status: 'rejected',
    createdAt: dateFromNow(-5),
    updatedAt: dateFromNow(-3),
    reviewedBy: '1',
    reviewNote: 'Critical project deadline during this period',
  },
  {
    id: '4',
    userId: '4',
    type: 'annual',
    startDate: dateFromNow(10),
    endDate: dateFromNow(10),
    halfDay: 'afternoon',
    reason: 'Family event',
    status: 'approved',
    createdAt: dateFromNow(-4),
    updatedAt: dateFromNow(-3),
    reviewedBy: '1',
  },
  {
    id: '5',
    userId: '5',
    type: 'normal',
    startDate: dateFromNow(3),
    endDate: dateFromNow(4),
    halfDay: null,
    reason: 'Personal development workshop',
    status: 'approved',
    createdAt: dateFromNow(-6),
    updatedAt: dateFromNow(-5),
    reviewedBy: '1',
  },
];

// Projects mock data
export const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    members: ['1', '2', '4'],
    notes: 'Complete overhaul of company website',
    createdAt: dateFromNow(-30),
    updatedAt: dateFromNow(-5),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    members: ['1', '3', '5'],
    notes: 'New customer-facing mobile application',
    createdAt: dateFromNow(-60),
    updatedAt: dateFromNow(-2),
  },
  {
    id: '3',
    name: 'Data Analytics Platform',
    members: ['2', '3'],
    notes: 'Internal data visualization and reporting tool',
    createdAt: dateFromNow(-45),
    updatedAt: dateFromNow(-10),
  },
];

// Holidays mock data (using US holidays as example)
export const holidays: Holiday[] = [
  {
    id: '1',
    name: 'New Year\'s Day',
    date: '2025-01-01',
    country: 'US',
  },
  {
    id: '2',
    name: 'Martin Luther King Jr. Day',
    date: '2025-01-20',
    country: 'US',
  },
  {
    id: '3',
    name: 'Presidents Day',
    date: '2025-02-17',
    country: 'US',
  },
  {
    id: '4',
    name: 'Memorial Day',
    date: '2025-05-26',
    country: 'US',
  },
  {
    id: '5',
    name: 'Independence Day',
    date: '2025-07-04',
    country: 'US',
  },
  {
    id: '6',
    name: 'Labor Day',
    date: '2025-09-01',
    country: 'US',
  },
  {
    id: '7',
    name: 'Veterans Day',
    date: '2025-11-11',
    country: 'US',
  },
  {
    id: '8',
    name: 'Thanksgiving Day',
    date: '2025-11-27',
    country: 'US',
  },
  {
    id: '9',
    name: 'Christmas Day',
    date: '2025-12-25',
    country: 'US',
  },
];

// System settings mock data
export const systemSettings: SystemSettings = {
  country: 'US',
  defaultAnnualLeaveQuota: 20,
};

// Utility functions
export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function getLeavesByUserId(userId: string): Leave[] {
  return leaves.filter(leave => leave.userId === userId);
}

export function getProjectsByUserId(userId: string): Project[] {
  return projects.filter(project => project.members.includes(userId));
}

export function getUsersByProjectId(projectId: string): User[] {
  const project = projects.find(p => p.id === projectId);
  if (!project) return [];
  
  return users.filter(user => project.members.includes(user.id));
}

export function getHolidaysByCountry(country: string): Holiday[] {
  return holidays.filter(holiday => holiday.country === country);
}

export function calculateLeaveSummary(userId: string): { approved: number, rejected: number, pending: number, total: number, used: number, remaining: number } {
  const userLeaves = getLeavesByUserId(userId);
  const user = getUserById(userId);
  
  if (!user) {
    return { approved: 0, rejected: 0, pending: 0, total: 0, used: 0, remaining: 0 };
  }
  
  const approved = userLeaves.filter(leave => leave.status === 'approved').length;
  const rejected = userLeaves.filter(leave => leave.status === 'rejected').length;
  const pending = userLeaves.filter(leave => leave.status === 'pending').length;
  
  // Calculate used days (only count approved leaves)
  const usedDays = userLeaves
    .filter(leave => leave.status === 'approved' && leave.type === 'annual')
    .reduce((total, leave) => {
      // Calculate the number of days between start and end dates
      const start = parseISO(leave.startDate);
      const end = parseISO(leave.endDate);
      let days = differenceInDays(end, start) + 1; // +1 to include both start and end days
      
      // If it's a half day, count as 0.5
      if (leave.halfDay) {
        days = days - 0.5;
      }
      
      return total + days;
    }, 0);
  
  return {
    approved,
    rejected,
    pending,
    total: approved + rejected + pending,
    used: usedDays,
    remaining: user.annualLeaveQuota - usedDays,
  };
}