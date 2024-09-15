<!-- eslint-disable no-constant-binary-expression -->
<!-- eslint-disable no-constant-binary-expression -->
<template>
    <div class="body">
        <div v-if="showPopup" :class="['success-popup', { error: !isSuccess }]">
            <font-awesome-icon :icon="isSuccess ? 'circle-check' : 'circle-exclamation'" />
            <span>
                {{ isSuccess ? 'Uspješno spremanje' : 'Spremanje nije uspjelo' }}
            </span>
            <div class="progress-bar"></div>
        </div>

        <main>
            <h1>Opći podaci</h1>
            <!-- <div v-if="opciStore.opci_podaci && odabraniDatum" class="main-grid"> -->
            <form v-if="(isNumber(idIzracuna) && hasSelectedValues()) || idIzracuna === '/'" class="main-grid">
                <label for="nazivIzracuna" class="header">Naziv predloška </label>
                <InputText id="nazivIzracuna" placeholder="Unesi naziv" :value="nazivIzracuna" :disabled="status"
                    @change="updateNazivIzracuna($event.target.value)" />
                <!-- :invalid="nazivIzracuna === (null || '')"-->
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header datum">
                    Datum
                    <span class="required">*</span>
                </div>
                <div class="grid-item datum">
                    <DatePicker v-model="odabraniDatum" show-icon fluid icon-display="input" input-id="icondisplay"
                        date-format="dd.mm.yy" class="form-input" placeholder="Odaberi datum" :disabled="status"
                        required @blur="updateDatum" /> <!--:invalid="odabraniDatum === null"-->
                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header">
                    Vrsta izračuna <span class="required">*</span>
                </div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaIzracuna" :options="vrsteIzracuna" option-label="tvz_naziv"
                        placeholder="Odaberi vrstu izračuna" class="form-input" :disabled="status" required
                        @change="updateVrstaIzracuna($event)">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.tvz_naziv }}</div>
                            </div>
                            <span v-else style="color: #aeb8c7">
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
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header">
                    Katastarska općina
                    <span class="required">*</span>
                </div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaKatastarskaOpcina" :suggestions="filtriraneKatastarskeOpcine"
                        placeholder="Unesi katastarsku općinu" :virtual-scroller-options="{ itemSize: 38 }"
                        :option-label="option => formatOption(option, 'kop_sif', 'kop_naziv')"
                        class="form-input input-opcina" :disabled="status" required @complete="searchKatastarskeOpcine"
                        @item-select="updateKatastarskaOpcina()" />

                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header">Katastarska čestica</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaKatastarskaCestica" :suggestions="filtriraneKatastarskeCestice"
                        id="kcs" placeholder="Unesi katastarsku česticu" :virtual-scroller-options="{ itemSize: 38 }"
                        option-label="kcs_sif" class="form-input" :disabled="!odabranaKatastarskaOpcina || status"
                        @complete="searchKatastarskeCestice" @update:model-value="updateKatastarskaCestica"
                        @item-select="onSelectKatastarskaCestica" />

                    <!-- <Select v-model="odabranaKatastarskaCestica" :options="katastarskeCestice" filter
                        option-label="kcs_sif" placeholder="Odaberi katastarsku česticu" class="form-input"
                        :disabled="!odabranaKatastarskaOpcina || status" @change="updateKatastarskaCestica">
                        
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.kcs_sif }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>

                        
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.kcs_sif }}</div>
                            </div>
                        </template>
                    </Select> -->

                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon v-if="messageCestica" :icon="'info-circle'" class="info-icon" />
                    <span v-if="messageCestica" class="info-text"> {{
                        messageCestica == `There is no particle data for given municipality.`
                            ? `Ne postoje podaci o česticama za odabranu općinu.`
                            : messageCestica
                    }}
                    </span>
                </div>

                <div class="grid-item header">
                    Vrsta imovine
                    <span v-if="odabranaVrstaIzracuna.tvz_naziv == 'Imovina'" class="required">*</span>
                </div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaObjekta" :options="vrsteObjekta" option-label="tvo_naziv"
                        placeholder="Odaberi vrstu objekta" class="form-input"
                        :disabled="odabranaVrstaIzracuna.tvz_naziv == 'Proces' || status"
                        :required="odabranaVrstaIzracuna.tvz_naziv == 'Imovina'" @change="updateVrstaObjekta($event)">
                        <!--:style="{ opacity: odabranaVrstaIzracuna.tvz_naziv === 'Proces' ? 0.6 : 1 }"-->
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.tvo_naziv }}</div>
                            </div>
                            <span v-else style="color: #aeb8c7">
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
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header">
                    Djelatnost
                    <span v-if="odabranaVrstaIzracuna.tvz_naziv == 'Proces'" class="required">*</span>
                </div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaDjelatnost" :suggestions="filtriraneDjelatnosti"
                        :placeholder="odabranaVrstaIzracuna.tvz_naziv == 'Imovina' ? '' : 'Unesi djelatnost'"
                        :virtual-scroller-options="{ itemSize: 38 }"
                        :option-label="option => formatOption(option, 'djl_sif', 'djl_naziv')" class="form-input"
                        :disabled="odabranaVrstaIzracuna.tvz_naziv == 'Imovina' || status"
                        :required="odabranaVrstaIzracuna.tvz_naziv == 'Proces'" @complete="searchDjelatnosti"
                        @item-select="updateDjelatnost()" />
                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header">Skupina djelatnosti</div>
                <div class="grid-item"> <!--:disabled="odabranaVrstaIzracuna.tvz_naziv === 'Imovina' || status"-->
                    <InputText class="form-input dataInput" type="text" :value="odabranaSkupinaDjelatnosti" readonly
                        :disabled="odabranaVrstaIzracuna.tvz_naziv === 'Imovina' || status"
                        :placeholder="odabranaVrstaIzracuna.tvz_naziv === 'Imovina' ? null : 'Popuni podatke na formi za prikaz skupine djelatnosti'" />
                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header">Ispostava</div>
                <div class="grid-item">
                    <InputText class="form-input dataInput" type="text"
                        :value="odabranaIspostava ? odabranaIspostava.isp_naziv : ''" readonly
                        placeholder="Popuni podatke na formi za prikaz ispostave" /> <!--disabled-->
                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header">Područni ured</div>
                <div class="grid-item">
                    <InputText class="form-input dataInput" type="text"
                        :value="odabraniPodrucniUred ? odabraniPodrucniUred.puk_naziv : ''" readonly
                        placeholder="Popuni podatke na formi za prikaz područnog ureda" />
                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>

                <div class="grid-item header napomena">Napomena</div>
                <div class="grid item">
                    <Textarea auto-resize rows="5" cols="30" placeholder="Unesi napomenu" style="width: 100%;"
                        :value="napomena" @blur="updateNapomena($event.target.value)" />
                </div>
                <div class="grid-item info-div">
                    <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                    <!-- <span class="info-text">{{ messageCestica }}</span> -->
                </div>
            </form>
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
            <!-- <nuxt-link to="/predlosci" class="footer-link prethodni">
                <font-awesome-icon icon="arrow-left-long" />
                Prethodni izračuni
            </nuxt-link> -->
            <button id="saveBtn" type="button" @click="saveFormData" :disabled="!isFormValid">
                <font-awesome-icon icon="save" class="save-icon" />
                Spremi
            </button>
            <button @click="navigateTo('/predlozak/mjere-prilagodbe')" class="footer-button">
                <span>Mjere prilagodbe</span>
                <font-awesome-icon icon="arrow-right-long" />
            </button>
        </footer>
        <div class="pop-up">
            <div class="pop-up-content">
                Da
            </div>
        </div>
    </div>
