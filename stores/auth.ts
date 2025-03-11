// /stores/auth.js
import axios from 'axios';
import { defineStore } from 'pinia';
import { checkLogin } from '~/service/user/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedin: false,
    userRoles: [],
    exp: null,
    initialized: false, // Nova zastavica
  }),
  actions: {
    async checkAuth() {
      try {
        // Primjer poziva endpointa koji provjerava status autentifikacije
        const { data } = await useFetch('/api/auth/info');
        const { success, userRoles, exp } = data.value;
        console.log("checkAuth: ", success, userRoles, exp);

        console.log("checkAuth: ", success, userRoles, exp);

        if(success) {
            this.isLoggedin = true;
            this.userRoles = userRoles || [];
            this.exp = exp;
        } else {
            this.isLoggedin = false;
        }
      } catch (err) {
        this.isLoggedin = false;
      }
    },
  },
});
