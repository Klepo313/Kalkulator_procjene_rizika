// /stores/auth.ts
export const useAuthStore = defineStore("auth", {
    state: () => ({
        isLoggedin: null, // Početno nepoznato stanje
        // userRoles: [],
        exp: null,
    })
});
