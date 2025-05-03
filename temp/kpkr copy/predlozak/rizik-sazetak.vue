<template>
    <div class="body">
        <main>
            <h1>
                Rizik
                <span class="h1-container">
                    <span v-for="(item, index) in filteredItems" :key="index" class="h1-item">
                        <div v-if="item.value">
                            {{ item.value }}
                            <span v-if="index !== filteredItems.length - 1">{{ item.suffix }}</span>
                        </div>
                    </span>
                </span>
            </h1>
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
                    <TabPanel value="0" class="tab-panel" ref="tabPanelRef">
                        <div ref="rizikSazetakRef" class="sazetak-container">
                            <Djelatnost v-if="vrstaIzracuna == 'Djelatnost'" :aiz_id="idIzracuna" :tip="'RZ'"
                                class="rizik-sazetak" />
                            <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :aiz_id="idIzracuna" :tip="'RZ'" />
                            <LegendaBoja v-if="vrstaIzracuna" class="legenda" />
                            <span v-else style="font-style: italic;">
                                Učitavanje podataka
                                <font-awesome-icon icon="spinner" spin />
                            </span>
                        </div>
                    </TabPanel>
                    <TabPanel value="1" class="tab-panel">
                        <div ref="rizikSazetakMjereRef">
                            <Djelatnost v-if="vrstaIzracuna == 'Djelatnost'" :aiz_id="idIzracuna" :tip="'KR'"
                                class="rizik-sazetak" />
                            <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :aiz_id="idIzracuna" :tip="'KR'" />
                            <LegendaBoja v-if="vrstaIzracuna" class="legenda" />
                            <span v-else style="font-style: italic;">
                                Učitavanje podataka
                                <font-awesome-icon icon="spinner" spin />
                            </span>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </main>
        <footer>
            <button @click="navigateWithParameter('/kpkr/predlozak/mjere-prilagodbe', 'id', idIzracuna)"
                class="footer-button">
                <font-awesome-icon icon="arrow-left-long" style="margin-right: 5px;" />
                <span>Mjere prilagodbe</span>
            </button>
            <div class="actionButtons">
                <button class="action-icon expand" @click="openPopup">
                    <font-awesome-icon icon="expand" size="lg" />
                    <span class="tooltip">Proširi prozor</span>
                </button>
                <button class="action-icon download" :disabled="!structuredDataBezMjera || !structuredDataSaMjerama"
                    @click="downloadRizikSazetak($event)">
                    <font-awesome-icon icon="download" size="lg" />
                    <span class="tooltip">Preuzmi izvještaj</span>
                </button>

            </div>
            <button @click="noviIzracun" class="footer-button">
                <span>Novi predložak izračuna</span>
                <font-awesome-icon icon="arrow-right-long" style="margin-left: 5px;" />
            </button>
        </footer>

        <div class="popup-expand" v-if="isPopupOpen">
            <div class="expand-content">
                <div class="icon close" @click="closePopup">
                    <font-awesome-icon icon="xmark" />
                </div>
                <div class="icon left" @click="switchTab(-1)">
                    <font-awesome-icon icon="chevron-left" />
                </div>
                <div class="icon right" @click="switchTab(1)">
                    <font-awesome-icon icon="chevron-right" />
                </div>

                <!-- Dinamički H1 ovisno o tipu izračuna -->
                <h1>
                    {{ currentTabData.tip === 'RZ'
                        ? 'Rezultat izračuna bez mjera prilagodbe'
                        : 'Rezultat izračuna sa mjerama prilagodbe'
                    }}
                    <span class="h1-container">
                        <span v-for="(item, index) in filteredItems" :key="index" class="h1-item">
                            <div v-if="item.value">
                                {{ item.value }}
                                <span v-if="index !== filteredItems.length - 1">{{ item.suffix }}</span>
                            </div>
                        </span>
                    </span>
                </h1>
                <transition :name="slideDirection">
                    <div v-show="tabs.length > 0" class="content-tabs"> <!-- Dodano v-show ovdje -->
                        <div v-for="(tab, index) in tabs" v-show="index === currentTab" :key="index" class="tab">
                            <Djelatnost v-show="vrstaIzracuna == 'Djelatnost' && tab.tip === 'RZ'" :aiz_id="idIzracuna"
                                :tip="tab.tip" class="rizik-sazetak" />
                            <TablicaRizika v-show="vrstaIzracuna == 'Imovina' && tab.tip === 'RZ'" :aiz_id="idIzracuna"
                                :tip="tab.tip" />
                            <Djelatnost v-show="vrstaIzracuna == 'Djelatnost' && tab.tip === 'KR'" :aiz_id="idIzracuna"
                                :tip="tab.tip" class="rizik-sazetak" />
                            <TablicaRizika v-show="vrstaIzracuna == 'Imovina' && tab.tip === 'KR'" :aiz_id="idIzracuna"
                                :tip="tab.tip" />
                        </div>
                    </div>
                </transition>

            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import TablicaRizika from '~/components/kpkr/tables/TablicaRizika.vue';
