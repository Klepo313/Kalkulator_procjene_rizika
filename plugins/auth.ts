// /plugins/auth.ts
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "#app";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  const route = useRoute(); // Dohvaćamo trenutnu rutu

  if (route.path === "/login") {
    // Na login stranici preskačemo provjere
    return;
  }

  // Ako smo na serveru, koristimo podatke iz SSR konteksta
  if (import.meta.server) {
    // console.log("Server Provjera autentifikacije...", authStore.isLoggedin);
    if (nuxtApp.ssrContext?.event.context.isLoggedin !== undefined) {
    //   console.log("Server UŠLO 1");
      authStore.isLoggedin = nuxtApp.ssrContext.event.context.isLoggedin;
      authStore.userRoles = nuxtApp.ssrContext.event.context.userRoles || [];
      authStore.exp = nuxtApp.ssrContext.event.context.exp || null;
    }
  }
  
  // Na klijentskoj strani, ako je potrebno, izvrši dodatnu provjeru samo ako stanje nije već postavljeno
  if (import.meta.client) {
    // console.log("Client Provjera autentifikacije...", authStore.isLoggedin);
    if (!authStore.isLoggedin) {
      authStore.checkAuth();
    //   console.log("Client UŠLO 2");
    }
  }
});
