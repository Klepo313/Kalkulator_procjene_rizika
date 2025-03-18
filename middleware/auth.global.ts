// /middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useAuthStore();

    if (to.path === "/login") {
        // console.log("Na login stranici - preskačemo auth provjere.");
        return;
    }

    if (!user.isLoggedin) {
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }
});
  
