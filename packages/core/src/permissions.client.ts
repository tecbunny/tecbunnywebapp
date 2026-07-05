import type { User as CustomUser } from './types';
import { EFFECTIVE_PERMISSIONS, isAtLeast, type UserRole } from './roles';

// Client-side permission functions that work with our custom User type
// These are synchronous and work with the role that's already loaded in the user object

export function isCustomerClient(user: CustomUser | null): boolean { return user?.role === 'customer'; }

export function isSalesClient(user: CustomUser | null): boolean {
  if (!user?.role) return false;
  return isAtLeast(user.role, 'sales_executive');
}

export function isAccountsClient(user: CustomUser | null): boolean {
  if (!user?.role) return false;
  return isAtLeast(user.role, 'accounts');
}

export function isServiceEngineerClient(user: CustomUser | null): boolean { return user?.role === 'service_engineer'; }

export function isManagerClient(user: CustomUser | null): boolean {
  if (!user?.role) return false;
  return isAtLeast(user.role, 'sales_manager') || isAtLeast(user.role, 'service_manager');
}

export function isAdminClient(user: CustomUser | null): boolean {
  if (!user?.role) return false;
  return isAtLeast(user.role, 'admin');
}

export function isSuperadminClient(user: CustomUser | null): boolean {
  return user?.role === 'superadmin' && user?.id === 'superadmin-root-id';
}

export function getRolePermissions(role: UserRole): string[] {
  return Array.from(EFFECTIVE_PERMISSIONS[role]);
}
