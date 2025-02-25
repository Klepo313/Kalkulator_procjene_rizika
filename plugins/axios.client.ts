import axios from 'axios'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  console.log("baseURL iz .environments: ", config.public.baseURL);
  // Kreiramo axios instancu s baznim URL-om iz runtime konfiguracije
  const api = axios.create({
    baseURL: config.public.baseURL,
    withCredentials: true, // omogućuje slanje kolačića s svakim zahtjevom
  })

  // Dodajemo interceptor koji će osvježiti auth sesiju prije svakog zahtjeva
  api.interceptors.request.use(
    async (requestConfig) => {
      // Izbjegavamo refresh za samu rutu osvježavanja kako ne bismo izazvali rekurziju
      if (requestConfig.url !== '/user/refresh_token') {
        try {
          // Pozivamo endpoint za osvježavanje tokena
          await api.post('/user/refresh_token', {
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('Greška kod osvježavanja tokena:', error)
          // Dodatno: možete implementirati logiku za odjavu korisnika ili obavještavanje
        }
      }
      return requestConfig
    },
    (error) => Promise.reject(error)
  )

  // Registriramo instancu tako da bude dostupna kroz Nuxt injektor
  nuxtApp.provide('api', api)
})
