// stores/cardStore.js
import { defineStore } from 'pinia';

export const useCardStore = defineStore('card', {
    state: () => ({
        cardId: null,
        broj: null,
        vrstaIzracuna: '',
        scenarij: ''
    }),
    actions: {
        setCardId(cardId) {
            this.cardId = cardId;
        },
        setBroj(broj) {
            this.broj = broj;
        },
        setVrstaIzracuna(vrsta) {
            this.vrstaIzracuna = vrsta;
        },
        setScenarij(scenarij) {
            this.scenarij = scenarij;
        },
        resetCardStore() {
            this.cardId = null;
            this.broj = null;
            this.vrstaIzracuna = '';
            this.scenarij = '';
        }
    },
});
