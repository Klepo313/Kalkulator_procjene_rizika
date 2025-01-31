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

    // try {
    //     const url = `${vars.public.baseUrl}/user/is_loggedin`;

    //     const res = await fetch(url, {
    //         method: "GET",
    //         credentials: "include",
    //         headers: {
    //             Authorization: `Bearer ${token}` // Pošalji token ako ga API očekuje
    //         }
    //     });

    //     if (!res.ok) {
    //         console.error("Greška u API odgovoru:", res.status);
    //         event.context.isLoggedin = false;
    //         return sendRedirect(event, "/login");
    //     }

    //     const data = await res.json();
    //     console.log("Odgovor API-a:", data);

    //     event.context.isLoggedin = !!data.isLoggedin;

    //     if (!data.isLoggedin) {
    //         console.log("Korisnik nije prijavljen, preusmjeravanje na login.");
    //         return sendRedirect(event, "/login");
    //     }
    // } catch (error) {
    //     console.error("Greška u auth middleware-u:", error);
    //     event.context.isLoggedin = false;
    //     return sendRedirect(event, "/login");
    // }
});