// middleware/auth-role.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore();

    const hasAccess = authStore.userRoles.includes("AP001");
    //c// console.log("KPKR: ??? ", hasAccess);

    if (!hasAccess) {
        return navigateTo("/");
    }
});