<template>
    <div class="body">
        <Toast />
        <Toast position="top-right" group="tc" />
        <template v-if="!loading">
            <main>
                <h1>
                    Opći podaci
                </h1>

                <Form v-slot="$form" :initial-values="initialValues" :resolver="resolver" :validateOnValueUpdate="true"
                    class="main-grid" @submit="onFormSubmit">
                    <div class="grid-item">
                        <label for="naziv" class="header">Naziv predloška:</label>
                        <InputText v-model="naziv" id="naziv" class="form-input" name="naziv"
                            placeholder="Unesi naziv predloška" fluid />
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>

                    <div class="grid-item">
                        <label for="datum" class="header">Datum</label>
                        <DatePicker v-model="datum" id="datum" class="form-input" name="datum" show-icon
                            icon-display="input" date-format="dd.mm.yy" placeholder="Unesi datum" fluid readonly />
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>


                    <div class="grid-item">
                        <label for="vrstaIzracuna" class="header">Vrsta izračuna</label>
                        <Select v-model="vrstaIzracuna" id="vrstaIzracuna" class="form-input" name="vrstaIzracuna"
                            :options="vrsteIzracuna" option-label="tvz_naziv" placeholder="Odaberi vrstu izračuna"
                            @change="handleVrstaIzracunaChange(1)" />
                        <div class="info-div">
                            <Message v-if="$form.vrstaIzracuna?.invalid && vrstaIzracuna?.tvz_naziv" severity="error"
                                size="small" variant="simple">
                                {{ $form.vrstaIzracuna.error.message }}
                            </Message>
                            <!-- <font-awesome-icon v-if="$form.vrstaIzracuna?.invalid"
                                v-tooltip.top="$form.vrstaIzracuna.error.message" :icon="'info-circle'"
                                style="color: var(--red-soft); cursor: pointer;" /> -->
                        </div>
                    </div>

                    <div class="grid-item">
                        <label for="katastarskaOpcina" class="header">Katastarska općina</label>
                        <AutoComplete v-model="katastarskaOpcina" id="katastarskaOpcina" name="katastarskaOpcina"
                            class="form-input autocomplete"
                            :option-label="option => formatOption(option, 'kop_sif', 'kop_naziv')"
                            :suggestions="filteredOpcine" @input="onInputChange" @complete="updateOpcina"
                            @item-select="fetchCestice" placeholder="Odaberi katastarsku općinu"
                            :disabled="!vrstaIzracuna">
                            <template #option="slotProps">
                                <span>{{ slotProps.option.kop_sif + ' - ' + slotProps.option.kop_naziv }}</span>
                            </template>
                        </AutoComplete>
                        <div class="info-div">
                            <!-- <font-awesome-icon v-if="$form.katastarskaOpcina?.invalid"
                                v-tooltip.top="$form.katastarskaOpcina.error.message" :icon="'info-circle'"
                                style="color: var(--red-soft); cursor: pointer;" /> -->
                        </div>
                    </div>
                    <div class="grid-item">
                        <label for="katastarskaCestica" class="header">Katastarska čestica</label>
                        <AutoComplete v-model="katastarskaCestica" id="katastarskaCestica" name="katastarskaCestica"
                            class="form-input autocomplete" option-label="kcs_sif" :suggestions="filteredCestice"
                            @complete="updateCestica" placeholder="Odaberi katastarsku česticu (opcionalno)"
                            :disabled="!katastarskaOpcina" />
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>
                    <div class="grid-item">
                        <label for="vrstaImovine" class="header">Vrsta imovine</label>
                        <Select v-model="vrstaImovine" id="vrstaImovine" class="form-input" name="vrstaImovine"
                            :options="vrsteImovine" option-label="tvo_naziv"
                            :placeholder="!vrstaIzracuna || isDjelatnost ? '' : 'Odaberi vrstu imovine'"
                            :disabled="!vrstaIzracuna || isDjelatnost" />
                        <!-- </Select> -->
                        <div class="info-div"><font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>
                    <div class="grid-item">
                        <label for="djelatnost" class="header">Djelatnost</label>
                        <AutoComplete v-model="djelatnost" id="djelatnost" name="djelatnost"
                            class="form-input autocomplete"
                            :option-label="option => formatOption(option, 'djl_sif', 'djl_naziv')"
                            :suggestions="filteredDjelatnost" @complete="updateDjelatnost"
                            @item-select="fetchSkupinuDjelatnosti"
                            :placeholder="!vrstaIzracuna || isImovina ? '' : 'Odaberi djelatnost'"
                            :disabled="!vrstaIzracuna || isImovina">
                            <template #option="slotProps">
                                <span>{{ slotProps.option.djl_sif + ' - ' + slotProps.option.djl_naziv }}</span>
                            </template>
                        </AutoComplete> <!--:disabled="!katastarskaOpcina" -->
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>
                    <div class="grid-item">
                        <label for="skupina" class="header">Skupina djelatnosti:</label>
                        <InputText :value="skupinaDjelatnosti.djl_skp_naziv" id="skupina" readonly
                            class="form-input dataInput" name="skupina"
                            :placeholder="!vrstaIzracuna || isImovina ? '' : 'Prikaz skupine djelatnosti'" fluid
                            :disabled="!vrstaIzracuna || isImovina" />
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>

                    <div class="grid-item">
                        <label for="scenariji" class="header">Klimatski scenarij:</label>
                        <div class="radio-button-container">
                            <div v-for="s in scenariji" :key="s.tvs_id" :title="s.tvs_naziv" class="radio-button">
                                <RadioButton v-model="scenarij" :input-id="s.tvs_sif" :value="s.tvs_sif"
                                    name="scenarij" />
                                <label :for="s.tvs_sif">{{ s.tvs_sif }}</label>
                            </div>
                        </div>
                        <!-- <font-awesome-icon v-if="$form.katastarskaOpcina?.invalid"
                            v-tooltip.top="$form.katastarskaOpcina.error.message" :icon="'info-circle'"
                            style="color: var(--red-soft); cursor: pointer;" /> -->

                        <!-- <RadioButtonGroup name="scenariji" class="radio-button-container" :disabled="!vrstaIzracuna">
                            <div v-for="s in scenariji" :key="s.tvs_id" :title="s.tvs_naziv" class="radio-button">
                                <RadioButton v-model="scenarij" :inputId="'rb-' + s.tvs_id" :value="s.tvs_id" />
                                <label :for="'rb-' + s.tvs_id">{{ s.tvs_sif }}</label>
                            </div>
                        </RadioButtonGroup> -->
                    </div>
                    <div class="grid-item">
                        <label for="ispostava" class="header">Ispostava:</label>
                        <InputText :value="ispostava.isp_naziv" id="ispostava" class="form-input dataInput"
                            name="ispostava" placeholder="Prikaz ispostave" fluid readonly :disabled="!vrstaIzracuna" />
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>
                    <div class="grid-item">
                        <label for="podrucniUred" class="header">Područni ured:</label>
                        <InputText :value="podrucniUred.puk_naziv" id="podrucniUred" class="form-input"
                            name="podrucniUred" placeholder="Prikaz područnog ureda" fluid readonly
                            :disabled="!vrstaIzracuna" />
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>
                    <div class="grid-item napomena">
                        <label for="napomena" class="header">Napomena:</label>
                        <Textarea v-model="napomena" id="napomena" rows="5" cols="30" class="form-input" name="napomena"
                            placeholder="Napomena" fluid />
                        <div class="info-div">
                            <font-awesome-icon :icon="'info-circle'" style="display: none;" />
                        </div>
                    </div>

                    <button id="saveBtn" type="submit">
                        <font-awesome-icon icon="save" class="save-icon" />
                        Spremi
                    </button>
                    <!-- <Button type="submit" severity="secondary" icon="pi pi-save" label="Spremi" /> -->
                    <span>
                        *Potrebno je popuniti sva obvezna polja (<span class="required">*</span>) kako bi se predložak
                        mogao
                        spremiti i
                        kako biste mogli
                        nastaviti u sljedeći korak.
                    </span>
                </Form>
                <div id="map" class="map">
                    <Map />
                </div>
            </main>
            <footer>
                <button class="footer-button" :disabled="!idIzracuna || idIzracuna == 0 || idIzracuna == 'null'"
                    @click="navigateWithParameter('/kpkr/predlozak/mjere-prilagodbe', 'id', cardStore.cardId)">
                    <span>Mjere prilagodbe</span>
                    <font-awesome-icon icon="arrow-right-long" />
                </button>
            </footer>
        </template>
        <template v-else>
            <main>
                <h1>
                    Opći podaci
                </h1>
                <span style="font-style: italic; display: flex; flex-direction: column; gap: 5px; max-width: 600px;">
                    <span v-for="n in 11" :key="n" style="display: flex; gap: 5px;">
                        <Skeleton width="7rem" height="2rem" />
                        <Skeleton width="100%" height="2rem" />
                    </span>
                    <Skeleton width="100%" height="6rem" />
                </span>
            </main>
        </template>
        <NespremljenePromjenePopup class="alert-popup" :visible="isNespremljenePromjenePopupVisible"
            @confirm="confirmLeave" @cancel="cancelLeave" />
        <LoadingSpremanje v-if="isLoadingPopupVisible" :message="'Spremanje promjena...'"
            :description="'Ovo može potrajati 10-ak sekundi.'" :loader="'SI'" class="loading-popup" />
    </div>
