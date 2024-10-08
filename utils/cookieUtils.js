import CryptoJS from 'crypto-js';
import { getSecKey } from '~/service/fetchSecurityKey';
// import { key } from '~/service/fetchSecurityKey';

// const secretKey = process.env.secretKey;

// Funkcija za enkripciju
export async function encryptCookie(value) {
    if (value === null || value === undefined) return null;

    const secretKey = await getSecKey();
    if (!secretKey) throw new Error('Secret key is undefined');

    const stringValue = JSON.stringify(value); // Parsiraj u string
    const encrypted = CryptoJS.AES.encrypt(stringValue, secretKey).toString();
    return encrypted;
}

// Funkcija za dekripciju
export async function decryptCookie(encryptedValue) {
    if (!encryptedValue) return null;

    const secretKey = await getSecKey();
    if (!secretKey) throw new Error('Secret key is undefined');

    const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    try {
        return JSON.parse(decrypted); // Pokušaj parsirati nazad u izvorni format
    } catch (e) {
        return decrypted; // Ako nije JSON, vrati kao običan string
    }
}
