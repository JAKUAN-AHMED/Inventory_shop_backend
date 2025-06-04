import { USER_ROLE } from './user.constants';

export type TuserRole = keyof typeof USER_ROLE;

// Assuming USER_ROLE is defined in user.constants.ts

// Role type matching Prisma's Role enum
export type TRole = 'ADMIN' | 'USER' | 'BUSINESS';

// Type for keys of USER_ROLE
export type TUserRole = keyof typeof USER_ROLE;

// Interface for Service (based on Service model)
export interface IService {
  id: string;
  service: string;
  date: Date;
  time: string;
  amount: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Feedback (based on Feedback model)
export interface IFeedback {
  id: string;
  rating: string;
  feedback: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for User (based on User model)
export interface IUser {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  zipcode: string;
  state: string;
  phone: string;
  password: string;
  role: TRole;
}
