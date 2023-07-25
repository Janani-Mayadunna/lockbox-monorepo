import { randomBytes } from 'crypto';

export function generateSalt() {
  return randomBytes(64).toString('hex');
}
