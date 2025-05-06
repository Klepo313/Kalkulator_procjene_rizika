// /composables/useAuth.ts
import { ref } from 'vue'

export const useAuth = () => {
    const userStore = useUserStore()
    const logoStore = useLogoStore()
    const isAuthReady = ref(false)
    const authPromise = ref<Promise<void> | null>(null)

    async function initAuth() {
        if (authPromise.value) return authPromise.value
        authPromise.value = (async () => {
            try {
                // const { isLoggedin } = await $fetch('/user/is_loggedin', {
                //     credentials: 'include'
                // })
                const config = useRuntimeConfig();
                const baseUrl = config.public.baseURL;
                const response = await $fetch(`${baseUrl}/user/is_loggedin`, {
                    method: "GET",
                    credentials: "include",
                });
                const isLoggedin = response?.isLoggedin;
                console.log('isLoggedin', isLoggedin)
                if (isLoggedin) {
                    userStore.isLoggedin = true
                    const userData = await userStore.getAll;

                    userStore.updateAll({
                        name: userData?.name,
                        surname: userData?.surname,
                        username: userData?.username,
                        email: userData?.email,
                        roles: userData?.roles,
                    });

                    await Promise.all(
                        ['logo'].map(async (key) => {
                            const blob = await $fetch(`${baseUrl}/user/logo/${key.toUpperCase()}`, {
                                responseType: 'blob',
                                credentials: 'include',
                            });
                            if (blob) {
                                logoStore.logos[key] = URL.createObjectURL(blob as Blob);
                            }
                        })
                    );
                } else {
                    userStore.$reset()
                }
            } catch {
                userStore.$reset()
            } finally {
                isAuthReady.value = true
            }
        })()
        return authPromise.value
    }

    return { initAuth, isAuthReady }
}
