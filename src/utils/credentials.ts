/**
 * Credential Encryption/Decryption
 * Simple XOR-based obfuscation for built-in credentials
 */

export class CredentialManager {
  private static readonly KEY = "FRIDAY_MCP_2025_SECURE_KEY";

  /**
   * Encrypt string using XOR
   */
  static encrypt(text: string): string {
    const result: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ this.KEY.charCodeAt(i % this.KEY.length);
      result.push(charCode);
    }
    return Buffer.from(result).toString('base64');
  }

  /**
   * Decrypt string using XOR
   */
  static decrypt(encrypted: string): string {
    const buffer = Buffer.from(encrypted, 'base64');
    const result: string[] = [];
    for (let i = 0; i < buffer.length; i++) {
      const charCode = buffer[i] ^ this.KEY.charCodeAt(i % this.KEY.length);
      result.push(String.fromCharCode(charCode));
    }
    return result.join('');
  }

  /**
   * Get decrypted Redis URL
   */
  static getRedisUrl(): string {
    // Encrypted: https://growing-lion-22787.upstash.io
    const encrypted = "LiY9NDJjcGIkIjBFWVxScj8sLDt/d218fW5oJzk3NTgsJW05MA==";
    return this.decrypt(encrypted);
  }

  /**
   * Get decrypted Redis Token
   */
  static getRedisToken(): string {
    // Encrypted: AVkDAAIncDJhYjMwZjQ0NjBkYzc0ZjRiYTQyNmMzNzZmM2JmOTUwNXAyMjI3ODc
    const encrypted = "BwQiAAAYFiMgFBVaaVh4KAkvEmUcLx0gHCMlYhMuEzAGGRIpEV99SHslCSgOZxgoEB8QLggKCD0MMxZ+DBQ8";
    return this.decrypt(encrypted);
  }
}