import Djelatnost from '~/components/kpkr/tables/Djelatnost.vue';
import LegendaBoja from '~/components/kpkr/tables/LegendaBoja.vue';
import { useOpciStore, useStructuredGridDataStore, useAdaptStore, formatDateToDMY } from '#imports';
import { djelatnostCellRanges, imovinaCellRanges } from '~/composables/arrays';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

definePageMeta({
    middleware: [
        
    ],
});

const props = defineProps({
    aiz_id: String
})

const opciStore = useOpciStore();
const adaptStore = useAdaptStore();
const cardStore = useCardStore();
const structuredDataStore = useStructuredGridDataStore();

const idIzracuna = computed(() => props.aiz_id || cardStore.cardId)
const brojIzracuna = computed(() => cardStore.broj);

const tabPanelRef = ref(null);
const maxSazetakWidth = ref('100%'); // Inicijalna vrijednost

const rizikSazetakRef = ref(null);
const rizikSazetakMjereRef = ref(null);

const isScenarijLoaded = ref(false); // Praćenje statusa inicijalizacije

const structuredDataBezMjera = ref(computed(() => structuredDataStore.structuredDataBezMjera))
const structuredDataSaMjerama = ref(computed(() => structuredDataStore.structuredDataSaMjerama))

// Kreiramo referencu za pristup komponenti
const vrstaIzracuna = computed(() => cardStore.vrstaIzracuna); // Inicijalno je null
const scenarij = computed(() => cardStore.scenarij)

const adaptMjere = computed(() => adaptStore.odabrane_mjere)

// Ref varijable za kontrolu popupa i tabova
const isPopupOpen = ref(false);
const previousTab = ref(0);
const currentTab = ref(0);
const tabs = ref([
    { tip: 'RZ' },
    { tip: 'KR' }
]);
const slideDirection = ref('slide-right');

const currentTabData = computed(() => tabs.value[currentTab.value]);

// Funkcija za prebacivanje tabova
function switchTab(direction) {
    previousTab.value = currentTab.value;
    currentTab.value = (currentTab.value + direction + tabs.value.length) % tabs.value.length;

    // Postavi smjer tranzicije
    slideDirection.value = direction === 1 ? 'slide-right' : 'slide-left';
}

// Funkcija za otvaranje popupa
function openPopup() {
    isPopupOpen.value = true;
    document.body.style.overflow = 'hidden'; // Spriječi scrollanje body-ja
}

// Funkcija za zatvaranje popupa
function closePopup() {
    isPopupOpen.value = false;
    document.body.style.overflow = 'auto'; // Vrati scrollanje body-ja
}

// const cookiesToGet = ['vrsta-izracuna', 'scenarij'];

