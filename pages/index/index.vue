<!-- eslint-disable no-constant-binary-expression -->
<!-- eslint-disable no-constant-binary-expression -->
<template>
    <div class="body">
        <main>
            <h1>Opći podaci</h1>
            <div v-if="opciStore.opci_podaci.length > 0 && odabraniDatum" class="main-grid">
                <div class="grid-item header">Datum</div>
                <div class="grid-item">
                    <DatePicker v-model="odabraniDatum" show-icon fluid icon-display="input" input-id="icondisplay"
                        date-format="dd.mm.yy" class="form-input" placeholder="Odaberi datum" />
                </div>

                <div class="grid-item header">Vrsta izračuna</div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaIzracuna" :options="vrsteIzracuna" option-label="tvz_naziv"
                        placeholder="Odaberi vrstu izračuna" class="form-input">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.tvz_naziv }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.tvz_naziv }}</div>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="grid-item header">Katastarska općina</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaKatastarskaOpcina" :suggestions="filtriraneKatastarskeOpcine"
                        placeholder="Unesi katastarsku općinu" :virtual-scroller-options="{ itemSize: 38 }"
                        option-label="kop_naziv" class="form-input" @complete="searchKatastarskeOpcine"
                        @blur="fetchParticles(parseInt(odabranaKatastarskaOpcina?.aiz_kop_id))" />
                </div>

                <div class="grid-item header">Katastarska čestica</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaKatastarskaCestica" :suggestions="filtriraneKatastarskeCestice"
                        placeholder="Unesi katastarsku česticu" :virtual-scroller-options="{ itemSize: 38 }"
                        option-label="kcs_sif" class="form-input" :disabled="!odabranaKatastarskaOpcina"
                        @complete="searchKatastarskeCestice" />
                </div>

                <div class="grid-item header">Vrsta objekta</div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaObjekta" :options="vrsteObjekta" option-label="tvo_naziv"
                        placeholder="Odaberi vrstu objekta" class="form-input"
                        :disabled="odabranaVrstaIzracuna.tvz_naziv == 'Proces'"
                        :style="{ opacity: odabranaVrstaIzracuna.tvz_naziv === 'Proces' ? 0.6 : 1 }">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.tvo_naziv }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.tvo_naziv }}</div>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="grid-item header">Djelatnost</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaDjelatnost" :suggestions="filtriraneDjelatnosti"
                        placeholder="Unesi djelatnost" :virtual-scroller-options="{ itemSize: 38 }"
                        :option-label="formatOption" class="form-input"
                        :disabled="odabranaVrstaIzracuna.tvz_naziv == 'Imovina'" @complete="searchDjelatnosti" />
                </div>

                <div class="grid-item header">Skupina djelatnosti</div>
                <div class="grid-item">
                    <!-- <AutoComplete v-model="odabranaSkupinaDjelatnosti" :suggestions="filtriraneSkupineDjelatnosti"
                        @complete="searchSkupineDjelatnosti" placeholder="Unesi djelatnost"
                        :virtualScrollerOptions="{ itemSize: 38 }" :optionLabel="formatOption" class="form-input">
                    </AutoComplete> -->
                    <input class="dataInput" type="text" disabled :value="odabranaSkupinaDjelatnosti"
                        placeholder="Popuni podatke na formi za prikaz skupine djelatnosti">
                </div>

                <div class="grid-item header">Ispostava</div>
                <div class="grid-item">
                    <input class="dataInput" type="text" disabled :value="odabranaIspostava"
                        placeholder="Popuni podatke na formi za prikaz ispostave">
                </div>

                <div class="grid-item header">Područni ured</div>
                <div class="grid-item">
                    <input class="dataInput" type="text" disabled :value="odabraniPodrucniUred"
                        placeholder="Popuni podatke na formi za prikaz područnog ureda">
                </div>
            </div>
            <span v-else style="font-style: italic;">
                Učitavanje podataka
                <font-awesome-icon icon="spinner" spin />
            </span>
            <span class="map-link" @click="openMapPopUp">
                <font-awesome-icon icon="arrow-up-right-from-square" />
                <span>
                    Otvori katastarsku mapu i odaberi česticu
                </span>
            </span>
        </main>
        <footer>
            <!-- <div class="action-div"> -->
            <nuxt-link to="/predlosci" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Prethodni izračuni
            </nuxt-link>
            <button id="saveBtn" type="button">
                <font-awesome-icon icon="save" class="save-icon" />
                Spremi
            </button>
            <!-- <span class="info">
                        <font-awesome-icon icon="info-circle" class="info-icon" />
                        Klikom na dugme <b>'Spremi'</b> više <b> <u> nećete </u> </b> moći praviti promjene na poljima
                        za
                        popunjavanje.
                    </span> -->
            <!-- </div> -->
            <nuxt-link to="/adaptacijske-mjere" class="footer-link">
                Adaptacijske mjere
                <font-awesome-icon icon="arrow-right-long" />
            </nuxt-link>
        </footer>
        <div class="pop-up">
            <div class="pop-up-content">
                Da
            </div>
        </div>
    </div>
