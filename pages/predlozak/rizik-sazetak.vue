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
                    <TabPanel value="0" class="tab-panel">
                        <div ref="rizikSazetakRef">
                            <RizikSazetak v-if="vrstaIzracuna == 'Djelatnost'" :tip="'RZ'" class="rizik-sazetak" />
                            <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :tip="'RZ'" />
                            <span v-else>
                                <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                                Nije odabrana vrsta izračuna
                            </span>
                        </div>
                    </TabPanel>
                    <TabPanel value="1" class="tab-panel">
                        <div ref="rizikSazetakMjereRef">
                            <RizikSazetak v-if="vrstaIzracuna == 'Djelatnost'" :tip="'KR'" class="rizik-sazetak" />
                            <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :tip="'KR'" />
                            <span v-else>
                                <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                                Nije odabrana vrsta izračuna
                            </span>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
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
                <button class="action-icon" :disabled="!structuredDataBezMjera || !structuredDataSaMjerama"
                    @click="downloadRizikSazetak($event)"> <!--@click="downloadRizikSazetak($event)"-->
                    <font-awesome-icon icon="download" size="lg" />
                </button>
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
import axios from 'axios';
import TablicaRizika from '~/components/TablicaRizika.vue';
import { useOpciStore, useStructuredGridDataStore } from '#imports';
import { formatDateToDMY } from '#imports';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

definePageMeta({
    middleware: [
        'auth',
        'id-izracuna'
    ],
});

const rizikSazetakRef = ref(null);
const rizikSazetakMjereRef = ref(null);

const opciStore = useOpciStore();
const structuredDataStore = useStructuredGridDataStore();

const cellRanges = {
    '11': { range: 'F19:L22' },
    '12': { range: 'O19:U22' },
    '13': { range: 'X19:AD22' },
    '14': { range: 'AG19:AM22' },

    '21': { range: 'F23:L26' },
    '23': { range: 'X23:AD26' },
    '24': { range: 'AG23:AM26' },

    '31': { range: 'F27:L30' },
    '33': { range: 'X27:AD30' },
    '34': { range: 'AG27:AM30' },

    '41': { range: 'F31:L34' },
    '43': { range: 'X31:AD34' },
    '44': { range: 'AG31:AM34' },

    '53': { range: 'X35:AD38' },

    '63': { range: 'X39:AD42' },

    '71': { range: 'F43:L46' },
    '72': { range: 'O43:U46' },
    '73': { range: 'X43:AD46' },
    '74': { range: 'AG43:AM46' },

    '81': { range: 'F47:L50' },
    '82': { range: 'O47:U50' },
    '83': { range: 'X47:AD50' },
    '84': { range: 'AG47:AM50' },

    '91': { range: 'F51:L54' },
    '92': { range: 'O51:U54' },
    '93': { range: 'X51:AD54' },
    '94': { range: 'AG51:AM54' },

    '103': { range: 'X55:AD58' },
};

const idIzracuna = ref(
    useCookie('id_izracuna').value == '/' ||
        useCookie('id_izracuna') == undefined
        ? '/'
        : parseInt(useCookie('id_izracuna').value)
);

const structuredDataBezMjera = ref(computed(() => structuredDataStore.structuredDataBezMjera))
const structuredDataSaMjerama = ref(computed(() => structuredDataStore.structuredDataSaMjerama))

// Kreiramo referencu za pristup komponenti
const vrstaIzracuna = ref(useCookie('vrsta_izracuna').value);

onMounted(async () => {
    await opciStore.fetchCalculation(idIzracuna.value);
})

const datum = computed(() => opciStore.opci_podaci.aiz_datum);
const katOpcinaSifra = computed(() => opciStore.opci_podaci.kop_sif);
const katOpcina = computed(() => opciStore.opci_podaci.kop_naziv);
const katCestica = computed(() =>
    opciStore.opci_podaci.kcs_sif === ''
        ? null
        : opciStore.opci_podaci.kcs_sif
);
const vrstaObjektaId = computed(() => opciStore.opci_podaci.aiz_tvo_id);
const vrstaImovine = computed(() => opciStore.opci_podaci.tvo_naziv);
const djelatnostSifra = computed(() => opciStore.opci_podaci.djl_sif)
const djelatnost = computed(() =>
    opciStore.opci_podaci.djl_naziv === ''
        ? null
        : opciStore.opci_podaci.djl_naziv
);
const skupinaDjelatnosti = computed(() => opciStore.opci_podaci.djl_naziv_sk);
const ispostava = computed(() => opciStore.opci_podaci.isp_naziv);
const podrucniUred = computed(() => opciStore.opci_podaci.puk_naziv);

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

