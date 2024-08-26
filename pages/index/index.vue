<!-- eslint-disable no-constant-binary-expression -->
<!-- eslint-disable no-constant-binary-expression -->
<template>
    <div class="body">
        <main>
            <h1>Opći podaci</h1>
            <!-- <div v-if="opciStore.opci_podaci && odabraniDatum" class="main-grid"> -->
            <div v-if="(isNumber(idIzracuna) && hasSelectedValues()) || idIzracuna === '/'" class="main-grid">
                <label for="nazivIzracuna" class="header">Naziv izračuna</label>
                <input id="nazivIzracuna" class="dataInput" placeholder="Unesi naziv" :value="nazivIzracuna"
                    :disabled="status" @change="updateNazivIzracuna($event.target.value)">

                <div class="grid-item header datum">Datum</div>
                <div class="grid-item datum">
                    <DatePicker v-model="odabraniDatum" show-icon fluid icon-display="input" input-id="icondisplay"
                        date-format="dd.mm.yy" class="form-input" placeholder="Odaberi datum" :disabled="status"
                        @blur="updateDatum" />
                </div>

                <div class="grid-item header">Vrsta izračuna</div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaIzracuna" :options="vrsteIzracuna" option-label="tvz_naziv"
                        placeholder="Odaberi vrstu izračuna" class="form-input" :disabled="status"
                        @change="updateVrstaIzracuna($event)">
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
                        option-label="kop_naziv" class="form-input input-opcina" :disabled="status"
                        @complete="searchKatastarskeOpcine" @blur="updateKatastarskaOpcina()" />

                </div>

                <div class="grid-item header">Katastarska čestica</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaKatastarskaCestica" :suggestions="filtriraneKatastarskeCestice"
                        placeholder="Unesi katastarsku česticu" :virtual-scroller-options="{ itemSize: 38 }"
                        option-label="kcs_sif" class="form-input" :disabled="!odabranaKatastarskaOpcina || status"
                        @complete="searchKatastarskeCestice" @update:model-value="updateKatastarskaCestica()" />
                </div>

                <div class="grid-item header">Vrsta objekta</div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaObjekta" :options="vrsteObjekta" option-label="tvo_naziv"
                        placeholder="Odaberi vrstu objekta" class="form-input"
                        :disabled="odabranaVrstaIzracuna.tvz_naziv == 'Proces' || status"
                        :style="{ opacity: odabranaVrstaIzracuna.tvz_naziv === 'Proces' ? 0.6 : 1 }"
                        @change="updateVrstaObjekta($event)">
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
                        :placeholder="odabranaVrstaIzracuna.tvz_naziv == 'Imovina' ? '' : 'Unesi djelatnost'"
                        :virtual-scroller-options="{ itemSize: 38 }" :option-label="formatOption" class="form-input"
                        :disabled="odabranaVrstaIzracuna.tvz_naziv == 'Imovina' || status" @complete="searchDjelatnosti"
                        @blur="updateDjelatnost()" />
                </div>

                <div class="grid-item header">Skupina djelatnosti</div>
                <div class="grid-item"> <!--:disabled="odabranaVrstaIzracuna.tvz_naziv === 'Imovina' || status"-->
                    <input class="form-input dataInput" type="text" disabled :value="odabranaSkupinaDjelatnosti"
                        :placeholder="odabranaVrstaIzracuna.tvz_naziv === 'Imovina' ? '' : 'Popuni podatke na formi za prikaz skupine djelatnosti'">

                </div>

                <div class="grid-item header">Ispostava</div>
                <div class="grid-item">
                    <input class="form-input dataInput" type="text" disabled
                        :value="odabranaIspostava ? odabranaIspostava.isp_naziv : ''"
                        placeholder="Popuni podatke na formi za prikaz ispostave">
                </div>

                <div class="grid-item header">Područni ured</div>
                <div class="grid-item">
                    <input class="form-input dataInput" type="text" disabled
                        :value="odabraniPodrucniUred ? odabraniPodrucniUred.puk_naziv : ''"
                        placeholder="Popuni podatke na formi za prikaz područnog ureda">
                </div>
                <div class="grid-item header napomena">Napomena</div>
                <div class="grid item">
                    <textarea auto-resize rows="5" cols="30" placeholder="Unesi napomenu" style="width: 100%;"
                        :value="napomena" @blur="updateNapomena($event.target.value)" />
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
            <button id="saveBtn" type="button" @click="saveFormData">
                <font-awesome-icon icon="save" class="save-icon" />
                Spremi
            </button>
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

import { ref, onMounted } from "vue" //onBeforeMount
import { useOpciStore, useIzracunStore } from '~/stores/main-store';
import { formatDateToDMY } from '~/utils/dateFormatter'

const idIzracuna = ref(
    useCookie('id_izracuna').value == '/' ?
        '/' : parseInt(useCookie('id_izracuna').value)
);
const nazivIzracuna = ref();
const cookie = useCookie('id_izracuna');

