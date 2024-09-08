// stores/auth.js
import { defineStore } from 'pinia';
import { checkLogin } from '~/service/checkLogin';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedin: null as boolean | null, // Inicijalno nepoznato stanje
    }),
    actions: {
        async checkAuth() {
            console.log('Checking login status...');
            try {
                const loggedIn = await checkLogin();
                this.isLoggedin = loggedIn;
            } catch (error) {
                console.log(error)
                this.isLoggedin = false;
            }
        },
    },
});
