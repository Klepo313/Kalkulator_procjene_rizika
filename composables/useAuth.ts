import { useRuntimeConfig, useRoute, useUserStore } from "#imports";

export const checkAuth = async () => {
    const userStore = useUserStore();
    const route = useRoute();

    // Ako je ruta /login, nema potrebe za provjerom
    if (route.path === "/login") return;

    try {
        const config = useRuntimeConfig();
        const baseUrl = config.public.baseURL;
        // API poziv za provjeru statusa autentifikacije
        const response = await $fetch(`${baseUrl}/user/is_loggedin`, {
            method: "GET",
            credentials: "include",
        });

        if (response?.isLoggedin) {
            userStore.isLoggedin = true;
            const userData = await userStore.getAll;
            await userStore.updateAll({
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
        if (error?.response?.status === 401) {
            userStore.isLoggedin = false;
        }
    }
};
