import { USER_ROLE } from "./user.constant";

export type TuserRole = keyof typeof USER_ROLE;

// Assuming USER_ROLE is defined in user.constants.ts

// Role type matching Prisma's Role enum
export type TRole = 'ADMIN';

// Type for keys of USER_ROLE
export type TUserRole = keyof typeof USER_ROLE;
// Interface for User (based on User model)
export interface IUser {
  id?:string
  name: string;
  email: string;
  role : TRole;
  phone: string;
  password: string;
}
