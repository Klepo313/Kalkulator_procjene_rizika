// /plugins/auth.ts
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "#app";

export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore();
    const route = useRoute(); // Dohvaćamo trenutnu rutu

    // Ako je korisnik na /login stranici, ne radimo provjere autentifikacije
    if (route.path === "/login") {
        // console.log("Na login stranici - preskačemo auth provjere.");
        return;
    }

    console.log("Provjera autentifikacije...", authStore.isLoggedin);

    if (nuxtApp.ssrContext?.event.context.isLoggedin !== undefined) {
        authStore.isLoggedin = nuxtApp.ssrContext.event.context.isLoggedin;
        authStore.userRoles = nuxtApp.ssrContext.event.context.userRoles || [];
        authStore.exp = nuxtApp.ssrContext.event.context.exp || null;
    } else {
        authStore.checkAuth();
    }
});
