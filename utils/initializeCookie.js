// /utils/initializeCookie.js
import { getCookie } from './cookieUtils';

const initializeCookie = async (name) => {
    try {
        const id = await getCookie(name);
        return id;
    } catch (error) {
        // console.error(`Error getting ${name} cookie`, error);
        return null;
    }
}

export {
    initializeCookie
}