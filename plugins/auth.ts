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
      userStore.isLoggedin = true;
      const userData = await userStore.getAll;
      // console.log("userData", userData);

      userStore.updateAll({
        name: userData?.name,
        surname: userData?.surname,
        username: userData?.username,
        email: userData?.email,
        roles: userData?.roles,
    });

    } else {
      userStore.isLoggedin = false;
    }
  } catch (error: any) {
    // Ako API vraća status 401, označavamo korisnika kao neautentificiranog
    if (error?.response?.status === 401) {
      userStore.isLoggedin = false;
    } else {
      // console.error("Greška prilikom provjere autentifikacije:", error);
    }
  }
});