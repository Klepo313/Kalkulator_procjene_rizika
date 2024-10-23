// import CryptoJS from 'crypto-js';
// import { getSecKey } from '~/service/fetchSecurityKey';
// import { key } from '~/service/fetchSecurityKey';

// const secretKey = process.env.secretKey;

// Funkcija za enkripciju
// export async function encryptCookie(value) {
//     if (value === null || value === undefined) return null;

//     const secretKey = await getSecKey();
//     if (!secretKey) throw new Error('Secret key is undefined');

//     const stringValue = JSON.stringify(value); // Parsiraj u string
//     const encrypted = CryptoJS.AES.encrypt(stringValue, secretKey).toString();
//     return encrypted;
// }

// // Funkcija za dekripciju
// export async function decryptCookie(encryptedValue) {
//     if (!encryptedValue) return null;

//     const secretKey = await getSecKey();
//     if (!secretKey) throw new Error('Secret key is undefined');

//     const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
//     const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//     try {
//         return JSON.parse(decrypted); // Pokušaj parsirati nazad u izvorni format
//     } catch (e) {
//         return decrypted; // Ako nije JSON, vrati kao običan string
//     }
// }

import { base_url } from "#imports";

const setCookie = async (name, value) => {
    await $fetch(`${base_url}/user/set-cookie`, {  // Dodano `${base_url}/user/set_cookie`
        method: 'POST',
        body: {
            name, // Pošalji ime kolačića u body
            value, // Pošalji vrijednost kolačića u body
        },
    });
};

const getCookie = async (name) => {
    const response = await $fetch(`${base_url}/user/get-cookie`, {  // Dodano `${base_url}/user/get_cookie`
        params: {
            name, // Dodaj ime kolačića kao parametar
        },
    });
    console.log(response[name]);
    return response[name];
};

const deleteCookie = async (name) => {
    await $fetch(`${base_url}/user/delete-cookie`, {  // Dodano `${base_url}/user/delete_cookie`
        method: 'DELETE',
        body: {
            name, // Pošalji ime kolačića u body
        },
    });
};

export {
    setCookie,
    getCookie,
    deleteCookie
}