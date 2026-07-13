import { logger } from '../logger';

/**
 * Ensures that the requested resource ID belongs to the authenticated user ID.
 * Optionally allows 'admin' and 'superadmin' to bypass ownership.
 */
export async function requireOwnership(
  userId: string,
  userRole: string,
  resourceOwnerId: string,
  resourceType: string
): Promise<boolean> {
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  
  if (userId === resourceOwnerId || isAdmin) {
    return true;
  }
  
  logger.warn('idor_attempt_blocked', {
    userId,
    userRole,
    resourceOwnerId,
    resourceType
  });
  
  return false;
}