</template>

<script setup>

import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { ref, onMounted, onBeforeUnmount } from "vue" //onBeforeMount
import { useOpciStore, useIzracunStore } from '~/stores/main-store';
import { useCardStore } from '~/stores/index';
import { formatDateToDMY } from '~/utils/dateFormatter'
import { useRouter } from 'vue-router';

import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { saveForm } from "~/service/kpkr/form";
import { getCalculations } from "~/service/kpkr/calculations";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'; // Stilovi za traku učitavanja

definePageMeta({
    middleware: [
        'auth',
        'izracun'
    ],
});

const toast = useToast();

const opciStore = useOpciStore();
const cardStore = useCardStore();

const props = defineProps({
    aiz_id: String,
    data: Object,
})

const idIzracuna = ref(props.aiz_id || null);
const izracun = ref(props.data || null)

const naziv = ref('');
const datum = ref(new Date);
const vrstaIzracuna = ref(null);
const katastarskaOpcina = ref(null);
const katastarskaCestica = ref(null);
const vrstaImovine = ref(null);
const djelatnost = ref(null);
const skupinaDjelatnosti = ref({
    djl_skp: '',
    djl_skp_naziv: ''
});
const scenarij = ref('');
watch(scenarij, (newVal) => {
    console.log("Scenarij odabran: ", newVal);
});

