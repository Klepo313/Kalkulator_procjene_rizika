// /middleware/auth.global.ts
// export default defineNuxtRouteMiddleware((to, from) => {
//     const userStore = useUserStore();

//     if (to.path === "/login") return;
    
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
