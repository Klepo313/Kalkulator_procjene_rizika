// server/middleware/auth.ts
import { parseCookies, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
    const vars = useRuntimeConfig();
    const cookies = parseCookies(event);
    const token = cookies.authToken;

    console.log(`Auth token: ${token}`);

    // Ako korisnik već pokušava pristupiti /login, nemoj ga preusmjeravati
    if (event.node.req.url?.startsWith("/login")) {
        return;
    }

    if (!token) {
        console.log("Nema auth tokena, preusmjeravanje na login.");
        event.context.isLoggedin = false;
        return sendRedirect(event, "/login");
    }

    event.context.isLoggedin = true;
    console.log("Korisnik je logiran!: ", event.context.isLoggedin);
});