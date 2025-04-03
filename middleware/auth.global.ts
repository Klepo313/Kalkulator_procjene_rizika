// /middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Preskačemo provjere ako je korisnik na login stranici
    if (to.path === "/login") return;

    // Ako korisnik nije autentificiran, preusmjeravamo na login
    if (!authStore.isLoggedin) {
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }
});