</template>

<script setup>

// definePageMeta({
//     middleware: [
//         'auth',
//     ],
// });

import { ref, onBeforeMount } from "vue"
import { useOpciStore } from '~/stores/main-store';
import { formatDateToDMY } from '~/utils/dateFormatter'

const idIzracuna = parseInt(useCookie('id_izracuna').value);
console.log("idIzracuna: ", idIzracuna)

// Kreiramo instancu storea
const opciStore = useOpciStore();

// Kreiramo ref za `Date` objekt datuma
const odabraniDatum = ref(); // new Date()
const odabranaVrstaIzracuna = ref({
    tvz_naziv: '',
});
const odabranaKatastarskaOpcina = ref(null);
const odabranaKatastarskaCestica = ref(null);
const odabranaVrstaObjekta = ref();
const odabranaDjelatnost = ref();
const odabranaSkupinaDjelatnosti = ref();
const odabranaIspostava = ref();
const odabraniPodrucniUred = ref();

onBeforeMount(async () => {
    if (opciStore.opci_podaci.length <= 0) {
        await opciStore.fetchCalculation(idIzracuna);
    }
    await opciStore.fetchCalculationTypes();
    await opciStore.fetchObjectTypes();
    await opciStore.fetchActivities();
    await opciStore.fetchMunicipalities();
    fillFormData();
})

watch(odabranaKatastarskaOpcina, (newVal) => {
    if (newVal) {
        fetchParticles(parseInt(newVal.aiz_kop_id));
    }
});

const fillFormData = () => {
    if (opciStore.opci_podaci.length > 0) {
        const data = opciStore.opci_podaci[0];

        // Ensure these values match the data structure
        odabraniDatum.value = formatDateToDMY(data.aiz_datum) || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaVrstaIzracuna.value = { tvz_naziv: data.tvz_naziv } || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaKatastarskaOpcina.value = { aiz_kop_id: data.aiz_kop_id, kop_naziv: data.kop_naziv } || null;
        odabranaKatastarskaCestica.value = data.kcs_sif || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaVrstaObjekta.value = { tvo_naziv: data.tvo_naziv } || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaDjelatnost.value = { djl_sif: data.djl_sif, djl_naziv: data.djl_naziv } || null;
        odabranaSkupinaDjelatnosti.value = data.djl_naziv_sk || null;
        odabranaIspostava.value = data.isp_naziv || null;
        odabraniPodrucniUred.value = data.puk_naziv || null;

        console.log("Odabrana katastarska opcina: ", odabranaKatastarskaOpcina.value);
        fetchParticles(odabranaKatastarskaOpcina.value);

        //     console.log("Odabrani datum: ", odabraniDatum.value);
        //     console.log("Odabrana vrsta izračuna: ", odabranaVrstaIzracuna.value);
        //     console.log("Odabrana katastarska opcina: ", odabranaKatastarskaOpcina.value);
        //     console.log("Odabrana katastarska čestica: ", odabranaKatastarskaCestica.value);
        //     console.log("Odabrana vrsta objekta: ", odabranaVrstaObjekta.value);
        //     console.log("Odabrana djelatnost: ", odabranaDjelatnost.value);
        //     console.log("Odabrana skupina djelatnosti: ", odabranaSkupinaDjelatnosti.value);
        //     console.log("Odabrana ispostava: ", odabranaIspostava.value);
        //     console.log("Odabrani podrucni ured: ", odabraniPodrucniUred.value);
    }
}

