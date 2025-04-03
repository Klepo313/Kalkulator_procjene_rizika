// /plugins/auth.client.ts
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const route = useRoute();

  // Na login stranici preskačemo provjere
  if (route.path === "/login") return;

  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseURL;
    // Poziv API-ja za refresh token
    const response = await $fetch(`${baseUrl}/user/is_loggedin`, {
      method: "GET",
      credentials: "include",
    });

    // Ako API vraća { isLoggedin: true } postavljamo stanje na true
    if (response?.isLoggedin) {
      authStore.isLoggedin = true;
      const userData = await userStore.getAll;
      console.log("userData", userData);

      userStore.updateAll({
        name: userData?.name,
        surname: userData?.surname,
        username: userData?.username,
        email: userData?.email,
        roles: userData?.roles,
    });

    } else {
      authStore.isLoggedin = false;
    }
  } catch (error: any) {
    // Ako API vraća status 401, označavamo korisnika kao neautentificiranog
    if (error?.response?.status === 401) {
      authStore.isLoggedin = false;
    } else {
      console.error("Greška prilikom provjere autentifikacije:", error);
    }
  }
});


// // /plugins/auth.ts
// import { useAuthStore } from "~/stores/auth";
// import { useRoute } from "#app";

// export default defineNuxtPlugin(async (nuxtApp) => {
//   const authStore = useAuthStore();
//   const route = useRoute(); // Dohvaćamo trenutnu rutu

//   if (route.path === "/login") {
//     // Na login stranici preskačemo provjere
//     return;
//   }

//   // Ako smo na serveru, koristimo podatke iz SSR konteksta
//   if (import.meta.server) {
//     console.log("Server Provjera autentifikacije...", authStore.isLoggedin);
//     if (nuxtApp.ssrContext?.event.context.isLoggedin !== undefined) {
//       console.log("Server UŠLO 1");
//       authStore.isLoggedin = nuxtApp.ssrContext.event.context.isLoggedin;
//       authStore.userRoles = nuxtApp.ssrContext.event.context.userRoles || [];
//       authStore.exp = nuxtApp.ssrContext.event.context.exp || null;
//     }
//   }
  
//   // Na klijentskoj strani, ako je potrebno, izvrši dodatnu provjeru samo ako stanje nije već postavljeno
//   if (import.meta.client) {
//     console.log("Client Provjera autentifikacije...", authStore.isLoggedin);
//     if (!authStore.isLoggedin) {
//       authStore.checkAuth();
//       console.log("Client UŠLO 2");
//     }
//   }
// });
