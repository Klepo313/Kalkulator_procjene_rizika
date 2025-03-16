// /server/utils/crypto.ts
import { useRuntimeConfig } from '#imports';
import crypto from 'crypto';

export function encrypt(text: string): string {
  const config = useRuntimeConfig();
  // Pretvaramo SECRET_KEY (koji je hex string) u Buffer
  const secretKey = Buffer.from(config.secretKey, 'hex'); 
  const iv = crypto.randomBytes(16); // inicijalizacijski vektor (16 bajta)
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  // Vraćamo IV i enkriptirani string odvojene dvotočkom
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encryptedText: string): string {
  const config = useRuntimeConfig();
  const secretKey = Buffer.from(config.secretKey, 'hex');
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}