// Kreiramo computed property za datum, koji je povezan s storeom
// const datum = computed({
//     get: () => opciStore.opci_podaci.datum,
//     set: (value) => {
//         opciStore.setOpciPodaci({ datum: value });
//     },
// });

// Kreiramo ref za formatirani datum
// const formattedDatum = computed({
//     get: () => formatDateToDDMMYYYY(datum.value),
//     set: (value) => {
//         const [day, month, year] = value.split('.').map(Number);
//         datum.value = new Date(year, month - 1, day).toISOString();
//     },
// });

// // Funkcija za formatiranje datuma
// function formatDateToDDMMYYYY(date) {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0'); // Mjeseci su 0-indeksirani
//     const year = d.getFullYear();
//     return `${day}.${month}.${year}`;
// }

// Funkcija za postavljanje datuma u store
// const updateDatum = () => {
//     opciStore.setOpciPodaci({ datum: odabraniDatum.value.toISOString() });
// };

// Metoda za ažuriranje vrste izračuna
// const updateVrstuIzracuna = () => {
//     opciStore.setOpciPodaci({ vrsta_izracuna: odabranaVrstaIzracuna.value });
// };

// const updateKatastarskaOpcina = () => {
//     opciStore.setOpciPodaci({ katastarska_opcina: odabranaKatastarskaOpcina.value });

// }

// const updateKatastarskaCestica = () => {
//     opciStore.setOpciPodaci({ katastarska_cestica: odabranaKatastarskaCestica.value });
// };

// const updateVrstaObjekta = () => {
//     opciStore.setOpciPodaci({ vrsta_objekta: odabranaVrstaObjekta.value });
// };

// const updateDjelatnost = () => {
//     opciStore.setOpciPodaci({ djelatnost: odabranaDjelatnost.value });
// };

// Metoda za inicijalizaciju podataka iz kolačića
// const initFromCookies = () => {
//     opciStore.initFromCookies();

//     const initialDate = new Date(opciStore.opci_podaci.datum);
//     if (!isNaN(initialDate.getTime())) {
//         odabraniDatum.value = initialDate;
//     }

//     const savedVrstaIzracuna = opciStore.opci_podaci.vrsta_izracuna;
//     if (savedVrstaIzracuna) {
//         odabranaVrstaIzracuna.value = vrsteIzracuna.value.find(
//             (option) => option.name === savedVrstaIzracuna.name
//         );
//     }

//     const savedKatastarskaOpcina = opciStore.opci_podaci.katastarska_opcina
//     if (savedKatastarskaOpcina) {
//         odabranaKatastarskaOpcina.value = katastarskeOpcine.value.find(
//             (option) => option.name === savedKatastarskaOpcina.name
//         );
//     }

//     const savedKatastarskaCestica = opciStore.opci_podaci.katastarska_cestica
//     if (savedKatastarskaCestica) {
//         odabranaKatastarskaCestica.value = katastarskeCestice.value.find(
//             (option) => option.name === savedKatastarskaCestica.name
//         );
//     }

//     const savedVrstaObjekta = opciStore.opci_podaci.vrsta_objekta
//     if (savedVrstaObjekta) {
//         odabranaVrstaObjekta.value = vrsteObjekta.value.find(
//             (option) => option.name === savedVrstaObjekta.name
//         );
//     }