const ispostava = ref({
    isp_sif: '',
    isp_naziv: ''
});
const podrucniUred = ref({
    puk_sif: '',
    puk_naziv: ''
});
const napomena = ref('');

const isImovina = computed(() => vrstaIzracuna.value?.tvz_naziv === "Imovina");
const isDjelatnost = computed(() => vrstaIzracuna.value?.tvz_naziv === "Djelatnost");

const isLoadingPopupVisible = ref(false)
const isNespremljenePromjenePopupVisible = ref(false)

const vrsteIzracuna = computed(() => {
    const niz = opciStore.vrste_izracuna;
    return niz;
})
const katastarskeOpcine = computed(() => {
    return opciStore.katastarske_opcine;
});
const katastarskeCestice = computed(() => {
    const niz = opciStore.katastarske_cestice;
    return niz;
})
const vrsteImovine = computed(() => {
    const niz = opciStore.vrste_objekta;
    return niz;
})
const djelatnosti = computed(() => {
    const niz = opciStore.djelatnosti;
    return niz;
})
const scenariji = computed(() => {
    const niz = opciStore.scenariji;
    return niz;
})

const dataLoader = computed(() =>
    vrsteIzracuna.value.length > 0 &&
    katastarskeOpcine.value.length > 0 &&
    vrsteImovine.value.length > 0 &&
    djelatnosti.value.length > 0 &&
    scenariji.value.length > 0
);

console.log("inicijalni dataLoader:", dataLoader.value);

const loading = ref(false)

const initialValues = ref({
    naziv: '',
    datum: '',
    vrstaIzracuna: null,
    katastarskaOpcina: null,
    katastarskaCestica: null,
    vrstaImovine: null,
    djelatnost: null,
    skupinaDjelatnosti: null,
    scenarij: '',
    ispostava: null,
    podrucniUred: null,
    napomena: ''
});

const formValues = ref({
    ...initialValues.value
});