</template>

<script setup>

import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { ref, onMounted, onBeforeUnmount } from "vue" //onBeforeMount
import { useOpciStore, useIzracunStore } from '~/stores/main-store';
import { formatDateToDMY } from '~/utils/dateFormatter'

definePageMeta({
    middleware: [
        'auth',
        'izracun'
    ],
});


const idIzracuna = ref(
    useCookie('id_izracuna').value == '/' ||
        useCookie('id_izracuna') == undefined
        ? '/'
        : parseInt(useCookie('id_izracuna').value)
);

// const cookie = useCookie('id_izracuna');

const napomena = ref();
const messageCestica = ref(null);
// const messageDjeltanost = ref(null);

// vrsta izracuna kolačić
const vrstaIzracuna = useCookie('vrsta_izracuna', {
    // httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // Cookie will expire in 7 days
    path: '/', // Cookie available throughout the app
    secure: process.env.ENVIRONMENT === 'PRODUCTION', // Secure cookies in production // true, //process.env.ENVIRONMENT === 'PRODUCTION', // Secure cookies in production
    sameSite: process.env.ENVIRONMENT === 'PRODUCTION' ? 'None' : 'Lax', // Use 'None' only in production
    // secure: true, // Only send cookie over HTTPS
    // sameSite: 'none' // Protect against CSRF attacks
});

