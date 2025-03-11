// /plugins/auth.ts
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "#app";
// import { useUserSession } from "#auth";

export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore();
    const route = useRoute(); // Dohvaćamo trenutnu rutu
    const { loggedIn, user } = useUserSession();

    // Ako je korisnik na /login stranici, ne radimo provjere autentifikacije
    if (route.path === "/login") {
        console.log("Na login stranici - preskačemo auth provjere.");
        return;
    }

    if (nuxtApp.ssrContext?.event.context.isLoggedin !== undefined) {
        authStore.isLoggedin = nuxtApp.ssrContext.event.context.isLoggedin || false;
        authStore.userRoles = nuxtApp.ssrContext.event.context.userRoles || [];
        authStore.exp = nuxtApp.ssrContext.event.context.exp || null;
    } else if (loggedIn.value) {
        authStore.isLoggedin = true;
        authStore.userRoles = user.userRoles || [];
        authStore.exp = user.exp || null;
    } else {
        authStore.checkAuth();
    }
});


// import { useAuthStore } from "~/stores/auth";
// import { useRoute } from "#app";

// export default defineNuxtPlugin((nuxtApp) => {
//     const authStore = useAuthStore();
//     const route = useRoute(); // Dohvaćamo trenutnu rutu

//     // Ako je korisnik na /login stranici, ne radimo provjere autentifikacije
//     if (route.path === "/login") {
//         console.log("Na login stranici - preskačemo auth provjere.");
//         return;
//     }

//     if (nuxtApp.ssrContext?.event.context.isLoggedin !== undefined) {
//         authStore.isLoggedin = nuxtApp.ssrContext.event.context.isLoggedin;
//         authStore.userRoles = nuxtApp.ssrContext.event.context.userRoles || [];
//         authStore.exp = nuxtApp.ssrContext.event.context.exp || null;
//     } else {
//         authStore.checkAuth();
//     }
// });