// Praćenje nespremljenih promjena
const hasUnsavedChanges = computed(() => {
    return JSON.stringify(initialValues.value) !== JSON.stringify({
        naziv: naziv.value,
        datum: datum.value,
        vrstaIzracuna: vrstaIzracuna.value,
        katastarskaOpcina: katastarskaOpcina.value,
        katastarskaCestica: katastarskaCestica.value,
        vrstaImovine: vrstaImovine.value,
        djelatnost: djelatnost.value,
        skupinaDjelatnosti: skupinaDjelatnosti.value,
        scenarij: scenarij.value,
        ispostava: ispostava.value,
        podrucniUred: podrucniUred.value,
        napomena: napomena.value,
    });
});
watch(hasUnsavedChanges, () => {
    console.log("Promjene? ", hasUnsavedChanges.value);
})

const pendingNavigation = ref(null)

watch(isNespremljenePromjenePopupVisible, (newValue) => {
    if (newValue) {
        // Onemogući scrollanje
        document.body.style.overflow = 'hidden';
    } else {
        // Omogući scrollanje
        document.body.style.overflow = '';
    }
});

watch(isLoadingPopupVisible, (newValue) => {
    if (newValue) {
        // Onemogući scrollanje
        document.body.style.overflow = 'hidden';
    } else {
        // Omogući scrollanje
        document.body.style.overflow = '';
    }
});

const confirmLeave = () => {
    isNespremljenePromjenePopupVisible.value = false; // Sakrij popup

    if (pendingNavigation.value) {
        pendingNavigation.value(true); // Nastavi navigaciju
        pendingNavigation.value = null; // Resetiraj pending navigaciju
    }

    // Resetiraj prije osvježavanja
    window.removeEventListener('beforeunload', beforeWindowUnload);

    // Resetiraj promjene
    initialValues.value = {
        naziv: naziv.value,
        datum: datum.value,
        vrstaIzracuna: vrstaIzracuna.value,
        katastarskaOpcina: katastarskaOpcina.value,
        katastarskaCestica: katastarskaCestica.value,
        vrstaImovine: vrstaImovine.value,
        djelatnost: djelatnost.value,
        skupinaDjelatnosti: skupinaDjelatnosti.value,
        scenarij: scenarij.value,
        ispostava: ispostava.value,
        podrucniUred: podrucniUred.value,
        napomena: napomena.value,
    };
};



const cancelLeave = () => {
    isNespremljenePromjenePopupVisible.value = false; // Sakrij popup

    if (pendingNavigation.value) {
        pendingNavigation.value(false); // Zaustavi navigaciju
        pendingNavigation.value = null; // Resetiraj pending navigaciju
    }
};


// Upozorenje prilikom refreša stranice
const beforeWindowUnload = (event) => {
    if (hasUnsavedChanges.value) {
        // isNespremljenePromjenePopupVisible.value = false;
        event.preventDefault();
        event.returnValue = ''; // ili ""
    }
};

const router = useRouter();

router.beforeEach((to, from, next) => {
    console.log('Navigacija počinje:', to.fullPath);
    NProgress.start(); // Pokreni traku učitavanja
    if (hasUnsavedChanges.value) {
        // Pokaži popup i spremi referencu na `next`
        isNespremljenePromjenePopupVisible.value = true;
        // Spremljena funkcija za nastavak ili prekid navigacije
        pendingNavigation.value = (proceed) => {
            if (proceed === false) {
                console.log('Navigacija otkazana.');
                NProgress.done(); // Zaustavi traku učitavanja ako je navigacija otkazana
                next(false); // Spriječi navigaciju
            } else {
                console.log('Navigacija bez promjena, nastavljam.');
                next(); // Nastavi navigaciju
            }
            pendingNavigation.value = null; // Resetiraj pending navigaciju
        };
    } else {
        next(); // Ako nema promjena, odmah nastavi navigaciju
    }
});


router.afterEach(() => {
    NProgress.done(); // Zaustavi traku učitavanja kad je navigacija završena
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeWindowUnload);
});

