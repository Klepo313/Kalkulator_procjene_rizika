// stores/user.ts
import { defineStore } from "pinia";

export const useUserAuthStore = defineStore("user", {
    state: () => ({
        user: null as string | null, // Može biti null ako korisnik nije prijavljen
    }),
    actions: {
        async fetchUser() {
            if (!this.user) {
                const { data } = await useFetch("/api/user");
                this.user = data.value?.user ?? null;
            }
        },
        async logout() {
            this.user = null;
        },
    },
});
