// /middleware/userRoles.global.ts
import { defineNuxtRouteMiddleware, navigateTo, useRoute } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    const excludedPaths = [
        "/login",
        "/user/change-password",
    ];

    // Ako je korisnik već na toj ruti ili ide na isključenu rutu, preskoči provjeru
    if (from.path === to.path || excludedPaths.includes(to.path)) {
        // console.info(`'${to.path}' - preskačemo auth provjere.`);
        return;
    }

    const userRoles = authStore.userRoles;
    //c// console.log("Roles middleware (klijent):", userRoles);

    // Definiramo pravila pristupa
    const accessRules = [
        { path: "/kpkr", requiredRole: "AP001" },
        { path: "/kesp", requiredRole: "AP002" },
        { path: "/admin", requiredRolePrefix: "AD" }
    ];

    // Provjera uloga prema pravilima
    for (const rule of accessRules) {
        if (to.path.startsWith(rule.path)) {
            const hasAccess = rule.requiredRole
                ? userRoles.includes(rule.requiredRole)
                : userRoles.some(role => role.startsWith(rule.requiredRolePrefix || ""));

            if (!hasAccess) {
                console.warn(`Pristup odbijen za ${to.path} zbog nedostatka potrebne uloge.`);
                return navigateTo("/");
            }
        }
    }

    //c// console.log(`Pristup odobren za ${to.path} s ulogama:`, userRoles);
});
