import jwt from 'jsonwebtoken';

const SYNC_TOKEN_SECRET = process.env.VITA_INTERNAL_SYNC_TOKEN || 'dev-secret-key-change-in-production';
const TOKEN_EXPIRY = 3600; // 1 hour

/**
 * Generate a JWT token for inter-service synchronization
 */
export function generateSyncToken(payload: Record<string, any>): string {
  return jwt.sign(payload, SYNC_TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRY,
    issuer: 'vita-sync-bridge',
  });
}

/**
 * Verify and decode a JWT sync token
 */
export function verifySyncToken(token: string): Record<string, any> | null {
  try {
    return jwt.verify(token, SYNC_TOKEN_SECRET, {
      issuer: 'vita-sync-bridge',
    }) as Record<string, any>;
  } catch (error) {
    console.error('[SYNC] JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract and validate token from Authorization header
 */
export function extractSyncToken(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}
