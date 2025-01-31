import { randomBytes, createHash } from 'crypto';

/**
 * Generate a secure token for agent API authentication
 * Format: agt_<timestamp>_<random>_<checksum>
 * Example: agt_1234567890_abc123def456_abcdef0123456789
 */
export function generateToken(): string {
  // Get current timestamp
  const timestamp = Date.now().toString(36);
  
  // Generate random bytes
  const random = randomBytes(18)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 12);
  
  // Create base token
  const baseToken = `agt_${timestamp}_${random}`;
  
  // Generate checksum
  const checksum = createHash('sha256')
    .update(baseToken)
    .digest('hex')
    .substring(0, 16);
  
  // Combine all parts
  return `${baseToken}_${checksum}`;
}

/**
 * Validate a token's format and checksum
 */
export function validateToken(token: string): boolean {
  // Check basic format
  if (!token.startsWith('agt_')) return false;
  
  // Split token parts
  const parts = token.split('_');
  if (parts.length !== 4) return false;
  
  // Reconstruct base token
  const baseToken = parts.slice(0, 3).join('_');
  
  // Verify checksum
  const checksum = createHash('sha256')
    .update(baseToken)
    .digest('hex')
    .substring(0, 16);
  
  return checksum === parts[3];
}

/**
 * Extract timestamp from token
 */
export function getTokenTimestamp(token: string): Date | null {
  try {
    const timestamp = token.split('_')[1];
    return new Date(parseInt(timestamp, 36));
  } catch {
    return null;
  }
} 