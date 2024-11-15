// stores/cardStore.js
import { base_url } from '#imports';
import { defineStore } from 'pinia';

export const useCardStore = defineStore('card', {
    state: () => ({
        cardId: null,
    }),
    actions: {
        setCardId(cardId) {
            this.cardId = cardId;
        },
        async fetchCardId() {
            try {
                const response = await $fetch(`${base_url}/user/get-cookie`, {
                    method: 'GET',
                    credentials: 'include',
                    params: {
                        names: 'id-izracuna',
                    },
                });
                console.log(response)
                if (response['id-izracuna']) {
                    this.setCardId(response['id-izracuna']);
                } else this.cardId = null;
            } catch (error) {
                console.error("Greška prilikom dohvaćanja ID-a:", error);
            }
        },
    },
});