const columns = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const doubleColumns = columns.map(col => columns.map(subCol => col + subCol)).flat(); // Generiraj dvo-slovne stupce
const allColumns = [...columns, ...doubleColumns]; // Kombiniraj jednoslovne i dvo-slovne stupce

function mapDataToCellRanges(structuredData, cellRanges) {
    const cellData = [];

    Object.keys(cellRanges).forEach(position => {
        const { range } = cellRanges[position];
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
    const bezMjeraPopis = mapDataToCellRanges(structuredDataBezMjera.value, cellRanges);
    const saMjeramaPopis = mapDataToCellRanges(structuredDataSaMjerama.value, cellRanges);
    console.log("rezultat mapiranja (bez mjera): ", bezMjeraPopis);
    console.log("rezultat mapiranja (sa mjerama): ", saMjeramaPopis);
}

const downloadRizikSazetak = async () => {
    try {
        // Fetch the Excel file from the server
        const response = await axios.get('/blobs/DjelatnostTemplate.xlsx', {
            responseType: 'blob',
            headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        });

        // Convert the response to an ArrayBuffer
        const arrayBuffer = await response.data.arrayBuffer();

        // Use JSZip to handle the Excel file format (ZIP)
        const typedArray = new Uint8Array(arrayBuffer);
        const zip = await JSZip.loadAsync(typedArray);

        // Load the Excel workbook using ExcelJS
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        // Access the first worksheet (or by name if necessary)
        const opciWorksheet = workbook.getWorksheet('Opći podaci');
        const bezMjeraWorksheet = workbook.getWorksheet('Izračun bez mjera prilagodbe');
        const saMjeramaWorksheet = workbook.getWorksheet('Izračun s mjerama prilagodbe');

        const bezMjeraPopis = mapDataToCellRanges(structuredDataBezMjera.value, cellRanges);
        const saMjeramaPopis = mapDataToCellRanges(structuredDataSaMjerama.value, cellRanges);

        // console.log("rezultat mapiranja (bez mjera): ", bezMjeraPopis);
        // console.log("rezultat mapiranja (sa mjerama): ", saMjeramaPopis);

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

        opciWorksheet.addImage(logoId, {
            tl: { col: 2, row: 2 },  // Top-left corner (C3)
            br: { col: 8, row: 6 }  // Bottom-right corner (I6)
        })

        // LOGOTIP
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
            br: { col: 21, row: 76 }  // Bottom-right corner (M7)
        });
        saMjeramaWorksheet.addImage(matricaId, {
            tl: { col: 2, row: 60 },  // Top-left corner (C61)
            br: { col: 21, row: 76 }  // Bottom-right corner (M7)
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


        // Generiranje stringa iz filteredItems bez zareza na zadnjem elementu
        const formattedString = filteredItems.value.map((item, index) => {
            return `${item.value}${index !== filteredItems.value.length - 1 ? item.suffix + ' ' : ''}`;
        }).join('');

        console.log("formattedString: ", formattedString);

        // Upiši string u ćeliju 'AM11'
        bezMjeraWorksheet.getCell('AM11').value = formattedString;
        saMjeramaWorksheet.getCell('AM11').value = formattedString;

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

        console.log("fileName: ", fileName);

        // Generate a buffer for the updated workbook and trigger file download
        const updatedBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([updatedBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);

    } catch (error) {
        console.error('Error downloading or processing Excel file:', error);
    }
};


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

.actionButtons>button {
    background: none;
    color: var(--text-color);
    padding: 0px;
    height: auto;
}

/* .action-icon {
    color: gray;
} */

.action-icon:hover {
    color: var(--primary-color);
    cursor: pointer;
    /* color: gray; */
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

.legenda {
    padding: 0px 15px;
}
</style>