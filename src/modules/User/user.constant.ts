import { TRole } from './user.interface';

export const USER_ROLE = {
    ADMIN: 'ADMIN',
    USER:'USER'
} as const;
export const Role: TRole[] = ['ADMIN','USER'];