<template>
    <div class="body">
        <main>
            <h1>
                Rizik
                <span class="h1-container">
                    <span v-for="(item, index) in filteredItems" :key="index" class="h1-item">
                        <div v-if="item.value">
                            {{ item.value }}
                            <span v-if="item.suffix">{{ item.suffix }}</span>
                        </div>
                    </span>
                </span>
            </h1>
            <!-- <div class="opci-podaci">
                <div class="opci-podaci-item item-header">
                    Katastarska općina:
                </div>
                <div class="opci-podaci-item">
                    {{ katOpcina }}
                </div>

                <div class="opci-podaci-item item-header">
                    Vrsta imovine:
                </div>
                <div v-if="vrstaImovine" class="opci-podaci-item">
                    {{ vrstaImovine }}
                </div>
                <div v-else class="opci-podaci-item empty">
                    (Nije odabrano)
                </div>

                <div class="opci-podaci-item item-header">
                    Katastarska čestica:
                </div>
                <div v-if="katCestica" class="opci-podaci-item">
                    {{ katCestica }}
                </div>
                <div v-else class="opci-podaci-item empty">
                    (Nije odabrano)
                </div>

                <div class="opci-podaci-item item-header">
                    Djelatnost:
                </div>
                <div v-if="djelatnost" class="opci-podaci-item">
                    {{ djelatnost }}
                </div>
                <div v-else class="opci-podaci-item empty">
                    (Nije odabrano)
                </div>

            </div> -->
            <Tabs value="0">
                <TabList>
                    <Tab class="reset-style" value="0">
                        <font-awesome-icon icon="border-all" class="tab-icon" />
                        Bez mjera prilagodbe
                    </Tab>
                    <Tab class="reset-style" value="1">
                        <font-awesome-icon icon="table-cells" class="tab-icon" />
                        S mjerama prilagodbe
                    </Tab>
                </TabList>
                <TabPanels class="tab-panel">
                    <TabPanel value="0" class="tab-panel">
                        <RizikSazetak v-if="vrstaIzracuna == 'Djelatnost'" ref="rizikSazetakRef" :tip="'RZ'"
                            class="rizik-sazetak" />
                        <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :tip="'RZ'" />
                        <span v-else>
                            <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                            Nije odabrana vrsta izračuna
                        </span>
                    </TabPanel>
                    <TabPanel value="1" class="tab-panel">
                        <RizikSazetak v-if="vrstaIzracuna == 'Djelatnost'" ref="rizikSazetakRef" :tip="'KR'"
                            class="rizik-sazetak" />
                        <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :tip="'KR'" />
                        <span v-else>
                            <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                            Nije odabrana vrsta izračuna
                        </span>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <!-- <LegendaBoja class="legenda" /> -->
        </main>
        <footer>
            <button @click="navigateTo('/predlozak/mjere-prilagodbe')" class="footer-button">
                <font-awesome-icon icon="arrow-left-long" style="margin-right: 5px;" />
                <span>Mjere prilagodbe</span>
            </button>
            <div class="actionButtons">
                <span class="action-icon">
                    <font-awesome-icon icon="expand" size="lg" />
                </span>
                <span class="action-icon" @click="downloadRizikSazetak">
                    <font-awesome-icon icon="download" size="lg" />
                </span>
            </div>
            <button @click="noviIzracun" class="footer-button">
                <span>Novi predložak izračuna</span>
                <font-awesome-icon icon="arrow-right-long" style="margin-left: 5px;" />
            </button>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TablicaRizika from '~/components/TablicaRizika.vue';
import { useOpciStore } from '#imports';

definePageMeta({
    middleware: [
        'auth',
        'id-izracuna'
    ],
});

const rizikSazetakRef = ref(null);

const opciStore = useOpciStore();

const idIzracuna = ref(
    useCookie('id_izracuna').value == '/' ||
        useCookie('id_izracuna') == undefined
        ? '/'
        : parseInt(useCookie('id_izracuna').value)
);

// Kreiramo referencu za pristup komponenti
const vrstaIzracuna = ref(useCookie('vrsta_izracuna').value);

onMounted(async () => {
    await opciStore.fetchCalculation(idIzracuna.value);
})

const katOpcinaSifra = computed(() => opciStore.opci_podaci.kop_sif);
const katOpcina = computed(() => opciStore.opci_podaci.kop_naziv);
const katCestica = computed(() =>
    opciStore.opci_podaci.kcs_sif === ''
        ? null
        : opciStore.opci_podaci.kcs_sif
);
const vrstaImovine = computed(() => opciStore.opci_podaci.tvo_naziv);
const djelatnost = computed(() =>
    opciStore.opci_podaci.djl_naziv === ''
        ? null
        : opciStore.opci_podaci.djl_naziv
);

const displayItems = computed(() => [
    { value: katOpcinaSifra.value && katOpcina.value ? `${katOpcinaSifra.value} - ${katOpcina.value}` : '', suffix: ',' },
    { value: katCestica.value, suffix: ',' },
    { value: vrstaImovine.value, suffix: ',' },
    { value: djelatnost.value, suffix: '' }
]);
const filteredItems = computed(() => displayItems.value.filter(item => item.value));

const noviIzracun = () => {
    opciStore.clearOpciPodaci();
    useCookie('id_izracuna').value = '/';
    useCookie('vrsta_izracuna').value = null;
    navigateTo('/predlozak');
}

</script>

<style scoped>
.body {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
}

.opci-podaci {
    display: grid;
    grid-template-columns: 200px 0.5fr 200px 1fr;
    grid-template-rows: repeat(36px);
    gap: 5px;
}

.opci-podaci-item {
    font-size: 16px;
    display: flex;
    align-items: center;
}

.empty {
    font-style: italic;
    color: gray;
}

.item-header {
    font-size: 16px;
    font-weight: 600;
}

main,
footer {
    width: 100%;
}

footer {
    margin-top: 26px;
}

.actionButtons {
    display: flex;
    align-items: center;
    gap: 16px;
}

.action-icon {
    color: gray;
}

.action-icon:hover {
    /* color: var(--primary-color); 
    cursor: pointer;*/
    color: gray;
}

.reset-style {
    all: revert;
}

.p-tablist-tab-list button {
    font-family: "DM Sans", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;

    width: auto !important;
    color: var(--text-color);
    padding: 10px 20px;

    outline: none;
    border: none;
    border-radius: 0px;

    background-color: var(--white);
    font-size: 16px;
    font-weight: normal;
    cursor: pointer;
}

.tab-panel {
    height: 100% !important;
}

.p-tab {
    opacity: 0.7;
    border: none;
}

.p-tab.p-tab-active {
    color: white;
    background-color: var(--primary-color);
    /* border-bottom: 3px solid var(--primary-color); */
    border-radius: 5px 5px 0px 0px;
    opacity: 1;
}

.tab-icon {
    margin-right: 5px;
}

h1 {
    width: 100%;
    text-align: left;
    padding-bottom: 7px;
    border-bottom: 2px solid var(--text-color);

    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.h1-container {
    font-size: 16px;
    font-weight: 400;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
}

.h1-container * {
    font-size: 16px;
}

.h1-opcina {
    text-transform: capitalize;
}

.h1-container>span {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* gap: 10px; */
}

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
}

.rizik-sazetak {
    width: 100%;
    height: 100%;
}

.legenda {
    padding: 0px 15px;
}
</style>