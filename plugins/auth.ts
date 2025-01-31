import { useAuthStore } from "~/stores/auth";
import { useRoute } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore();
    const route = useRoute(); // Dohvaćamo trenutnu rutu

    // Ako je korisnik na /login stranici, ne radimo provjere autentifikacije
    if (route.path === "/login") {
        console.log("Na login stranici - preskačemo auth provjere.");
        return;
    }

    if (nuxtApp.ssrContext?.event.context.isLoggedin !== undefined) {
        authStore.isLoggedin = nuxtApp.ssrContext.event.context.isLoggedin;
    } else {
        authStore.checkAuth();
    }

    // Nakon provjere prijave, dohvatimo podatke korisnika
    authStore.fetchUserInfo();
});