//     const savedDjelatnost = opciStore.opci_podaci.djelatnost
//     if (savedDjelatnost) {
//         odabranaDjelatnost.value = djelatnosti.value.find(
//             (option) => option.name === savedDjelatnost.name
//         );
//     }
// };

// onMounted(() => {
//     initFromCookies();
// })

const filtriraneKatastarskeOpcine = ref();
const filtriraneKatastarskeCestice = ref();
const filtriraneDjelatnosti = ref();

const vrsteIzracuna = computed(() => {
    const niz = opciStore.vrste_izracuna;
    return niz;
})
const katastarskeOpcine = computed(() => {
    const niz = opciStore.katastarske_opcine;
    return niz;
})
const katastarskeCestice = computed(() => {
    const niz = opciStore.katastarske_cestice;
    return niz;
})
const vrsteObjekta = computed(() => {
    const niz = opciStore.vrste_objekta;
    return niz;
})
const djelatnosti = computed(() => {
    const niz = opciStore.djelatnosti;
    return niz;
})

const fetchParticles = (id) => {
    if (!id) return; // Ensure ID is valid
    console.log('odabranaKatastarskaOpcina:', odabranaKatastarskaOpcina.value);
    console.log('Id:', id);

    // Assuming fetchParticlesForMunicipalities returns a promise or updated value
    opciStore.fetchParticlesForMunicipalities(id).then(response => {
        katastarskeCestice.value = response; // Update computed value
    }).catch(error => {
        console.error('Error fetching particles:', error);
    });
};

const searchKatastarskeOpcine = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const query = event.query;
    const _filteredItems = [];

    for (let i = 0; i < katastarskeOpcine.value.length; i++) {
        const item = katastarskeOpcine.value[i];

        if (item.kop_naziv.toLowerCase().indexOf(query.toLowerCase()) === 0) {
            _filteredItems.push(item);
        }
    }

    filtriraneKatastarskeOpcine.value = _filteredItems;
};

const searchKatastarskeCestice = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const query = event.query;
    const _filteredItems = [];

    for (let i = 0; i < katastarskeCestice.value.length; i++) {
        const item = katastarskeCestice.value[i];

        if (item.kcs_sif.toLowerCase().indexOf(query.toLowerCase()) === 0) {
            _filteredItems.push(item);
        }
    }

    filtriraneKatastarskeCestice.value = _filteredItems;
};

const formatOption = (option) => {
    return `${option.djl_sif} - ${option.djl_naziv}`;
};

const searchDjelatnosti = (event) => {
    // Normalizacija upita za pretragu
    const query = event.query.toLowerCase();
    const _filteredItems = djelatnosti.value.filter((item) =>
        item.djl_naziv.toLowerCase().includes(query) || item.djl_sif.toLowerCase().includes(query)
    );
    filtriraneDjelatnosti.value = _filteredItems;
};


</script>

<style scoped>
* {
    color: var(--text-color);
}

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

.main-grid {
    width: 50%;
    display: grid;
    grid-template-columns: 150px 1fr;
    grid-template-rows: repeat(9, 38px);
    gap: 5px;
}

.action-div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info {
    opacity: 0.5;
}

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
}

.map-link {
    outline: none;
    text-decoration: none;
    color: var(--primary-color);
}

.map-link>* {
    color: var(--primary-color);
}

.map-link>span {
    margin-left: 5px;
    text-decoration: underline;
}

#saveBtn {
    width: 150px;
    background: none;
    border: var(--border);
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

.header {
    display: flex;
    align-items: center;
}

.form-input {
    width: 100%;
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

.dataInput {
    padding-left: 12px;
}

.dataInput:hover {
    border: var(--border) !important;
    background-color: var(--input-color) !important;
}

.pop-up {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    padding: 13px;

    background: rgba(30, 30, 30, 0.4);
}

.pop-up-content {
    width: 100%;
    height: 100%;
}

footer {
    justify-content: space-between;
}

@media screen and (max-width: 1500px) {
    .main-grid {
        width: 70%;
    }
}

@media screen and (max-width: 1280px) {
    .main-grid {
        width: 100%;
    }
}
</style>