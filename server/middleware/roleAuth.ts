// server/middleware/roleAuth.ts
import { parseCookies, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event);
    const token = cookies.authToken;

    // Ako korisnik već pokušava pristupiti /login, nemoj ga preusmjeravati
    if (event.node.req.url?.startsWith("/login")) {
        return;
    }

    if (!token) {
        // console.log("Nema auth tokena, preusmjeravanje na login.");
        return;
        // return sendRedirect(event, "/login");
    }

    try {
        // Dekodiramo JWT (pretpostavka: Base64 kodiran JSON u payloadu)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRoles: string[] = payload.userRoles || [];

        const url = event.node.req.url || "";

        // Definiramo pravila pristupa
        const accessRules = [
            { path: "/kpkr", requiredRole: "AP001" },
            { path: "/kesp", requiredRole: "AP002" },
            { path: "/admin", requiredRolePrefix: "AD" }
        ];

        // Provjera uloga prema pravilima
        for (const rule of accessRules) {
            if (url.startsWith(rule.path)) {
                const hasAccess = rule.requiredRole
                    ? userRoles.includes(rule.requiredRole)
                    : userRoles.some(role => role.startsWith(rule.requiredRolePrefix || ""));

                if (!hasAccess) {
                    // console.log(`Pristup odbijen za ${url} zbog nedostatka potrebne uloge.`);
                    return sendRedirect(event, "/");
                }
            }
        }

        // console.log(`Pristup odobren za ${url} s ulogama:`, userRoles);
    } catch (error) {
        // console.error("Greška pri dekodiranju tokena:", error);
        return sendRedirect(event, "/login");
    }
});
