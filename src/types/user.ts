/**
 * User Role Types
 * Mirrors the Prisma UserRole enum for frontend usage
 */

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

/**
 * User interface extending the Prisma User type
 */
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Helper functions for role checking
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.role === UserRole.ADMIN;
};

export const isUser = (user: User | null): boolean => {
  return user?.role === UserRole.USER;
};

/**
 * Role display names for UI
 */
export const roleDisplayNames: Record<UserRole, string> = {
  [UserRole.USER]: 'User',
  [UserRole.ADMIN]: 'Admin',
}; 