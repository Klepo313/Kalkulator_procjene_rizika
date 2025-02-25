// // /plugins/axios.js
// import axios from 'axios'
// const isDev = process.env.NODE_ENV === 'development';

// export default defineNuxtPlugin((nuxtApp) => {
//     const apiClient = axios.create({
//         baseURL: isDev
//             ? `http://localhost:4000`
//             : `https://cadastre-server-mz7l.onrender.com`, // Promijeni u svoj URL
//         withCredentials: true, // Ako koristiš kolačiće za refresh_token
//     })

//     // Dodaj Authorization header
//     apiClient.interceptors.request.use((config) => {
//         const token = useCookie('userToken').value
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`
//         }
//         return config
//     })

//     // Rukuj greškama (npr. 401 Unauthorized)
//     apiClient.interceptors.response.use(
//         (response) => response,
//         async (error) => {
//             const originalRequest = error.config

//             if (error.response?.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true
//                 try {
//                     const { data } = await apiClient.post('/user/refresh_token') // Poziv API-ja za osvježavanje
//                     useCookie('userToken').value = data.accessToken;
//                     apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
//                     originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
//                     return apiClient(originalRequest) // Ponovi originalni zahtjev
//                 } catch (refreshError) {
//                     console.error('Osvježavanje tokena nije uspjelo:', refreshError)
//                     // Opcionalno: Redirect na login
//                     navigateTo('/login')
//                     return Promise.reject(refreshError)
//                 }
//             }

//             return Promise.reject(error)
//         }
//     )

//     // Pružamo instancu u Nuxt aplikaciji
//     nuxtApp.provide('api', apiClient)
// })
