// middleware/auth-role.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore();

    // Ako korisnik nema definirane role ili nijedna ne počinje s "AD", preusmjeri na "/"
    const hasAccess = authStore.userRoles.some(role => role.startsWith("AD"));

    if (!hasAccess) {
        return navigateTo("/");
    }
});