onMounted(async () => {
    if (!idIzracuna.value) {
        idIzracuna.value = getIdFromUrl()
    }
    // console.log("id rizik-sazetak: ", idIzracuna.value)
    try {
        // const cookieData = await initializeCookie(cookiesToGet);

        // vrstaIzracuna.value = cookieData['vrsta-izracuna'] || '';
        // scenarij.value = cookieData['scenarij'] || 'RCP';
        // vrstaIzracuna.value = cardStore.vrstaIzracuna;
        // scenarij.value = cardStore.scenarij;
        isScenarijLoaded.value = true;

        // console.log("cookieData: ", vrstaIzracuna.value, scenarij.value);

    } catch (error) {
        // console.error("Error loading cookies: ", error);
    }

    await opciStore.fetchCalculation(idIzracuna.value);
    adaptStore.odabrane_mjere = [];
    await adaptStore.fetchMetrictypes(idIzracuna.value);
    const tabPanelWidth = tabPanelRef.value.clientWidth; // Dobij širinu tab panela
    if (tabPanelWidth < 1100) {
        maxSazetakWidth.value = '1400px'; // Postavi maksimalnu širinu
    }
})

const datum = computed(() => opciStore.izracun.aiz_datum);
const katOpcinaSifra = computed(() => opciStore.izracun.kop_sif);
const katOpcina = computed(() => opciStore.izracun.kop_naziv);
const katCestica = computed(() =>
    opciStore.izracun.kcs_sif === ''
        ? null
        : opciStore.izracun.kcs_sif
);
const vrstaObjektaId = computed(() => opciStore.izracun.aiz_tvo_id);
const vrstaImovine = computed(() => opciStore.izracun.tvo_naziv);
const djelatnostSifra = computed(() => opciStore.izracun.djl_sif)
const djelatnost = computed(() =>
    opciStore.izracun.djl_naziv === ''
        ? null
        : opciStore.izracun.djl_naziv
);
const skupinaDjelatnosti = computed(() => opciStore.izracun.djl_naziv_sk);
const ispostava = computed(() => opciStore.izracun.isp_naziv);
const podrucniUred = computed(() => opciStore.izracun.puk_naziv);

const displayItems = computed(() => [
    { value: katOpcinaSifra.value && katOpcina.value ? `${katOpcinaSifra.value} - ${katOpcina.value}` : '', suffix: ',' },
    { value: katCestica.value, suffix: ',' },
    { value: vrstaImovine.value, suffix: ',' },
    { value: djelatnost.value, suffix: '' }
]);
const filteredItems = computed(() => displayItems.value.filter(item => item.value));

const noviIzracun = () => {
    cardStore.cardId = null;
    navigateTo('/kpkr');
    // navigateWithParameter('/kpkr/predlozak', 'id', 'null')
    // nextTick();
}

const columns = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const doubleColumns = columns.map(col => columns.map(subCol => col + subCol)).flat(); // Generiraj dvo-slovne stupce
const allColumns = [...columns, ...doubleColumns]; // Kombiniraj jednoslovne i dvo-slovne stupce

function mapDataToCellRanges(structuredData, djelatnostCellRanges) {
    const cellData = [];

    Object.keys(djelatnostCellRanges).forEach(position => {
        const { range } = djelatnostCellRanges[position];
        const [startCell, endCell] = range.split(':');
        const startRow = parseInt(startCell.replace(/[^\d]/g, ''));
        const endRow = parseInt(endCell.replace(/[^\d]/g, ''));
        const columnIndex = allColumns.indexOf(startCell.replace(/[0-9]/g, '')); // Pronađi indeks stupca

        const rows = structuredData[position];

        for (let row = startRow; row <= endRow; row++) {
            const rowIndex = row - startRow; // Izračunaj indeks
            if (rows && rows[rowIndex]) {
                const rowData = rows[rowIndex];

                // Mapa svakog atributa na odgovarajuću ćeliju
                const cellMappings = [
                    { cell: `${allColumns[columnIndex]}${row}`, value: rowData.history },
                    { cell: `${allColumns[columnIndex + 1]}${row}`, value: rowData.p0_4_5 },
                    { cell: `${allColumns[columnIndex + 2]}${row}`, value: rowData.p1_4_5 },
                    { cell: `${allColumns[columnIndex + 3]}${row}`, value: rowData.p2_4_5 },
                    { cell: `${allColumns[columnIndex + 4]}${row}`, value: rowData.p0_8_5 },
                    { cell: `${allColumns[columnIndex + 5]}${row}`, value: rowData.p1_8_5 },
                    { cell: `${allColumns[columnIndex + 6]}${row}`, value: rowData.p2_8_5 },
                ];

                cellMappings.forEach(mapping => {
                    if (mapping.value !== undefined) {
                        cellData.push({ cell: mapping.cell, value: mapping.value });
                    }
                });
            } else {
                console.warn(`No data for position ${position} at row index: ${rowIndex}`);
            }
        }
    });

    return cellData;
}

