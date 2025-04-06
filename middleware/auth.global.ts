// /middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    const userStore = useUserStore();

    // Preskačemo provjere ako je korisnik na login stranici
    if (to.path === "/login") return;

    // Ako korisnik nije autentificiran, preusmjeravamo na login
    if (!userStore.isLoggedin) {
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }
});
