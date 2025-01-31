// stores/auth.ts
import { defineStore } from "pinia";
import { checkLogin } from "~/temp/checkLogin";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isLoggedin: null, // Početno nepoznato stanje
        userRoles: [],
        exp: null,
    }),
    actions: {
        async checkAuth() {
            console.log("Provjeravam status prijave...");
            try {
                this.isLoggedin = await checkLogin();
            } catch (error) {
                console.error("Greška prilikom provjere autentifikacije:", error);
                this.isLoggedin = false;
            }
        },

        async fetchUserInfo() {
            console.log("Dohvaćam korisničke podatke...");
            try {
                const { data } = await useFetch("/api/auth/info", {
                    credentials: "include",
                });

                if (data.value?.success) {
                    this.userRoles = data.value.userRoles;
                    this.exp = data.value.exp;
                } else {
                    console.error("Neuspješno dohvaćanje korisničkih podataka:", data.value?.error);
                }
            } catch (error) {
                console.error("Greška prilikom dohvaćanja korisničkih podataka:", error);
            }
        },
    },
});
