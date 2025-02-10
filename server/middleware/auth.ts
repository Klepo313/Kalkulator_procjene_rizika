// /server/middleware/auth.ts
import { parseCookies, sendRedirect, deleteCookie } from "h3";
import { isValidToken } from "../utils/authToken";// Import funkcije iz utils/auth.ts

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event);
    const token = cookies.authToken;
    const currentPath = event.node.req.url; // Trenutna ruta

    if (currentPath?.startsWith("/login")) {
        return;
    }

    if (!token || !isValidToken(token)) {
        console.log("Neispravan token ili token ne postoji, brisanje cookija...");
        deleteCookie(event, "authToken");
        event.context.isLoggedin = false;

        // Dodaj redirectTo parametar za vraćanje nakon logina
        const loginRedirectUrl = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
        return sendRedirect(event, loginRedirectUrl);
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRoles: string[] = payload.userRoles || [];
    
    event.context.isLoggedin = true;
    event.context.userRoles = userRoles
    event.context.exp = payload.exp;

});