const napomena = ref();

console.log("index: ", idIzracuna.value);

// vrsta izracuna kolačić
const vrstaIzracuna = useCookie('vrsta_izracuna', {
    maxAge: 60 * 60 * 24 * 7, // Cookie will expire in 7 days
    path: '/', // Cookie available throughout the app
    secure: true, // Only send cookie over HTTPS
    sameSite: 'none' // Protect against CSRF attacks
});

// Kreiramo instancu storea
const opciStore = useOpciStore();
const izracunStore = useIzracunStore();

// Kreiramo ref za `Date` objekt datuma
const odabraniDatum = ref(); // new Date()
const odabranaVrstaIzracuna = ref({});
const odabranaKatastarskaOpcina = ref(null);
const odabranaKatastarskaCestica = ref(null);
const odabranaVrstaObjekta = ref(null);
const odabranaDjelatnost = ref(null);
const odabranaSkupinaDjelatnosti = ref();
const odabranaIspostava = ref({
    isp_naziv: null,
    isp_sif: null,
});
const odabraniPodrucniUred = ref({
    puk_naziv: null,
    puk_sif: null,
});

const status = ref(0);

watch(() => cookie.value, (newValue) => {
    idIzracuna.value = parseInt(newValue);
});

watch(idIzracuna, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
        await opciStore.fetchCalculation(newValue);
        fillFormData();
    }
});

onMounted(async () => {

    resetForm();

    if (idIzracuna.value !== '/') {
        await opciStore.fetchCalculation(idIzracuna.value);
        fillFormData();
    } else {
        // Ako je prazan, sve polja ostaju prazna (postavljena na početne vrijednosti)
        console.log("ID izračuna je prazan, forma ostaje prazna.");
    }

    await opciStore.fetchCalculationTypes();
    await opciStore.fetchObjectTypes();
    await opciStore.fetchActivities();
    await opciStore.fetchMunicipalities();

    console.log("Opci podaci: ", opciStore.opci_podaci);
});

const resetForm = () => {
    odabraniDatum.value = null;
    odabranaVrstaIzracuna.value = '';
    odabranaKatastarskaOpcina.value = '';
    odabranaKatastarskaCestica.value = '';
    odabranaVrstaObjekta.value = '';
    odabranaDjelatnost.value = '';
    odabranaSkupinaDjelatnosti.value = '';
    odabranaIspostava.value = null;
    odabraniPodrucniUred.value = null;
    nazivIzracuna.value = '';
    napomena.value = '';
};

const fillFormData = () => {
    if (opciStore.opci_podaci) {
        const data = opciStore.opci_podaci;
        // Ensure these values match the data structure
        odabraniDatum.value = formatDateToDMY(data.aiz_datum, '.') || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaVrstaIzracuna.value = {
            tvz_id: data.aiz_tvz_id,
            tvz_naziv: data.tvz_naziv
        } || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaKatastarskaOpcina.value = {
            aiz_kop_id: data.aiz_kop_id,
            kop_naziv: data.kop_naziv,
            isp_naziv: data.isp_naziv,
            puk_naziv: data.puk_naziv,
        } || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaKatastarskaCestica.value = {
            kcs_id: data.aiz_kcs_id,
            kcs_sif: data.kcs_sif
        } || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaVrstaObjekta.value = {
            tvo_id: data.aiz_tvo_id,
            tvo_naziv: data.tvo_naziv
        } || null;
        // eslint-disable-next-line no-constant-binary-expression
        odabranaDjelatnost.value = {
            djl_id: data.aiz_djl_id,
            djl_sif: data.djl_sif,
            djl_naziv: data.djl_naziv
        } || null;
        odabranaSkupinaDjelatnosti.value = data.djl_naziv_sk || null;
        //odabranaIspostava.value = data.isp_naziv || null;
        //odabraniPodrucniUred.value = data.puk_naziv || null;

        nazivIzracuna.value = data.aiz_opis;
        napomena.value = data.aiz_napomena;

        status.value = opciStore.opci_podaci.aiz_status;

        console.log("KO: ", odabranaKatastarskaOpcina.value)

        odabranaIspostava.value = {
            isp_sif: '2221',
            isp_naziv: odabranaKatastarskaOpcina.value.isp_naziv
        }

        odabraniPodrucniUred.value = {
            puk_sif: '2222',
            puk_naziv: odabranaKatastarskaOpcina.value.puk_naziv
        }

        vrstaIzracuna.value = odabranaVrstaIzracuna.value.tvz_naziv;
        fetchParticles(parseInt(odabranaKatastarskaOpcina.value.aiz_kop_id));
    }
}

const isNumber = (value) => {
    return !isNaN(parseInt(value));
}