// Kreiramo instancu storea
const opciStore = useOpciStore();
const izracunStore = useIzracunStore();

// Kreiramo ref za `Date` objekt datuma
const nazivIzracuna = ref(null);
const odabraniDatum = ref(null);
const odabranaVrstaIzracuna = ref({
    tvz_naziv: '',
    tvz_id: '',
});
const odabranaKatastarskaOpcina = ref(null);
const odabranaKatastarskaCestica = ref(null);
const odabranaVrstaObjekta = ref(null);
const odabranaDjelatnost = ref(null);
const odabranaSkupinaDjelatnosti = ref(null);
const odabranaIspostava = ref({
    isp_naziv: null,
    isp_sif: null,
});
const odabraniPodrucniUred = ref({
    puk_naziv: null,
    puk_sif: null,
});

const status = ref(0);

const isSuccess = ref(true);
const showPopup = ref(false);

// const obaveznaPolja = ref(
//     odabranaVrstaIzracuna.value.tvz_naziv == 'Proces'
//         ? ['odabraniDatum', 'odabranaVrstaIzracuna', 'odabranaKatastarskaOpcina', 'odabranaDjelatnost']
//         : ['odabraniDatum', 'odabranaVrstaIzracuna', 'odabranaKatastarskaOpcina', 'odabranaVrstaObjekta']);

// const obaveznaPolja = ref({
//     odabraniDatum,
//     odabranaVrstaIzracuna,
//     odabranaKatastarskaOpcina
// });

const obaveznaPolja = ref([
    'odabraniDatum',
    'odabranaVrstaIzracuna',
    'odabranaKatastarskaOpcina'
])

watch(() => odabranaVrstaIzracuna.value.tvz_naziv, (newVal) => {
    console.log("Novi vrsta izračuna: ", newVal);
    if (newVal === 'Proces') {
        obaveznaPolja.value = [
            'odabraniDatum',
            'odabranaVrstaIzracuna',
            'odabranaKatastarskaOpcina',
            'odabranaDjelatnost',
        ]
    } else {

        obaveznaPolja.value = [
            'odabraniDatum',
            'odabranaVrstaIzracuna',
            'odabranaKatastarskaOpcina',
            'odabranaVrstaObjekta',
        ]
    }
});

watch(idIzracuna, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
        await opciStore.fetchCalculation(newValue);
        fillFormData();
    }
});

function handleBeforeUnload(event) {
    // Provjeri da li su varijable promijenjene
    if (odabraniDatum.value !== null ||
        odabranaVrstaIzracuna.value !== '' ||
        odabranaKatastarskaOpcina.value !== null ||
        odabranaKatastarskaCestica.value !== '' ||
        odabranaVrstaObjekta.value !== null ||
        odabranaDjelatnost.value !== null ||
        odabranaSkupinaDjelatnosti.value !== null ||
        odabranaIspostava.value !== null ||
        odabraniPodrucniUred.value !== null ||
        nazivIzracuna.value !== null ||
        napomena.value !== null) {

        // Otvori dijalog za upozorenje
        event.preventDefault();
        event.returnValue = 'Imate nespremljene promjene. Jeste li sigurni da želite napustiti ovu stranicu?'; // Ovo je potrebno za kompatibilnost s različitim preglednicima
    }
}


onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
});

