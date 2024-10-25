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

import axios from 'axios';
import { base_url } from "#imports";

// const setCookie = async (name, value) => {
//     const response = await axios.post(`${base_url}/user/set-cookie`, {
//         name: name,
//         value: value
//     }, {
//         withCredentials: true, // Ensure cookies are included in requests
//     });

//     console.log(response.data);
//     return response.data;
// };

// const getCookie = async (name) => {
//     const response = await axios.get(`${base_url}/user/get-cookie`, {  // Dodano `${base_url}/user/get_cookie`
//         params: {
//             name, // Dodaj ime kolačića kao parametar
//         },
//     });
//     console.log(response.data);
//     return response.data;
// };

// const deleteCookie = async (name) => {
//     const response = await axios.delete(`${base_url}/user/delete-cookie`, {  // Dodano `${base_url}/user/delete_cookie`
//         params: {
//             name, // Pošalji ime kolačića u body
//         },
//     });

//     console.log(response.data);
//     return response.data;
// };

const setCookie = async (cookies) => {
    // Ensure cookies is an array
    const cookieArray = Array.isArray(cookies) ? cookies : [{ name: cookies.name, value: cookies.value }];

    const response = await axios.post(`${base_url}/user/set-cookie`, cookieArray, {
        withCredentials: true, // Ensure cookies are included in requests
    });

    console.log(response.data);
    return response.data;
};

const getCookie = async (names) => {
    let response;

    // Check if names is an array
    if (Array.isArray(names)) {
        // For an array, join the names with a comma for the query string
        const nameString = names.join(',');
        console.log("Name string for array: ", nameString);

        response = await axios.get(`${base_url}/user/get-cookie`, {
            params: {
                names: nameString // Send as a comma-separated string
            },
            withCredentials: true,
        });
    } else {
        // For a single name, send it directly
        console.log("Single name: ", names);

        response = await axios.get(`${base_url}/user/get-cookie`, {
            params: {
                names: names // Send the single name directly
            },
            withCredentials: true,
        });
    }

    console.log(response.data);
    return response.data; // This should return an object containing all requested cookie values
};



const deleteCookie = async (names) => {
    // Ensure names is an array
    const cookieNames = Array.isArray(names) ? names : [names];

    const response = await axios.delete(`${base_url}/user/delete-cookie`, {
        params: {
            name: cookieNames.join(','), // Join the array into a comma-separated string
        },
    });

    console.log(response.data);
    return response.data;
};


export {
    setCookie,
    getCookie,
    deleteCookie
}