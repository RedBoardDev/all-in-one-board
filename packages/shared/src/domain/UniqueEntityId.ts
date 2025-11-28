import { Identifier } from './Identifier';

/**
 * Represents a globally unique identifier for entities.
 * Uses cryptographically secure UUID v4 for generation.
 */
export class UniqueEntityID extends Identifier<string> {
  constructor(id?: string) {
    super(id ?? UniqueEntityID.generateId());
  }

  /**
   * Generates a new UUID v4 using crypto API.
   * Falls back to a timestamp-based approach in environments without crypto.
   */
  private static generateId(): string {
    // Check if crypto.randomUUID is available (Node 19+ and modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older environments
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant

      const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

      return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
    }

    // Last resort fallback (not recommended for production)
    console.warn('UniqueEntityID: crypto API not available, using fallback ID generation');
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