onMounted(async () => {

    window.addEventListener('beforeunload', handleBeforeUnload);

    resetForm();
    cleanOpciStore();
    izracunStore.idIzracuna = idIzracuna.value == '/' ? 0 : idIzracuna.value;

    console.log("ID izračuna u storeu: ", izracunStore.idIzracuna);

    console.log("ID izračuna u indexu: ", idIzracuna.value);

    if (idIzracuna.value !== '/') {
        await opciStore.fetchCalculation(idIzracuna.value);
        fillFormData();
    } else {
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
    odabranaKatastarskaOpcina.value = null;
    odabranaKatastarskaCestica.value = '';
    odabranaVrstaObjekta.value = null;
    odabranaDjelatnost.value = null;
    odabranaSkupinaDjelatnosti.value = null;
    odabranaIspostava.value = null;
    odabraniPodrucniUred.value = null;
    nazivIzracuna.value = null;
    napomena.value = null;
    // odabraniDatum.value = null;
    // odabranaVrstaIzracuna.value = '';
    // odabranaKatastarskaOpcina.value = '';
    // odabranaKatastarskaCestica.value = '';
    // odabranaVrstaObjekta.value = '';
    // odabranaDjelatnost.value = '';
    // odabranaSkupinaDjelatnosti.value = '';
    // odabranaIspostava.value = null;
    // odabraniPodrucniUred.value = null;
    // nazivIzracuna.value = '';
    // napomena.value = '';
};

const cleanOpciStore = () => {
    opciStore.opci_podaci.aiz_datum = '';
    opciStore.opci_podaci.aiz_djl_id = 0;
    opciStore.opci_podaci.aiz_djl_id_sk = 0;
    opciStore.opci_podaci.aiz_id = 0;
    opciStore.opci_podaci.aiz_kcs_id = 0;
    opciStore.opci_podaci.aiz_kop_id = 0;
    opciStore.opci_podaci.aiz_status = 0;
    opciStore.opci_podaci.aiz_tvo_id = 0;
    opciStore.opci_podaci.aiz_tvz_id = 0;
    opciStore.opci_podaci.aiz_opis = '';
    opciStore.opci_podaci.aiz_napomena = '';
    opciStore.opci_podaci.djl_naziv = '';
    opciStore.opci_podaci.djl_naziv_sk = '';
    opciStore.opci_podaci.djl_sif = '';
    opciStore.opci_podaci.isp_naziv = '';
    opciStore.opci_podaci.kcs_sif = '';
    opciStore.opci_podaci.kop_naziv = '';
    opciStore.opci_podaci.kop_sif = '';
    opciStore.opci_podaci.puk_naziv = '';
    opciStore.opci_podaci.tvo_naziv = '';
    opciStore.opci_podaci.tvz_naziv = '';

    opciStore.katastarske_cestice = [];
    opciStore.katastarske_opcine = [];
    opciStore.vrste_izracuna = [];
    opciStore.vrste_objekta = [];
    opciStore.djelatnosti = [];
    opciStore.skupina_djelatnosti = [];
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
            kop_sif: data.kop_sif,
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

        if (odabranaVrstaIzracuna.value.tvz_naziv == 'Imovina') {
            odabranaDjelatnost.value = null;
            odabranaSkupinaDjelatnosti.value = null;
        } else if (odabranaVrstaIzracuna.value.tvz_naziv == 'Proces') {
            odabranaVrstaObjekta.value = null;
        }

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

const isFormValid = computed(() => {
    return obaveznaPolja.value.every(field => eval(field).value); // Provjera jesu li sva obavezna polja popunjena
});

// Provjera validnosti forme
// const isFormValid = computed(() => {
//     return Object.keys(obaveznaPolja.value).every(fieldKey => {
//         const fieldValue = obaveznaPolja.value[fieldKey]?.value;
//         if (fieldKey === 'odabranaKatastarskaOpcina') {
//             // Provjera da li je stvarno odabrana opcija s kop_id
//             return fieldValue && fieldValue.kop_id;
//         }
//         // Provjera da li su ostala polja popunjena
//         return fieldValue !== null && fieldValue !== '';
//     });
// });



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

    if (event.value.tvz_naziv == 'Imovina') {
        odabranaDjelatnost.value = null;
        odabranaSkupinaDjelatnosti.value = null;
    } else if (event.value.tvz_naziv == 'Proces') {
        odabranaVrstaObjekta.value = null;
    }

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

// const updateKatastarskaCestica = (newValue) => {
//     console.log("Nova vrijednost katastarske čestice:", newValue);
//     if (newValue) {
//         opciStore.opci_podaci.aiz_kcs_id = newValue.kcs_id;
//         opciStore.opci_podaci.kcs_sif = newValue.kcs_sif;
//     }
// };

const privremenaKatastarskaCestica = ref(null);

const updateKatastarskaCestica = (newValue) => {
    console.log("Nova vrijednost katastarske čestice:", newValue);
    // Čuvamo privremenu vrijednost, ali je ne spremamo odmah u store
    privremenaKatastarskaCestica.value = newValue;
};

// Funkcija se poziva kad je stvarna stavka odabrana iz dropdown-a
const onSelectKatastarskaCestica = (selectedValue) => {
    if (selectedValue.value) {
        opciStore.opci_podaci.aiz_kcs_id = selectedValue.value.kcs_id;
        opciStore.opci_podaci.kcs_sif = selectedValue.value.kcs_sif;
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
};

const updateNapomena = (value) => {
    napomena.value = value;
    opciStore.opci_podaci.aiz_napomena = value;
};


const saveFormData = async () => {
    if (isFormValid.value) {
        console.log("Forma je validna i podaci su spremljeni.")
        try {
            const response = await opciStore.saveData();
            const responseId = response.resId;
            const responseStatus = response.status;

            isSuccess.value = responseStatus == 200;
            showPopup.value = true;

            // Uklanjanje popup-a nakon 3 sekunde
            setTimeout(() => {
                showPopup.value = false;
            }, 3000);

            if (idIzracuna.value == '/') {
                idIzracuna.value = parseInt(responseId)
                izracunStore.idIzracuna = '/';
                izracunStore.updateIdIzracuna(responseId);
                document.cookie = "id_izracuna=" + encodeURIComponent(idIzracuna.value) + "; path=/";

                console.log('res-id: ', parseInt(idIzracuna.value));
            }

        } catch (error) {
            isSuccess.value = false;
            showPopup.value = true;

            setTimeout(() => {
                showPopup.value = false;
            }, 3000);
            console.error('Došlo je do pogreške prilikom spremanja podataka:', error);
        }
    } else {
        console.log("Forma nije validna.");
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

// const fetchParticles = (id) => {
//     if (!id) return; // Ensure ID is valid
//     console.log('odabranaKatastarskaOpcina:', odabranaKatastarskaOpcina.value);
//     console.log('Id:', id);

//     // Assuming fetchParticlesForMunicipalities returns a promise or updated value
//     opciStore.fetchParticlesForMunicipalities(id).then(response => {
//         katastarskeCestice.value = response; // Update computed value
//     }).catch(error => {
//         console.error('Error fetching particles:', error);
//     });
// };

const fetchParticles = (id) => {
    if (!id) return; // Provjeravamo je li ID validan
    console.log('odabranaKatastarskaOpcina:', odabranaKatastarskaOpcina.value);
    console.log('Id:', id);

    // Pozivamo funkciju iz storea
    opciStore.fetchParticlesForMunicipalities(id).then(response => {
        if (!response) {
            // Ako je response undefined, zabilježimo grešku
            console.error('Odgovor je undefined');
            messageCestica.value = 'Greška: Odgovor nije ispravan';
            return;
        }

        if (response.message) {
            // Ako postoji poruka, spremamo ju u messageCestica ref
            messageCestica.value = response.message;
            console.log("poruka: ", messageCestica.value);
            katastarskeCestice.value = []; // Očistimo čestice ako nema podataka
        } else if (response.particles) {
            // Ako postoje katastarske čestice, ažuriramo katastarskeCestice
            katastarskeCestice.value = response.particles;
            messageCestica.value = null; // Očistimo poruku ako ima čestica
        }
    }).catch(error => {
        console.error('Error fetching particles:', error);
        messageCestica.value = 'Došlo je do greške prilikom dohvaćanja podataka'; // Prikaži poruku o grešci
    });
};


const searchKatastarskeOpcine = (event) => {
    const query = event.query.toLowerCase();
    const _filteredItems = katastarskeOpcine.value.filter((item) =>
        String(item.kop_sif).toLowerCase().includes(query) || item.kop_naziv.toLowerCase().includes(query)
    );
    filtriraneKatastarskeOpcine.value = _filteredItems;
};

const searchDjelatnosti = (event) => {
    const query = event.query.toLowerCase();
    const _filteredItems = djelatnosti.value.filter((item) =>
        item.djl_naziv.toLowerCase().startsWith(query) || item.djl_sif.toLowerCase().startsWith(query)
    );
    filtriraneDjelatnosti.value = _filteredItems;
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

const formatOption = (option, sifKey, nazivKey) => {
    return `${option[sifKey]} - ${option[nazivKey]}`;
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
    gap: 26px;
}

h1 {
    width: 100%;
    text-align: left;
    padding-bottom: 7px;
    border-bottom: 2px solid var(--text-color);
}

.main-grid {
    width: 60%;
    display: grid;
    grid-template-columns: 150px 1fr auto;
    grid-template-rows: repeat(10, 38px) auto;
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

.info-div {
    position: relative;
    /* Potrebno za pozicioniranje apsolutnog elementa unutar ove div-e */
    margin-left: 5px;
}

.info-icon {
    color: var(--red-soft);
}

.info-icon:hover {
    color: var(--red);
}

.info-text {
    position: absolute;
    top: -25px;
    left: 25%;
    transform: translateX(-30%);

    background-color: rgba(0, 0, 0, 0.8);
    color: white;

    padding: 5px;
    border-radius: 3px;

    white-space: nowrap;
    visibility: hidden;

    transform: translateY(-10px);
    opacity: 0;
    transition: visibility 0s, opacity 0.2s ease-in-out;
}

.info-div:hover .info-text {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
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


#saveBtn:disabled {
    background: rgb(216, 216, 216);
    /* Svijetlo siva pozadina */
    color: black;
    /* border: none; */
    /* Boja teksta */
    cursor: not-allowed;
    /* Pokazivač miša pokazuje da nije moguće kliknuti */
    pointer-events: none;
    /* Onemogućava sve interakcije miša */
    opacity: 0.6;
    /* Smanjena vidljivost */
}

#saveBtn:disabled:hover,
#saveBtn:disabled:active,
#saveBtn:disabled>.save-icon {
    background-color: rgb(232, 232, 232);
    /* Uklanja hover i active efekte */
    color: black;
    /* Zadržava boju teksta */
}

.header,
.grid-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.form-input,
.p-inputtext {
    width: 100% !important;
    height: 100% !important;
}

.dataInput {
    cursor: default;
    background-color: rgba(20, 82, 28, 0.03);
}

.dataInput:disabled {
    background-color: #eef1f6;
    border: 1px solid #e0e6ed;
}

input {
    width: 100% !important;
    height: 100% !important;
}

.input-opcina {
    text-transform: uppercase !important;
}

.p-select:active {
    border: var(--border) !important;
}

.p-select-label {
    display: flex !important;
    align-items: center !important;
}

.p-select.p-component.p-inputwrapper.form-input {
    padding: 2px 0px !important;
}

/*
.p-inputtext.p-component.p-autocomplete-input.form-input {
    width: 100% !important;
    height: 100% !important;
}

.p-autocomplete {
    width: 100% !important;
    height: 100% !important;
}

.kcs {
    width: 100% !important;
} */


.napomena {
    /* margin-top: 34px; */
    align-items: flex-start;
    padding-top: 12px;
}

textarea {
    /* margin-top: 34px; */
    padding: 12px;
    height: auto !important;
    width: 100%;
    box-sizing: border-box;
    resize: none;
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

.footer-button {
    color: white;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.footer-button * {
    color: white;
}

.prethodni {
    /* background-color: none;
    color: var(--text-color);
    border: var(--border);
    border-radius: var(--border-form-radius); */
    color: var(--primary-color);
    font-weight: bold;
    /* text-decoration: underline; */
}

.prethodni * {
    color: var(--primary-color);
}

.required {
    color: var(--red-soft);
}

@media screen and (max-width: 1500px) {

    .main-grid,
    .header-grid {
        width: 70%;
    }
}

@media screen and (max-width: 1350px) {
    .info-text {
        left: auto;
        right: 0;
        transform: translateX(0);
    }

}

@media screen and (max-width: 1280px) {

    .main-grid,
    .header-grid {
        width: 100%;
    }

}

.success-popup {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 12px 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    background-color: rgb(43, 133, 43);
    /* Zelena boja za uspjeh */
    border-radius: 5px;
    overflow: hidden;
    /* Osigurava da progress bar bude unutar popup-a */
    transition: all 0.5s ease-in-out;
    /* Animacija za pojavu i nestajanje */
}

.success-popup.error {
    background-color: var(--red-soft);
    /* Crvena boja za grešku */
}

.success-popup * {
    color: white;
}

.progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.6);
    /* Bijela boja progress bara */
    animation: progress 3s linear forwards;
    /* 3 sekunde trajanje */
}

@keyframes progress {
    from {
        width: 100%;
    }

    to {
        width: 0;
    }
}
</style>