onMounted(async () => {
    window.addEventListener('beforeunload', beforeWindowUnload);

    console.log("Preuzeti id izračuna iz predloška: ", idIzracuna.value);
    console.log("Preuzeti izračun iz predloška: ", izracun.value);

    if (!idIzracuna.value || idIzracuna.value == 'null') {
        idIzracuna.value = getIdFromUrl();
    }

    loading.value = true;
    if (idIzracuna.value) {
        try {
            const response = await getCalculations(idIzracuna.value)
            izracun.value = response.data[0]
            console.log("index izračun: ", izracun.value);
        } catch (error) {
            console.log(error);
            navigateTo('/kpkr/predlosci');
        }
    }

    if (idIzracuna.value && izracun.value) {
        const stopWatcher = watch(dataLoader, async (loaded) => {
            if (loaded) {
                console.log("Svi podaci su učitani!");

                // Postavite potrebne vrednosti

                naziv.value = izracun.value?.aiz_opis;
                datum.value = new Date(izracun.value?.aiz_datum);
                napomena.value = izracun.value?.aiz_napomena;

                vrstaIzracuna.value = vrsteIzracuna.value.find(
                    (tvz) => tvz.tvz_id === izracun.value?.aiz_tvz_id
                ) || { tvz_naziv: '' };
                console.log("vrvrv: ", vrstaIzracuna.value)
                handleVrstaIzracunaChange(0);

                katastarskaOpcina.value = katastarskeOpcine.value.find(
                    (ko) => ko.kop_id === izracun.value?.aiz_kop_id
                );
                const cestice = await opciStore.fetchParticlesForMunicipalities(katastarskaOpcina.value?.kop_id);
                console.log("Učitane čestice: ", cestice?.particles)

                katastarskaCestica.value = izracun.value?.aiz_kcs_id
                    ? cestice?.particles.find((kc) => kc.kcs_id === izracun.value?.aiz_kcs_id)
                    : null
                vrstaImovine.value = izracun.value?.aiz_tvo_id
                    ? vrsteImovine.value.find(
                        (vi) => vi.tvo_id === izracun.value?.aiz_tvo_id
                    )
                    : null;

                djelatnost.value = izracun.value?.aiz_djl_id
                    ? djelatnosti.value.find(
                        (djl) => djl.djl_id == izracun.value?.aiz_djl_id
                    )
                    : null;
                fetchSkupinuDjelatnosti();

                const trazeniScenarij = scenariji.value.find(
                    (s) => s.tvs_id == izracun.value?.tvs_id
                );
                if (!trazeniScenarij) {
                    console.error("Scenarij nije nađen");
                    return null;
                }
                console.log("Scenarij: ", trazeniScenarij);
                scenarij.value = trazeniScenarij?.tvs_sif;

                console.log("Učitano...", {
                    naziv: naziv.value,
                    datum: datum.value,
                    vrstaIzracuna: vrstaIzracuna.value,
                    katastarskaOpcina: katastarskaOpcina.value,
                    katastarskaCestica: katastarskaCestica.value,
                    vrstaImovine: vrstaImovine.value,
                    djelatnost: djelatnost.value,
                    skupinaDjelatnosti: skupinaDjelatnosti.value,
                    scenarij: scenarij.value,
                    napomena: napomena.value,
                })

                const noviData = {
                    naziv: naziv.value,
                    datum: datum.value,
                    vrstaIzracuna: vrstaIzracuna.value,
                    katastarskaOpcina: katastarskaOpcina.value,
                    katastarskaCestica: katastarskaCestica.value,
                    vrstaImovine: vrstaImovine.value,
                    djelatnost: djelatnost.value,
                    skupinaDjelatnosti: skupinaDjelatnosti.value,
                    scenarij: scenarij.value,
                    ispostava: ispostava.value,
                    podrucniUred: podrucniUred.value,
                    napomena: napomena.value
                }

                Object.assign(initialValues.value, noviData)
                Object.assign(formValues.value, noviData)

                // Prekinite praćenje nakon što su svi podaci učitani
                stopWatcher();
                loading.value = false;
            }
        }, { immediate: true });
    } else {
        loading.value = false;
    }
});

const resolver = ref(zodResolver(
    z.object({
        vrstaIzracuna: z.object({
            tvz_naziv: z.string().min(1, { message: 'Vrsta izračuna je obvezna' }),
        }).refine((obj) => obj && obj.tvz_naziv, { message: 'Vrsta izračuna je obvezna' }),
    })
));

