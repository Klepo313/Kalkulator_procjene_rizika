// server/api/auth/info.ts
import { parseCookies } from "h3";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event);
    const token = cookies.authToken;

    // console.log("Token u info: ", token)

    if (!token) {
        return { success: false, error: "No token provided" };
    }

    try {
        // Dekodiranje JWT tokena
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));

        return {
            success: true,
            userRoles: tokenPayload.userRoles,
            iat: tokenPayload.iat,
            exp: tokenPayload.exp,
        };
    } catch (error) {
        return { success: false, error: "Invalid or expired token: " + error, };
    }
});
