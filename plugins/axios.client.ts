import axios from 'axios';
import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app';
import { useToast } from 'primevue/usetoast';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.baseURL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    async (requestConfig) => {
      const excludeRoutes = ['/user/refresh_token', '/user/login', '/user/logout'];

      if (excludeRoutes.includes(requestConfig.url || '')) {
        return requestConfig;
      }

      try {
        await api.post('/user/refresh_token', {}, {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        // Optionally handle refresh failure
      }

      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  // 🚨 Centralni interceptor za 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        const router = useRouter();
        const toast = useToast();

        toast.add({
          severity: 'warn',
          summary: 'Sesija istekla',
          detail: 'Molimo prijavite se ponovno.',
          life: 4000,
        });

        router.push('/login');
      }

      return Promise.reject(error);
    }
  );

  nuxtApp.provide('api', api);
});
