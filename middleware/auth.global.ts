// /middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useAuthStore();

    const route = useRoute(); // Dohvaćamo trenutnu rutu

    // Ako je korisnik na /login stranici, ne radimo provjere autentifikacije
    if (route.path === "/login") {
        console.log("Na login stranici - preskačemo auth provjere.");
        return;
    }

    console.log("user mid: ", user);
    if (!user.isLoggedin) {
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }
})
