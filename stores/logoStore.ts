import { defineStore } from 'pinia';
import { getLogo } from '~/service/user/blobs';

interface LogoState {
    logos: Record<string, string>;
}

export const useLogoStore = defineStore('logoStore', {
    state: (): LogoState => ({
        logos: {}, // npr. { main: 'blob:url', kpkr: 'blob:url', ... }
    }),

    getters: {
        getLogo: (state) => (key: string): string | undefined => {
            return state.logos[key];
        },
    },

    actions: {
        async fetchLogos(force = false) {
            const { $api } = useNuxtApp();

            if (!force && Object.keys(this.logos).length > 0) return;

            const logoKeys = ['logo'];

            try {
                const results = await Promise.all(
                    logoKeys.map(async (key) => {
                        const blob = await getLogo(key);
                        if (blob) {
                            return { key, url: URL.createObjectURL(blob) };
                        } else {
                            return { key, url: '' };
                        }
                    })
                );

                // Spremi u state
                this.logos = {};
                results.forEach(({ key, url }) => {
                    this.logos[key] = url;
                });
            } catch (error) {
                console.error('Greška pri dohvaćanju logotipova:', error);
            }
        },
    },
});
