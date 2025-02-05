// /middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useAuthStore();

    console.log("user: ", user);
    if (!user.isLoggedin) {
        return navigateTo('/login')
    }
})
