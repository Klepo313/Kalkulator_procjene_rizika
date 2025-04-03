// /stores/auth.ts
export const useAuthStore = defineStore("auth", {
    state: () => ({
        isLoggedin: null, // Početno nepoznato stanje
        // userRoles: [],
        exp: null,
    }),
    actions: {
        async checkAuth() {
            try {
                const config = useRuntimeConfig();
                const baseUrl = config.public.BASE_URL;
                const response = await $fetch(`${baseUrl}/user/is_loggedin`, {
                    method: "GET",
                    credentials: "include",
                });
                this.isLoggedin = !!response?.isLoggedin;
            } catch (error: any) {
                if (error?.response?.status === 401) {
                    this.isLoggedin = false;
                }
            }
        }
    }
});