const hasSelectedValues = () => {
    return odabraniDatum.value ||
        odabranaVrstaIzracuna.value?.tvz_id ||
        odabranaKatastarskaOpcina.value?.aiz_kop_id ||
        odabranaKatastarskaCestica.value?.kcs_id ||
        odabranaVrstaObjekta.value?.tvo_id ||
        odabranaDjelatnost.value?.djl_id ||
        nazivIzracuna.value ||
        napomena.value;
}

const updateNazivIzracuna = (value) => {
    nazivIzracuna.value = value;
    opciStore.opci_podaci.aiz_opis = value;
};

const updateDatum = () => {
    // console.log(formatDateToISO(odabraniDatum.value));
    opciStore.opci_podaci.aiz_datum = formatDateToDMY(odabraniDatum.value, '-');
    //console.log(formatDateToISO(odabraniDatum.value));
    console.log(formatDateToDMY(odabraniDatum.value, '-'));
};

const updateVrstaIzracuna = (event) => {
    odabranaVrstaIzracuna.value = event.value;
    //console.log("ovi: ", event.value.tvz_id, '-', event.value.tvz_naziv);
    opciStore.opci_podaci.aiz_tvz_id = event.value.tvz_id;
    opciStore.opci_podaci.tvz_naziv = event.value.tvz_naziv;
};

const updateKatastarskaOpcina = () => {
    console.log("odabrana: ", odabranaKatastarskaOpcina.value.kop_id)
    if (odabranaKatastarskaOpcina.value) {
        opciStore.opci_podaci.aiz_kop_id = odabranaKatastarskaOpcina.value.kop_id;
        opciStore.opci_podaci.kop_naziv = odabranaKatastarskaOpcina.value.kop_naziv;
        opciStore.opci_podaci.isp_naziv = odabranaKatastarskaOpcina.value.isp_naziv;
        opciStore.opci_podaci.puk_naziv = odabranaKatastarskaOpcina.value.puk_naziv;

        fetchParticles(parseInt(odabranaKatastarskaOpcina.value.kop_id));

        odabranaIspostava.value = {
            isp_sif: '2221',
            isp_naziv: odabranaKatastarskaOpcina.value.isp_naziv
        }

        odabraniPodrucniUred.value = {
            puk_sif: '2222',
            puk_naziv: odabranaKatastarskaOpcina.value.puk_naziv
        }
    }
};

const updateKatastarskaCestica = () => {
    if (odabranaKatastarskaCestica.value) {
        opciStore.opci_podaci.aiz_kcs_id = odabranaKatastarskaCestica.value.kcs_id;
        opciStore.opci_podaci.kcs_sif = odabranaKatastarskaCestica.value.kcs_sif;
    }
};

const updateVrstaObjekta = (event) => {
    if (event?.value) {
        odabranaVrstaObjekta.value = event.value;
        opciStore.opci_podaci.aiz_tvo_id = event.value.tvo_id;
        opciStore.opci_podaci.tvo_naziv = event.value.tvo_naziv;
    }
};

const updateDjelatnost = () => {
    console.log(odabranaDjelatnost.value);
    odabranaSkupinaDjelatnosti.value = odabranaDjelatnost.value.djl_naziv;
    opciStore.opci_podaci.aiz_djl_id = odabranaDjelatnost.value.djl_id;
    opciStore.opci_podaci.djl_naziv = odabranaDjelatnost.value.djl_naziv;
    //odabranaSkupinaDjelatnosti.value = 
};

const updateNapomena = (value) => {
    napomena.value = value;
    opciStore.opci_podaci.aiz_napomena = value;
};


const saveFormData = async () => {
    try {
        const responseId = await opciStore.saveData();
        idIzracuna.value = parseInt(responseId)

        izracunStore.updateIdIzracuna(responseId);

        document.cookie = "id_izracuna=" + encodeURIComponent(idIzracuna.value) + "; path=/";

        console.log('res-id: ', parseInt(idIzracuna.value));
    } catch (error) {
        console.error('Došlo je do pogreške prilikom spremanja podataka:', error);
    }
};

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
    grid-template-rows: repeat(9, 38px) auto;
    gap: 5px;
}

.header-grid {
    width: 50%;
    display: grid;
    grid-template-columns: 150px 1fr;
    grid-template-rows: 38px auto;
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

.form-input:disabled {
    border: 1px solid #dedfde !important;
    background-color: #f8f9f8 !important;
}

.disabled {
    opacity: 0.5;
}

.input-opcina {
    text-transform: uppercase !important;
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

.datum {
    gap: 34px;
}

.napomena {
    margin-top: 34px;
    align-items: flex-start;
    padding-top: 12px;
}

textarea {
    margin-top: 34px;
    padding: 12px;
    height: auto !important;
    width: 100%;
    box-sizing: border-box;
    resize: none;
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

    .main-grid,
    .header-grid {
        width: 70%;
    }
}

@media screen and (max-width: 1280px) {

    .main-grid,
    .header-grid {
        width: 100%;
    }
}
</style>