// middleware/auth-role.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(() => {
    // const authStore = useAuthStore();

    // const hasAccess = authStore.userRoles.includes("AP002");
    // // console.log("roles: ", authStore.userRoles);
    // // console.log("KESP: ??? ", hasAccess);

    // if (!hasAccess) {
    //     return navigateTo("/");
    // }
});