const filteredOpcine = ref([]);
const filteredCestice = ref([]);
const filteredDjelatnost = ref([])

const updateOpcina = (event) => {
    const query = event.query.toLowerCase();
    const _filteredItems = katastarskeOpcine.value.filter((item) => {
        if (query === '-' || query === ' - ') {
            return false;
        }
        const combined = `${item.kop_sif} - ${item.kop_naziv}`.toLowerCase();
        return combined.includes(query.toLowerCase());
    });
    filteredOpcine.value = _filteredItems;
}
const updateDjelatnost = (event) => {
    const query = event.query.toLowerCase();
    const _filteredItems = djelatnosti.value.filter((item) => {
        if (query === '-' || query === ' - ' || query === '.') {
            return false;
        }
        const combined = `${item.djl_sif} - ${item.djl_naziv}`.toLowerCase();
        return combined.includes(query.toLowerCase());
    });
    filteredDjelatnost.value = _filteredItems;
}

function fetchSkupinuDjelatnosti() {
    console.log("Djelatnost: ", djelatnost.value);
    if (djelatnost.value?.djl_id) {
        skupinaDjelatnosti.value.djl_skp = djelatnost.value?.djl_skp
        skupinaDjelatnosti.value.djl_skp_naziv = djelatnost.value?.djl_skp_naziv;
    }
}

