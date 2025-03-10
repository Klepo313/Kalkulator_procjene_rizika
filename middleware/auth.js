// middleware/auth.js
// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware(async () => {
    // const apiBase = useRuntimeConfig().public.baseUrl;

    // const checkLogin = async () => {
    //     try {
    //         const response = await $fetch(`${apiBase}/user/is_loggedin`, {
    //             method: 'GET',
    //             credentials: 'include',
    //         });
    //         return response; // Pretpostavka da vraća { isLoggedin: true/false }
    //     } catch (error) {
    //         console.error("Greška kod provjere prijave:", error);
    //         return { isLoggedin: false }; // Osiguraj fallback
    //     }
    // };

    // const response = await checkLogin();
    // // console.log("Provjera prijave:", response);

    // if (!response || !response.isLoggedin) {
    //     return navigateTo('/login');
    // }
});




// export default defineNuxtRouteMiddleware((to) => {
//     const token = useCookie('userToken');

//     // Ako korisnik nije prijavljen
//     if (!token.value) {
//         // Sačuvaj trenutnu rutu u query parametar `redirectTo`
//         return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
//     }

//     // console.log("User logged in");
// });
