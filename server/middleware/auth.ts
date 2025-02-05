import { parseCookies, sendRedirect, deleteCookie } from "h3";

export default defineEventHandler(async (event) => {
    const vars = useRuntimeConfig();
    const cookies = parseCookies(event);
    const token = cookies.authToken;

    if (event.node.req.url?.startsWith("/login")) {
        return;
    }

    if (!token || !isValidToken(token)) {
        console.log("Neispravan token ili token ne postoji, brisanje cookija...");
        deleteCookie(event, "authToken");
        event.context.isLoggedin = false;
        return sendRedirect(event, "/login");
    }

    event.context.isLoggedin = true;
});

function isValidToken(token: string): boolean {
    try {
        // Dekodiraj JWT token i provjeri istek
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        console.error("Neispravan JWT token:", error);
        return false;
    }
}
