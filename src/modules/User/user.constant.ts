import { TRole } from './user.interface';

export const USER_ROLE = {
    ADMIN: 'ADMIN',
    STUDENT:'STUDENT',
    INSTRUCTOR:'INSTRUCTOR'
} as const;
export const Role: TRole[] = ['ADMIN','STUDENT','INSTRUCTOR'];