const updateCestica = (event) => {
    if (!event.query.trim().length) {
        filteredCestice.value = [...katastarskeCestice.value];
    } else {
        filteredCestice.value = katastarskeCestice.value.filter((kcs) => {
            return kcs.kcs_sif.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
}

const onInputChange = (event) => {
    // Pretvori unos u velika slova
    katastarskaOpcina.value = event.target.value.toUpperCase();
};

const schemaImovina = z.object({
    vrstaIzracuna: z.object({
        tvz_naziv: z.string().min(1, { message: 'Vrsta izračuna je obvezna' }),
    }).refine((obj) => obj && obj.tvz_naziv, { message: 'Vrsta izračuna je obvezna' }),
    katastarskaOpcina: z.object({
        kop_naziv: z.string().min(1, { message: 'Katastarska općina je obvezna' })
    }).refine((obj) => obj && obj.kop_naziv, { message: 'Katastarska općina je obvezna' }),
    katastarskaCestica: z.union([
        z.object({
            kcs_sif: z.string().min(1, { message: 'Katastarska cesta je obvezna' }),
        }).refine(obj => obj && obj.kcs_sif, { message: 'Katastarska cesta je obvezna' }),
        z.null(), // Dozvoljava null vrednost
        z.literal(''), // Dozvoljava praznu vrednost
    ]),
    vrstaImovine: z.object({
        tvo_naziv: z.string().min(1, { message: 'Vrsta imovine je obvezna' }),
    }).refine((obj) => obj && obj.tvo_naziv, { message: 'Vrsta imovine je obvezna' }),
    scenarij: z
        .string({ required_error: "Scenarij je obvezan" })
        .min(1, "Scenarij mora biti odabran")
});

const schemaDefault = z.object({
    vrstaIzracuna: z.object({
        tvz_naziv: z.string().min(1, { message: 'Vrsta izračuna je obvezna' }),
    }).refine((obj) => obj && obj.tvz_naziv, { message: 'Vrsta izračuna je obvezna' }),
    katastarskaOpcina: z.object({
        kop_naziv: z.string().min(1, { message: 'Katastarska općina je obvezna' })
    }).refine((obj) => obj && obj.kop_naziv, { message: 'Katastarska općina je obvezna' }),
    katastarskaCestica: z.union([
        z.object({
            kcs_sif: z.string().min(1, { message: 'Katastarska cesta je obvezna' }),
        }).refine(obj => obj && obj.kcs_sif, { message: 'Katastarska cesta je obvezna' }),
        z.null(), // Dozvoljava null vrednost
        z.literal(''), // Dozvoljava praznu vrednost
    ]),
    djelatnost: z.object({
        djl_naziv: z.string().min(1, { message: 'Djelatnost je obvezna' }),
    }).refine((obj) => obj && obj.djl_naziv, { message: 'Djelatnost je obvezna' }),
    scenarij: z
        .string({ required_error: "Scenarij je obvezan" })
        .min(1, "Scenarij mora biti odabran")
});

function resetdivs(fields) {
    fields.forEach(field => field.value = null);
}
function handleVrstaIzracunaChange(isForm) {
    if (isForm) {
        console.log("Sa forme promjena")
        resetdivs([vrstaImovine, djelatnost, skupinaDjelatnosti]);
        skupinaDjelatnosti.value = { djl_skp: '', djl_skp_naziv: '' };
    }

    resolver.value = zodResolver(vrstaIzracuna.value?.tvz_naziv === "Imovina" ? schemaImovina : schemaDefault, { mode: 'lazy' });
}

watch(katastarskaOpcina, async (newValue) => {
    console.log('Odabrana katastarska općina:', newValue);
    if (newValue === (null, undefined, '') || newValue.length == 0) { katastarskaCestica.value = null; }
    if (newValue?.kop_id) {
        ispostava.value.isp_sif = katastarskaOpcina.value?.isp_sif;
        ispostava.value.isp_naziv = katastarskaOpcina.value?.isp_naziv;
        podrucniUred.value.puk_sif = katastarskaOpcina.value?.isp_sif;
        podrucniUred.value.puk_naziv = katastarskaOpcina.value?.isp_naziv;
        await opciStore.fetchParticlesForMunicipalities(katastarskaOpcina.value?.kop_id);
    }
})

const onFormSubmit = async ({ valid }) => {
    if (valid) {
        console.log("Forma je validna i podaci su spremljeni.");
        isLoadingPopupVisible.value = true;

        const trazeniScenarij = scenariji.value.find(s => s.tvs_sif == scenarij.value);
        if (!trazeniScenarij) {
            console.error("Scenarij nije nađen")
            return null;
        }
        console.log("Scenarij: ", trazeniScenarij)

        const formData = {
            calculationId: idIzracuna.value || null,
            date: formatDateToDMY(datum.value, '-'),
            calculationTypeId: vrstaIzracuna.value?.tvz_id,
            cadastreMunicipalityId: katastarskaOpcina.value?.kop_id,
            cadastreParticleId: katastarskaCestica.value?.kcs_id || null,
            objectTypeId: vrstaImovine.value?.tvo_id || null,
            activityId: djelatnost.value?.djl_id || null,
            scenarioTypeId: trazeniScenarij?.tvs_id,
            description: naziv.value || null,
            remark: napomena.value || null,
        }
        console.log("spremanje data: ", formData)
        let mainMessage;
        try {
            const { data, status } = await saveForm(formData);
            const resId = data.calculationId;
            console.log("resID: ", resId)
            if (status === 200) {
                cardStore.setVrstaIzracuna(vrstaIzracuna.value?.tvz_naziv)
                cardStore.setScenarij(scenarij.value);
                showSuccess();

                Object.assign(initialValues.value, {
                    naziv: naziv.value,
                    datum: datum.value,
                    vrstaIzracuna: vrstaIzracuna.value,
                    katastarskaOpcina: katastarskaOpcina.value,
                    katastarskaCestica: katastarskaCestica.value,
                    vrstaImovine: vrstaImovine.value,
                    djelatnost: djelatnost.value,
                    skupinaDjelatnosti: skupinaDjelatnosti.value,
                    scenarij: scenarij.value,
                    ispostava: ispostava.value,
                    podrucniUred: podrucniUred.value,
                    napomena: napomena.value,
                })
                Object.assign(formValues.value, initialValues.value)

            } else {
                mainMessage = data.message;
                showErrorSave(mainMessage.value);
            }

            if (!idIzracuna.value) {
                console.log("Ušlo")
                idIzracuna.value = resId;
                console.log("novi id: ", idIzracuna.value)

                const url = `/kpkr/predlozak?id=${idIzracuna.value.toString()}`;
                console.log("url: " + url);
                console.log('id: ', idIzracuna.value.toString());

                cardStore.setCardId(idIzracuna.value);

                const queryParams = { ...router.currentRoute.value.query };
                queryParams.id = idIzracuna.value !== 'null' ? idIzracuna.value : undefined;

                console.log("path: ", router.currentRoute.value.path, "queryParams: ", queryParams.id);
                // Ažuriraj URL
                router.replace({
                    path: router.currentRoute.value.path,
                    query: queryParams,
                });

                if (resId) {
                    try {
                        const izracunRes = await getCalculations(resId)
                        const broj = izracunRes.data[0]?.aiz_broj
                        cardStore.setBroj(broj)
                        cardStore.setVrstaIzracuna(izracunRes.data[0]?.tvz_naziv)
                        cardStore.setScenarij(izracunRes.data[0]?.tvs_id == 1 ? 'RCP' : 'SSP');
                    } catch (error) {
                        console.error('Greška prilikom dohvaćanja izračuna: ', error);
                        return null;
                    }
                }

            }

        } catch (error) {
            showError();
            console.error('Greška prilikom spremanja podataka: ', error);
            return null;
        } finally {
            isLoadingPopupVisible.value = false;
        }
    } else {
        console.error('Validacija nije prošla.');
    }
};

const showSuccess = () => {
    toast.add({ severity: 'success', summary: 'Uspješno spremljeno', detail: 'Promjene na formi su spremljene', group: 'tc', life: 5000 });
};

const showError = () => {
    toast.add({ severity: 'error', summary: 'Došlo je do greške', detail: 'Nije uspješno spremljeno', life: 5000 });
};
const showErrorSave = (message) => {
    toast.add({ severity: 'error', summary: 'Došlo je do greške', detail: `${message}`, group: 'tc', life: 8000 });
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
    max-width: 800px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(11, 38px) auto;
    gap: 5px;
}

.grid-item {
    height: 100%;
    width: 100%;
    /* grid-column: 1 / 4; */

    display: grid;
    grid-template-columns: 200px 1fr auto;
}

.grid-item>*,
.radio-button-container {
    width: 100%;
}

.header {
    max-width: 200px;
    min-width: 120px;
}

.header-grid {
    width: 50%;
    display: grid;
    grid-template-columns: 150px 1fr;
    grid-template-rows: 38px auto;
    gap: 5px;
}

.radio-button-container,
.radio-button {
    display: flex;
    align-items: center;
    gap: 20px;
}

.radio-button {
    gap: 10px;
}

.action-div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

:deep(.p-autocomplete-dropdown) {
    width: auto !important;
}

.info-div {
    width: auto;
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

.spremiBtn-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.spremiBtn-container span {
    font-style: italic;
}

#saveBtn {
    width: 150px;
    background: none;
    border: var(--border);
    font-weight: 500;

    background-color: var(--primary-color);
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

#saveBtn * {
    color: white;
}


#saveBtn:hover {
    background-color: var(--primary-color-hover);
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
    color: var(--text-color);
    /* border: none; */
    /* Boja teksta */
    cursor: not-allowed;
    /* Pokazivač miša pokazuje da nije moguće kliknuti */
    pointer-events: none;
    /* Onemogućava sve interakcije miša */
    opacity: 0.6;
    /* Smanjena vidljivost */
}

#saveBtn:disabled * {
    color: var(--text-color);
}

#saveBtn:disabled:hover,
#saveBtn:disabled:active,
#saveBtn:disabled>.save-icon {
    background-color: rgb(232, 232, 232);
    /* Uklanja hover i active efekte */
    color: var(--text-color);
    /* Zadržava boju teksta */
}

.form-input-div {
    width: 100%;
}

.grid-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.autocomplete {
    text-transform: uppercase;
}

.form-input,
.p-inputtext {
    width: 100% !important;
    height: 100% !important;
}

input[readonly] {
    background-color: rgb(247, 247, 247);
    /* background-color: #eef1f6;
    border: 1px solid #e0e6ed; */
}

.dataInput {
    cursor: default;
    background-color: rgba(20, 82, 28, 0.03);
}

.dataInput:disabled,
.form-input:disabled {
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

.alert-popup,
.loading-popup {
    z-index: 99;
    position: fixed;
    width: 100%;
    height: 100dvh;
    top: 0;
    left: 0;
    overflow: hidden;
}

footer {
    justify-content: flex-end;
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

.footer-button:disabled {
    cursor: default;
}

.footer-button:disabled:hover,
.footer-button:disabled:active {
    background-color: var(--primary-color);
    cursor: not-allowed;
    pointer-events: none;
}

.prethodni {
    color: var(--primary-color);
    font-weight: bold;
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