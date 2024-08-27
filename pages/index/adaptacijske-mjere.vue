<template>
    <div class="body">
        <main>
            <h1>Adaptacijske mjere</h1>
            <div class="main-content">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th style="width: 20%;">Šifra mjere</th>
                            <th style="width: 80%;">Naziv mjere</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="odabraneMjere.length === 0">
                            <td colspan="2" style="font-style: italic;">
                                <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                                Tablica prazna
                            </td>
                        </tr>
                        <!-- <tr v-if="adaptStore.odabrane_mjere.length === 0">
                            <td colspan="2" style="font-style: italic;">
                                <font-awesome-icon icon="spinner" style="margin-right: 5px;" spin />
                                Učitavanje podataka
                            </td>
                        </tr> -->
                        <tr v-for="mjera in odabraneMjere" :key="mjera.tva_sif">
                            <td>{{ mjera.tva_sif }}</td>
                            <td>{{ mjera.tva_naziv }}</td>
                            <td class="empty-th">
                                <font-awesome-icon icon="minus" class="minus-icon" style="margin-right: 15px;"
                                    @click="removeMjera(mjera)" />
                            </td>
                        </tr>

                    </tbody>
                </table>
                <div class="newRow">
                    <Select v-model="selectedMjera" :options="mjere" filter :option-label="formatOption"
                        placeholder="Izaberi mjeru" class="select-mjere" />
                    <button class="newMjeraBtn" @click="addMjera">
                        <font-awesome-icon icon="plus" />
                        <span>Dodaj mjeru</span>
                    </button>
                </div>
            </div>
        </main>
        <footer>
            <nuxt-link to="/" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Opći podaci
            </nuxt-link>
            <button class="footer-btn" @click="toRizikSazetak">
                Prikaži rizik
                <font-awesome-icon icon="arrow-right-long" style="margin-left: 10px;" />
            </button>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo } from '#app';
import { useAdaptStore } from '~/stores/main-store';

const adaptStore = useAdaptStore();

const idIzracuna = ref(
    useCookie('id_izracuna').value == '/' ?
        '/' : parseInt(useCookie('id_izracuna').value)
);

onMounted(async () => {
    adaptStore.odabrane_mjere = [];
    adaptStore.adaptacijske_mjere = [];
    if (!(idIzracuna.value == '/')) {
        await adaptStore.fetchMetrictypes(idIzracuna.value);
        await adaptStore.fetchMetrictypes();
        console.log('Uspješno dohvaćen izračun.', adaptStore.odabrane_mjere);
        console.log('Uspješno dohvaćen izračun.', adaptStore.adaptacijske_mjere);
    } else {
        console.log('ID izračuna je "/", nećemo dohvatiti adaptacijske mjere.');
    }

});

const toRizikSazetak = () => {
    navigateTo('/rizik-sazetak');
};

const selectedMjera = ref(null);

const mjere = computed(() => {
    const niz = adaptStore.adaptacijske_mjere;
    return niz;
})

const odabraneMjere = computed(() => adaptStore.odabrane_mjere);


// const addMjera = () => {
//     if (selectedMjera.value && !odabraneMjere.value.some(mjera => mjera.tva_sif === selectedMjera.value.tva_sif)) {
//         // Dodavanje kopije objekta u reaktivni niz
//         odabraneMjere.value = [...odabraneMjere.value, { ...selectedMjera.value }];
//         // Resetovanje odabranog objekta
//         selectedMjera.value = null;
//     }
// };


// const removeMjera = (mjera) => {
//     console.log("Mjera", mjera);
//     odabraneMjere.value = odabraneMjere.value.filter(item => item.tva_sif !== mjera.tva_sif);
//     console.log("Removed Mjera", odabraneMjere.value);
// };

const addMjera = async () => {
    if (selectedMjera.value && !adaptStore.odabrane_mjere.some(mjera => mjera.tva_sif === selectedMjera.value.tva_sif)) {
        adaptStore.odabrane_mjere.push({ ...selectedMjera.value });

        const response = await adaptStore.addMetrictype(idIzracuna.value, selectedMjera.value.tva_id)
        console.log("dodano-povratno: ", response)

        selectedMjera.value = null; // Resetuj odabranu meru nakon dodavanja
    }
};

const removeMjera = async (mjera) => {
    console.log(idIzracuna.value, mjera.tva_id)
    adaptStore.odabrane_mjere = adaptStore.odabrane_mjere.filter(item => item.tva_sif !== mjera.tva_sif);
    const response = await adaptStore.deleteMetrictype(idIzracuna.value, mjera.tva_id)
    console.log("uklonjeno-povratno: ", response)
};


const formatOption = (option) => {
    return `${option.tva_sif} - ${option.tva_naziv}`;
};

</script>

<style scoped>
.body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

h1 {
    width: 100%;
    text-align: left;
    padding-bottom: 7px;
    border-bottom: 2px solid var(--text-color);
}

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
}

.main-content {
    width: 50%;
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.custom-table th,
.custom-table td {
    height: 42.5px;
    padding: 5px 12px;

    color: var(--text-color);
    text-align: left;
    border-bottom: var(--border);
}

.custom-table thead th {
    background-color: var(--input-focus-color);
    font-weight: bold;
}

.empty-th {
    color: var(--red) !important;
    text-align: right !important;
    /* 
    display: flex;
    align-items: center;
    justify-content: flex-end; */
}

.minus-icon {
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
}

.minus-icon:hover {
    background-color: #a32b2b20;
}

th:first-child {
    border-top-left-radius: 5px;
}

th:last-child {
    border-top-right-radius: 5px;
}

.custom-table tbody tr:nth-child(even) {
    background-color: var(--bg-color);
}

.custom-table tbody tr:nth-child(odd) {
    background-color: var(--bg-color);
}

.grid-item {
    outline: auto;
}

.action-div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info {
    margin-top: 10px;
    opacity: 0.5;
}

#saveBtn {
    width: 150px;
    background: none;
    border: var(--border);
    color: var(--text-color);
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

#saveBtn:hover {
    background-color: var(--primary-color);
    color: white;
}

#saveBtn:hover>.save-icon {
    color: white;
}

#saveBtn:active {
    background-color: var(--primary-color-focus);
}

.newRow {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.select-mjere {
    width: 100%;
}

.newMjeraBtn {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.newMjeraBtn span {
    text-wrap: nowrap;
}

.p-select {
    height: 38px !important;
    width: 100%;
    padding-top: 2px !important;
    background-color: var(--input-color) !important;
    border: var(--border) !important;
    border-radius: var(--border-form-radius) !important;
    color: var(--text-color);
}

.p-select-label {
    display: flex !important;
    align-items: center !important;
}

.p-select-label.p-placeholder span {
    opacity: 0.4;
}


@media screen and (max-width: 1500px) {
    .main-content {
        width: 70%;
    }
}

@media screen and (max-width: 1280px) {
    .main-content {
        width: 100%;
    }
}
</style>