const test = () => {
    const bezMjeraPopis = mapDataToCellRanges(structuredDataBezMjera.value, imovinaCellRanges);
    const saMjeramaPopis = mapDataToCellRanges(structuredDataSaMjerama.value, imovinaCellRanges);
    // console.log("rezultat mapiranja (bez mjera): ", bezMjeraPopis);
    // console.log("rezultat mapiranja (sa mjerama): ", saMjeramaPopis);
    // console.log("adapt mjere: ", adaptMjere.value);
}

const downloadRizikSazetak = async () => {
    try {

        // Generiranje stringa iz filteredItems bez zareza na zadnjem elementu
        const formattedString = filteredItems.value.map((item, index) => {
            return `${item.value}${index !== filteredItems.value.length - 1 ? item.suffix + ' ' : ''}`;
        }).join('');

        // console.log("formattedString: ", formattedString);

        let bezMjeraPopis = []
        let saMjeramaPopis = []

        // Fetch the Excel file from the server
        const djelatnostBlob = await axios.get('/blobs/DjelatnostTemplate.xlsx', {
            responseType: 'blob',
            headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        });
        const imovinaBlob = await axios.get('/blobs/ImovinaTemplate.xlsx', {
            responseType: 'blob',
            headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        });

        // Convert the response to an ArrayBuffer
        const DjelatnostArrayBuffer = await djelatnostBlob.data.arrayBuffer();
        const ImovinaArrayBuffer = await imovinaBlob.data.arrayBuffer();

        // Use JSZip to handle the Excel file format (ZIP)
        const DjelatnostTypedArray = new Uint8Array(DjelatnostArrayBuffer);
        const zipDjelatnost = await JSZip.loadAsync(DjelatnostTypedArray);

        const ImovinaTypedArray = new Uint8Array(ImovinaArrayBuffer);
        const zipImovina = await JSZip.loadAsync(ImovinaTypedArray);

        // Load the Excel workbook using ExcelJS
        const workbook = new ExcelJS.Workbook();
        if (vrstaIzracuna.value == 'Djelatnost') {
            await workbook.xlsx.load(DjelatnostArrayBuffer);
        } else {
            await workbook.xlsx.load(ImovinaArrayBuffer);
        }

        // Access the first worksheet (or by name if necessary)
        const opciWorksheet = workbook.getWorksheet('Opći podaci');
        const bezMjeraWorksheet = workbook.getWorksheet('Izračun bez mjera prilagodbe');
        const saMjeramaWorksheet = workbook.getWorksheet('Izračun s mjerama prilagodbe');

        // // console.log("rezultat mapiranja (bez mjera): ", bezMjeraPopis);
        // // console.log("rezultat mapiranja (sa mjerama): ", saMjeramaPopis);

        opciWorksheet.getCell('T11').value = brojIzracuna.value;
        // console.log("broj izracuna funkcija: ", brojIzracuna.value)

        const logoBuffer = await axios.get('/static/images/KPKR_logo.svg', {
            responseType: 'arraybuffer'
        });
        const matricaBuffer = await axios.get('/static/images/matrica_rizika.png', {
            responseType: 'arraybuffer'
        });

        const logoId = workbook.addImage({
            buffer: logoBuffer.data,  // Use the buffer from the response
            extension: 'svg'  // Ensure the extension matches your image format
        });
        const matricaId = workbook.addImage({
            buffer: matricaBuffer.data,  // Use the buffer from the response
            extension: 'png'  // Ensure the extension matches your image format
        });

        const opciPodaci = [
            { value: formatDateToDMY(datum.value, '.') || '/', row: 14 },
            { value: vrstaIzracuna.value || '/', row: 16 },
            { value: katOpcinaSifra.value && katOpcina.value ? `${katOpcinaSifra.value} - ${katOpcina.value}` : '/', row: 18 },
            { value: katCestica.value || '/', row: 20 },
            { value: vrstaImovine.value || '/', row: 22 },
            { value: djelatnostSifra.value && djelatnost.value ? `${djelatnostSifra.value} - ${djelatnost.value}` : '/', row: 24 },
            { value: skupinaDjelatnosti.value || '/', row: 26 },
            { value: ispostava.value || '/', row: 28 },
            { value: podrucniUred.value || '/', row: 30 }
        ];

        opciPodaci.forEach(({ value, row }) => {
            const cell = opciWorksheet.getCell(`H${row}`);
            cell.value = value || '/';

            if (cell.value == '/') {
                // Ako je vrijednost '/', postavi italic i ukloni bold
                cell.font = { italic: true, bold: false };
            } else {
                // Ako je vrijednost neki drugi string, postavi font size 18, bold i ne italic
                cell.font = { size: 18, bold: true, italic: false };
            }
        });

        const adaptMjereData = adaptMjere.value; // Uzimanje podataka iz computed property
        // console.log(" adaptMjereData: ", adaptMjereData);
        // Definiraj početni red
        const startingRow = 39;

        if (adaptMjereData.length === 0) {
            // Ako nema mjera, ispiši poruku u C39 ćeliju
            const noMeasuresCell = opciWorksheet.getCell(`C${startingRow}`);
            noMeasuresCell.value = 'Nema odabranih mjera prilagodbe';
            noMeasuresCell.alignment = {
                vertical: 'bottom',
                horizontal: 'left'
            }; // Poravnanje
            noMeasuresCell.font = {
                italic: true,
                size: 20
            }; // Italic font
        }

        // Prolazak kroz adaptMjereData i dodavanje podataka u worksheet
        adaptMjereData.forEach((mjera, index) => {
            const row = startingRow + index;

            // Stupac C (tva_sif)
            const tvaSifCell = opciWorksheet.getCell(`C${row}`);
            tvaSifCell.value = mjera.tva_sif;
            tvaSifCell.alignment = {
                vertical: 'bottom',
                horizontal: 'left'
            }; // Poravnanje
            tvaSifCell.font = {
                size: 20,
                italic: true
            }; // Italic font

            // Stupci H:AF (tva_naziv) - Spoji stupce
            opciWorksheet.mergeCells(`H${row}:T${row}`); // AF
            const tvaNazivCell = opciWorksheet.getCell(`H${row}`);
            tvaNazivCell.value = mjera.tva_naziv;
            tvaNazivCell.alignment = {
                wrapText: true,
                vertical: 'bottom',
                horizontal: 'left'
            }; // Prelamanje teksta i poravnanje
            tvaNazivCell.font = {
                size: 20,
                bold: true,
                italic: true
            }; // Bold i italic font

            // // Stupac AH (tgr_naziv)
            // const tgrNazivCell = opciWorksheet.getCell(`AH${row}`);
            // tgrNazivCell.value = mjera.tgr_naziv;
            // tgrNazivCell.alignment = {
            //     vertical: 'bottom',
            //     horizontal: 'left'
            // }; // Poravnanje
            // tgrNazivCell.font = {
            //     size: 20,
            //     italic: true
            // }; // Italic font

            // Postavi visinu retka na 60px
            opciWorksheet.getRow(row).height = 60;
        });

        if (vrstaIzracuna.value == 'Djelatnost') {

            bezMjeraPopis = mapDataToCellRanges(structuredDataBezMjera.value, djelatnostCellRanges);
            saMjeramaPopis = mapDataToCellRanges(structuredDataSaMjerama.value, djelatnostCellRanges);

            // LOGOTIP
            opciWorksheet.addImage(logoId, {
                tl: { col: 2, row: 2 },  // Top-left corner (C3)
                br: { col: 8, row: 6 }  // Bottom-right corner (I6)
            })
            bezMjeraWorksheet.addImage(logoId, {
                tl: { col: 2, row: 2 },  // Top-left corner (C3)
                br: { col: 9, row: 6 }  // Bottom-right corner (I6)
            });
            saMjeramaWorksheet.addImage(logoId, {
                tl: { col: 2, row: 2 },  // Top-left corner (C3)
                br: { col: 9, row: 6 }  // Bottom-right corner (I6)
            });

            // MATRICA RIZIKA
            bezMjeraWorksheet.addImage(matricaId, {
                tl: { col: 2, row: 60 },  // Top-left corner (C61)
                br: { col: 15, row: 76 }  // Bottom-right corner (M7)
            });
            saMjeramaWorksheet.addImage(matricaId, {
                tl: { col: 2, row: 60 },  // Top-left corner (C61)
                br: { col: 15, row: 76 }  // Bottom-right corner (M7)
            });

            // Upiši string u ćeliju 'AM11'
            bezMjeraWorksheet.getCell('AM11').value = formattedString;
            saMjeramaWorksheet.getCell('AM11').value = formattedString;

        } else {

            bezMjeraPopis = mapDataToCellRanges(structuredDataBezMjera.value, imovinaCellRanges);
            saMjeramaPopis = mapDataToCellRanges(structuredDataSaMjerama.value, imovinaCellRanges);

            // LOGOTIP
            opciWorksheet.addImage(logoId, {
                tl: { col: 2, row: 2 },  // Top-left corner (C3)
                br: { col: 8, row: 6 }  // Bottom-right corner (I6)
            })
            bezMjeraWorksheet.addImage(logoId, {
                tl: { col: 2, row: 2 },  // Top-left corner (C3)
                br: { col: 8, row: 6 }  // Bottom-right corner (I6)
            });
            saMjeramaWorksheet.addImage(logoId, {
                tl: { col: 2, row: 2 },  // Top-left corner (C3)
                br: { col: 8, row: 6 }  // Bottom-right corner (I6)
            });

            // MATRICA RIZIKA
            bezMjeraWorksheet.addImage(matricaId, {
                tl: { col: 2, row: 30 },  // Top-left corner (C31)
                br: { col: 11, row: 43 }  // Bottom-right corner (L43)
            });
            saMjeramaWorksheet.addImage(matricaId, {
                tl: { col: 2, row: 30 },  // Top-left corner (C31)
                br: { col: 11, row: 43 }  // Bottom-right corner (L43)
            });

            // Upiši string u ćeliju 'AI11'
            bezMjeraWorksheet.getCell('AI11').value = formattedString;
            saMjeramaWorksheet.getCell('AI11').value = formattedString;
        }

        // Upisivanje podataka u worksheet za bez mjera
        bezMjeraPopis.forEach(({ cell, value }) => {
            const [column, row] = cell.match(/([A-Z]+)(\d+)/).slice(1); // Odvoji stupac i red
            const cellAddress = `${column}${row}`;
            const parsedValue = isNaN(value) || value === null ? null : parseInt(value); // Provjeri je li vrijednost broj i nije null
            bezMjeraWorksheet.getCell(cellAddress).value = parsedValue; // Postavi vrijednost ćelije
        });

        // Upisivanje podataka u worksheet za sa mjerama
        saMjeramaPopis.forEach(({ cell, value }) => {
            const [column, row] = cell.match(/([A-Z]+)(\d+)/).slice(1); // Odvoji stupac i red
            const cellAddress = `${column}${row}`;
            const parsedValue = isNaN(value) || value === null ? null : parseInt(value); // Provjeri je li vrijednost broj i nije null
            saMjeramaWorksheet.getCell(cellAddress).value = parsedValue; // Postavi vrijednost ćelije
        });

        const vrstaIzracunaShort = vrstaIzracuna.value === 'Imovina' ? 'IM' : vrstaIzracuna.value === 'Djelatnost' ? 'DJ' : '';

        let vrstaObjektaIdShort = '';
        if (vrstaObjektaId.value === 50) vrstaObjektaIdShort = 'PO';
        else if (vrstaObjektaId.value === 51) vrstaObjektaIdShort = 'GZ';
        else if (vrstaObjektaId.value === 52) vrstaObjektaIdShort = 'PZ';

        const katCesticaClean = katCestica.value ? katCestica.value.replace('/', '-') : '';

        // Kreiraj ime datoteke koristeći nove varijable
        const fileName = [
            vrstaIzracunaShort,  // Dodaj vrstu izračuna (IM/DJ)
            vrstaObjektaIdShort, // Dodaj vrstaObjektaId ako postoji (PO/GZ/PZ)
            katOpcinaSifra.value + '-' + katOpcina.value,     // Dodaj katastarsku općinu
            katCesticaClean      // Dodaj katastarsku česticu (zamijeni '/' s '-')
        ].filter(Boolean).join('_') + '.xlsx';

        // console.log("fileName: ", fileName);

        // Generate a buffer for the updated workbook and trigger file download
        const updatedBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([updatedBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);

    } catch (error) {
        // console.error('Error downloading or processing Excel file:', error);
    }
};


</script>

<style scoped>
.body {
    position: relative;
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
    position: relative;
    border: none;
    background: none;

    display: flex;
    align-items: center;
    gap: 16px;
}

.actionButtons>button {
    background: none;
    color: var(--text-color);
    padding: 0px;
    height: auto;
}

.tooltip {
    visibility: hidden;
    position: absolute;
    background-color: var(--input-color);
    color: var(--text-color);
    text-align: center;
    padding: 5px;
    border: var(--border);
    border-radius: 5px;
    font-size: 14px;
    white-space: nowrap;
    top: -35px;

    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s;
}

.action-icon:hover {
    color: var(--primary-color);
    cursor: pointer;
    /* color: gray; */
}

.action-icon:hover .tooltip {
    visibility: visible;
    opacity: 1;
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
    overflow: hidden;
    overflow-x: auto;
}

.tab-panel>div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.sazetak-container {
    align-items: flex-start;
    justify-content: flex-start;
}

@media (max-width: 1400px) {
    .sazetak-container {
        /* width: 1400px; */
        /* Širina kada je tab-panel uži od 1100px */
        overflow-x: auto;
        /* Omogućava horizontalno pomicanje */
        white-space: nowrap;
        /* Sprječava prelamanje teksta */
    }
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
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
}

.h1-container * {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
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

/* .legenda {
    max-width: 500px;
    max-height: 200px;
} */

.popup-expand {
    z-index: 99;
    position: fixed;
    overflow: hidden;

    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    padding: 13px;

    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
}

.expand-content {
    width: 100%;
    max-height: calc(100dvh - 26px - 39px);
    padding: 26px 39px;
    overflow-y: auto;

    background-color: white;
    border-radius: 5px;

    position: relative;
    display: flex;
    flex-direction: column;
    gap: 26px;
}

.content-tabs {
    /* padding-bottom: 26px; */
    width: 100%;
    height: 100%;
}

.icon {
    position: absolute;
    aspect-ratio: 1/1;

    width: 26px;
    height: 26px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
}

.icon:hover {
    background-color: gainsboro;
    cursor: pointer;
}

.left {
    left: 7px;
    top: 50%;
}

.right {
    right: 7px;
    top: 50%;
}

.close {
    top: 7px;
    right: 7px;
}


/* Slide tranzicije */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.2s ease;
}

.slide-right-enter,
.slide-right-leave-to

/* .slide-right-leave-active in <2.1.8 */
    {
    transform: translateX(100%);
    opacity: 0;
}

.slide-right-leave,
.slide-right-enter-to

/* .slide-right-enter-active in <2.1.8 */
    {
    transform: translateX(0);
    opacity: 1;
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.2s ease;
}

.slide-left-enter,
.slide-left-leave-to

/* .slide-left-leave-active in <2.1.8 */
    {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-left-leave,
.slide-left-enter-to

/* .slide-left-enter-active in <2.1.8 */
    {
    transform: translateX(0);
    opacity: 1;
}
</style>