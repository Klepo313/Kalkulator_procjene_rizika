// // /middleware/auth.global.ts
// export default defineNuxtRouteMiddleware((to, from) => {
//     const authStore = useAuthStore();
//     const userStore = useUserStore();

//     // Preskačemo provjere ako je korisnik na login stranici
//     if (to.path === "/login") return;

//     // Ako korisnik nije autentificiran, preusmjeravamo na login
//     if (!userStore.isLoggedin) {
//         return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
//     }
// });

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Preskoči provjeru ako je ruta /login
    if (to.path === "/login") return;

    // Dinamički importiraj funkciju za provjeru autentifikacije
    const { checkAuth } = await import("~/composables/useAuth");

    // Čekaj da se provjera autentifikacije završi
    await checkAuth();

    // Opcionalno: ako korisnik nije autentificiran, možeš preusmjeriti na login
    const userStore = useUserStore();
    if (!userStore.isLoggedin) {
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }
});
