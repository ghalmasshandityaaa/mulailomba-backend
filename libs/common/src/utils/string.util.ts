import { compare as toCompare, genSalt, hash as toHash } from 'bcrypt';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export class StringUtils {
  private static readonly algorithm = 'aes-256-ctr';
  private static readonly ivLength = 16;
  private static readonly keyLength = 32;
  private static readonly salt = process.env.SALT || '';

  /**
   *
   * @param text
   * @returns
   */
  public static async hash(text: string): Promise<string> {
    const SALT_ROUND = 10;
    const salt = await genSalt(SALT_ROUND);
    const hash = await toHash(text, salt);

    return hash;
  }

  /**
   *
   * @param hashString
   * @param text
   * @returns
   */
  public static async compare(hashString: string, text: string): Promise<boolean> {
    const isMatch = await toCompare(text, hashString);
    return isMatch;
  }

  /**
   *
   * @param text
   * @returns
   */
  public static encrypt(text: string): string {
    const iv = randomBytes(this.ivLength);
    const key = createHash('sha256').update(this.salt).digest().slice(0, this.keyLength);
    const cipher = createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted;
  }

  /**
   *
   * @param encryptedText
   * @returns
   */
  public static decrypt(encryptedText: string): string {
    const iv = Buffer.from(encryptedText.slice(0, this.ivLength * 2), 'hex');
    const key = createHash('sha256').update(this.salt).digest().slice(0, this.keyLength);
    const decipher = createDecipheriv(this.algorithm, key, iv);

    let decrypted = decipher.update(encryptedText.slice(this.ivLength * 2), 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
  /**
   *
   * @param length
   * @returns
   */
  public static randomNumber(length: number): string {
    let num = '';
    for (let i = 0; i < length; i++) {
      num = num + Math.floor(Math.random() * (9 - 1 + 1) + 1);
    }

    return num;
  }
}
