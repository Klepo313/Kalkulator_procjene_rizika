// /middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
    // const api = useNuxtApp().$api
    // const token = useCookie('userToken').value
    // console.log("Evo tokena: ", token)

    // if (!token) {
    //     try {
    //         // Ako token ne postoji, pokušaj osvježiti sesiju
    //         const { data } = await api.post('/user/refresh_token')
    //         useCookie('userToken').value = data.accessToken;
    //         api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
    //     } catch (error) {
    //         console.error('Sesija je istekla. Preusmjeravam na login.', error)
    //         return navigateTo('/login') // Preusmjeri na login ako osvježavanje nije uspjelo
    //     }
    // }
})
