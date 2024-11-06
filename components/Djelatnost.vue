<template>
    <div v-if="dataPositions" class="grid-table">

        <!--*PRVI RED -->
        <div v-for="(item, index) in firstRow" :key="index" :class="item.class" :style="{
            // gridColumnStart: 1, 
            gridColumnEnd: 'span ' + item.colSpan,
            gridRowStart: item.rowStart,
            gridRowEnd: 'span ' + item.rowSpan
        }">
            {{ item.label }}
        </div>

        <!--*DRUGI RED -->
        <div v-for="(item, index) in duplicatedRows(secondRow)" :key="index"
            :class="[getFirstElementClass(index), item.class]" :style="{
                gridColumnEnd: 'span ' + item.colSpan,
                gridRowStart: item.rowStart,
                gridRowEnd: 'span ' + item.rowSpan
            }">
            {{ item.label }}
        </div>

        <!--*TRECI RED -->
        <div v-for="(item, index) in duplicatedRows(thirdRow)" :key="index"
            :class="[getFirstElementClass(index), item.class]" :style="{
                gridColumnEnd: 'span ' + item.colSpan,
                gridRowStart: item.rowStart,
                gridRowEnd: 'span ' + item.rowSpan
            }">
            {{ item.label }}
        </div>


        <!--*CETVRTI RED -->
        <div v-for="(item, index) in duplicated4Rows(fourthRow)" :key="index"
            :class="[getDynamicClass(index, fourthRow), item.class]" :style="{
                gridColumnEnd: 'span ' + item.colSpan,
                gridRowStart: item.rowStart,
                gridRowEnd: 'span ' + item.rowSpan
            }">
            {{ item.label }}
        </div>

        <!--*GRID TABLE -->

        <!-- Header item -->
        <div v-for="position in popisPozicija" :key="position" :style="getGridStyles(position)"
            :class="getGridClasses(position)">
            {{ structuredData[position] ? structuredData[position][0].tdg_naziv : '' }}
        </div>

        <!-- Parametri -->
        <!-- <template v-for="section in parametri" :key="section">
            <div v-for="(position, key) in parametriPositions[section]" :key="key"
                :class="['grid-item', 'parametri', { nb: !structuredData[key] }]" :style="getParametriStyles(position)">
                {{ structuredData[key] ? section : '' }}
            </div>
        </template> -->
        <template v-for="section in parametri" :key="section">
            <div v-for="(position, key) in parametriPositions[section]" :key="key"
                :class="['parametri', getParametriClasses(section, key)]" :style="getParametriStyles(position)">
                {{ structuredData[key] ? section : '' }}
            </div>
        </template>


        <!-- Data iznosi -->
        <template v-for="(rows, key) in dataPositions" :key="key">
            <template v-if="rows.empty">
                <div class="grid-item empty nb" :class="getEmptyClasses(key)" />
            </template>
            <template v-else>
                <template v-for="(itemRow, index) in rows" :key="index">
                    <div v-for="(item, itemIndex) in itemRow" :key="itemIndex" :style="getParametriStyles(item)" :class="[
                        'grid-item',
                        'nb-r',
                        'nb-b',
                        getColorClass(parseInt(item.value)),
                        ...getSpecificClass(item) // Koristi spread operator za dodavanje klasa
                    ]">
                        {{ item.value }}
                    </div>
                </template>

            </template>
        </template>

    </div>
    <span v-else style="font-style: italic; display: flex; gap: 10px; width: 100%;">
        Učitavanje tablice
        <font-awesome-icon icon="spinner" spin />
    </span>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProcessGridData } from '~/service/kpkr/grid_data';
import { restructureData } from '~/utils/dataFormatter';
import { useStructuredGridDataStore } from '~/stores/main-store';
import {
    firstRow,
    secondRow,
    // thirdRow,
    fourthRow,
    popisPozicija,
    gridHeaderItemConfig,
    parametri,
    parametriPositions,
    pozicijaPostavke
} from '~/composables/arrays';

const structuredDataStore = useStructuredGridDataStore();

const processData = ref([]);
const structuredData = ref([]);
const dataPositions = ref(null);

const message = ref('');
const showPopup = ref(false);

const props = defineProps({
    tip: String,
})
const tip = props.tip; // 'RZ' ili 'KR'

const idIzracuna = ref('');
const vrstaIzracuna = ref(null); // Inicijalno je null
const scenarij = ref('');

const initializeScenarij = async () => {
    const cookieValue = await initializeCookie('scenarij');
    scenarij.value = cookieValue ? cookieValue : 'RCP'; // Postavi scenarij na temelju kolačića ili default
};

const thirdRow = computed(() => [
    { class: 'grid-item nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item tablegreen nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item tablegreen nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item pad5 darkgreen nb-r nb-t nb-b', label: `${scenarij.value} 4.5`, colSpan: 3, rowSpan: 1 },
    { class: 'grid-item pad5 darkgreen nb-b nb-t sb-w-l', label: `${scenarij.value} 8.5`, colSpan: 3, rowSpan: 1 },
]);

const processGridData = async () => {
    const data = await getProcessGridData(idIzracuna.value, tip);
    processData.value = data.data;
    if (processData.value.message) {
        message.value = processData.value.message;
        showPopup.value = true;
    } else {
        structuredData.value = restructureData(processData.value);
        dataPositions.value = generateDataPositions(structuredData.value, popisPozicija);

        if (tip == 'RZ') {
            structuredDataStore.clearStructureDataBezMjera();
            structuredDataStore.setStructuredDataBezMjera(structuredData.value);
            console.log("data bez mjera: ", structuredDataStore.structuredDataBezMjera);
        } else if (tip == 'KR') {
            structuredDataStore.clearStructureDataSaMjerama();
            structuredDataStore.setStructuredDataSaMjerama(structuredData.value);
            console.log("data sa mjerama: ", structuredDataStore.structuredDataSaMjerama);
        } else {
            console.log("Greška u tipu:", tip);
        }
    }
    // console.log("proces: ", processData.value);

    //console.log(structuredData.value["11"])
}

const cookiesToGet = ['id-izracuna', 'vrsta-izracuna', 'scenarij'];

onMounted(async () => {
    const cookieData = await initializeCookie(cookiesToGet);

    idIzracuna.value = cookieData['id-izracuna'] || '';
    vrstaIzracuna.value = cookieData['vrsta-izracuna'] || '';
    scenarij.value = cookieData['scenarij'] || 'RCP';

    await processGridData();
})

const getParametriClasses = (parameter, position) => {

    // Osnovne klase
    const baseClasses = ['grid-item', 'parametri', 'nb-r', 'nb-b', parameter];

    // Provjeri postoji li structuredData za trenutnu poziciju
    if (!structuredData.value[position]) {
        baseClasses.push('nb');
    }

    if (additionalClassesParametri[parameter]?.[position]) {
        baseClasses.push(...additionalClassesParametri[parameter][position]);
    }

    return baseClasses;
};

const generateDataPositions = (structuredData, popisPozicija) => {
    const dataPositions = {};

    popisPozicija.forEach((pozicija) => {
        if (structuredData[pozicija] && pozicijaPostavke[pozicija]) {
            dataPositions[pozicija] = {};

            const { rowStart, columnStart } = pozicijaPostavke[pozicija]; // Dohvaćamo početni red i stupac za ovu poziciju

            structuredData[pozicija].forEach((data, dataIndex) => {
                if (data) {
                    const currentRow = rowStart + dataIndex; // Redak se povećava za svaki dataIndex
                    dataPositions[pozicija][dataIndex] = [
                        { value: data.history || '', row: currentRow, column: columnStart },
                        { value: data.p0_4_5 || '', row: currentRow, column: columnStart + 1 },
                        { value: data.p1_4_5 || '', row: currentRow, column: columnStart + 2 },
                        { value: data.p2_4_5 || '', row: currentRow, column: columnStart + 3 },
                        { value: data.p0_8_5 || '', row: currentRow, column: columnStart + 4 },
                        { value: data.p1_8_5 || '', row: currentRow, column: columnStart + 5 },
                        { value: data.p2_8_5 || '', row: currentRow, column: columnStart + 6 },
                    ];
                }
            });
        } else {
            console.warn(`Pozicija '${pozicija}' nema podataka u structuredData ili nije definirana u pozicijaPostavke.`);
            dataPositions[pozicija] = { empty: true };
        }
    });

    console.log('Generirani dataPositions:', dataPositions);
    return dataPositions;
};

const getSpecificClass = (item) => {
    const classes = []; // Inicijaliziraj niz za klase

    // Definirajte uvjete za specifične klase
    if (item.column === 37) {
        classes.push('sb-r'); // Ova klasa će se dodati za element u stupcu 37
    }

    if ([4, 13, 22, 31].includes(item.column)) {
        classes.push('history', 'sb-r2', 'sb-l3'); // Dodaj više klasa za određene stupce
    }

    if (item.row === 44 && item.column >= 22 && item.column <= 31) {
        classes.push('sb-b'); // Ova klasa se dodaje za red 44 između stupaca 22 i 31
    }

    if (item.row === 44 && item.column === 22) {
        classes.push('sb-b'); // Ova klasa se dodaje za red 44 i stupac 22
    }

    if (parseInt(item.value) > 100) {
        classes.push('large-value'); // Klasa za sve elemente s vrijednošću većom od 100
    }

    return classes; // Vraća sve klase
};


const additionalClassesHeaderItem = {
    '22': ['db-l', 'sb-t'],
    '32': ['db-l',],
    '42': ['db-l',],
    '51': ['sb-t'],
    '54': ['db-l', 'sb-t'],
    '64': ['db-l'],
    '101': ['sb-t', 'sb-b'],
    '102': ['sb-t', 'sb-b'],
    '103': ['sb-b'],
    '104': ['db-l', 'sb-t', 'sb-b'],
};

const additionalClassesParametri = {
    'imovina': {
        '22': ['sb-t'],
        '51': ['sb-t'],
        '54': ['sb-t'],
        '101': ['sb-t'],
        '102': ['sb-t'],
        '104': ['sb-t'],
        // Dodaj ostale pozicije i klase za "imovina"
    },
    'procesi': {
        '101': ['sb-b'],
        '102': ['sb-b'],
        '103': ['sb-b'],
        '104': ['sb-b'],
        // Dodaj ostale pozicije i klase za "izlaz"
    },
    // Dodaj za ostale parametre
};

const getGridClasses = (position) => {
    const config = gridHeaderItemConfig[position]; // uzmi konfiguraciju za trenutnu poziciju

    // Osnovne klase
    const baseClasses = ['grid-item', 'header-item', 'vertical'];

    // Provjera postoji li structuredData za trenutnu poziciju
    if (structuredData.value[position]) {
        const column = config ? config.column : null; // uzmi stupac iz gridHeaderItemConfig

        // Dodaj klasu boje na temelju stupca
        if (column == 2) {
            baseClasses.push('pink');
        } else if (column == 11) {
            baseClasses.push('lightgreen', 'db-l');
        } else if (column == 20) {
            baseClasses.push('lightblue', 'db-l');
        } else if (column == 29) {
            baseClasses.push('headergray', 'db-l');
        }


    } else {
        // Prazni elementi ne boje
        baseClasses.push('nb'); // dodaj klasu za prazne elemente, npr. 'nb-b'
    }

    // Dodaj prilagodljive klase za specifične pozicije
    if (additionalClassesHeaderItem[position]) {
        baseClasses.push(...additionalClassesHeaderItem[position]);
    }

    return baseClasses;
};

const getEmptyClasses = (key) => {
    const additionalClasses = [];

    // Dodaj specifične klase za određene blokove
    if (key === '22' || key === '51' || key === '54' || key === '101' || key === '102' || key === '104') {
        additionalClasses.push('sb-t');
    }
    if (key === '101' || key === '102' || key === '104') {
        additionalClasses.push('sb-b');
    }
    if (key === '54' || key === '64' || key === '104') {
        additionalClasses.push('sb-r');
    }

    // Vrati string ili niz klasa
    return additionalClasses;
};

// Funkcija koja izračunava grid poziciju
const getGridStyles = (position) => {
    const config = gridHeaderItemConfig[position];
    return {
        gridRow: config ? `${config.row} / span 4` : 'auto', // koristi row iz gridHeaderItemConfig
        gridColumn: config ? config.column : 'auto' // koristi column iz gridHeaderItemConfig
    };
};

const getParametriStyles = (position) => {
    return {
        gridRow: position.row,
        gridColumn: position.column,
    };
};

const duplicated4Rows = (row) => {
    return Array.from({ length: 4 }, () => row).flat();
}

const duplicatedRows = (row) => {
    return Array.from({ length: 4 }, (_, i) => {
        // Prva tri elementa se mijenjaju s klasom ovisno o broju ponavljanja
        return row.map((item, index) => {
            if (index < 3) {
                return {
                    ...item,
                    class: `grid-item ${['pink', 'lightgreen', 'lightblue', 'headergray'][i]} postojeci nb` // Promjena klase ovisno o ponavljanju
                };
            }
            return item; // Ostali elementi ostaju nepromijenjeni
        });
    }).flat();
};

// Funkcija koja dinamički vraća klasu ovisno o tome koji je redoslijed ponavljanja (1., 2., 3., 4. put)
function getDynamicClass(index, row) {
    const elementIndex = index % row.length;

    if (elementIndex === 0) {
        const repetitionIndex = Math.floor(index / row.length);

        switch (repetitionIndex) {
            case 0: return 'pink';
            case 1: return 'lightgreen';
            case 2: return 'lightblue';
            case 3: return 'headergray';
            default: return '';
        }
    }

    return ''; // Za ostale elemente, nema promjene klase
}

function getFirstElementClass(index) {
    const firstElementClasses = ['pink', 'lightgreen', 'lightblue', 'headergray'];
    if (index === 0) {
        return firstElementClasses[0];
    } else if (index === 9) {
        return firstElementClasses[1];
    } else if (index === 18) {
        return firstElementClasses[2];
    } else if (index === 27) {
        return firstElementClasses[3];
    }

    return ''; // Ostali elementi ne mijenjaju klasu
}


</script>

<style scoped>
.rizik-sazetak {
    /* Stilovi za vašu komponentu */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* gap: 20px; */
}

.sazetak {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* gap: 20px; */
}

.grid-table {
    display: grid;
    grid-template-columns: repeat(37, 1fr);
    /* grid-template-rows: repeat(44, 1fr); */
    grid-auto-rows: minmax(30px, 30px);
    /* grid-auto-flow: row; */
    margin: 0;
    padding: 0;
    gap: 0px;
    background-color: white;
    color: var(--text-color);
    /* padding: 10px; */
}

.grid-item {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #3C7D22;
    font-size: 14px;

    font-size: clamp(8px, 1vw, 14px);
    /* Skalira font između 10px i 14px ovisno o širini prozora */
    white-space: nowrap;
    text-wrap: wrap;
    text-align: center;
    text-overflow: ellipsis;
    /* Dodaje tri točke (...) kad je tekst predug */
}

.vertical {
    /* writing-mode: vertical-lr; */
    writing-mode: sideways-lr;
    text-orientation: upright;
    text-align: center;

    text-wrap: wrap;
    font-size: 14px;
    padding: 5px;

    border-right: none;
    border-left: none;
    border-bottom: none;
}

.table-item {
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    border: none;
}

.sazetak-table {
    width: 100%;
    height: 100%;
    border: none;
}

.table-header {
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    /* padding-left: 30px;
    padding-right: 5px; */

    padding: 5px;

    border-right: none;
    border-bottom: none;
}

.postojeci {
    /* font-weight: bold; */
    justify-content: flex-end;
    padding-right: 5px;
}

.th {
    /* font-weight: bold; */
    border-right: 1px dashed #3C7D22;
    border-left: 1px solid #3C7D22;
    border-bottom: 1px solid #3C7D22;
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
    background-color: rgb(192, 57, 43);
    /* Zelena boja za uspjeh */
    border-radius: 5px;
    overflow: hidden;
    /* Osigurava da progress bar bude unutar popup-a */
    transition: all 0.5s ease-in-out;
    /* Animacija za pojavu i nestajanje */
}

.success-popup.error {
    background-color: rgb(192, 57, 43);
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

.f12 {
    font-size: 12px;
}

.pad-lr-5 {
    padding-right: 5px;
    padding-left: 5px;
}

.nb {
    border: none;
}

.nb-t {
    border-top: none;
}

.nb-b {
    border-bottom: none;
}

.nb-l {
    border-left: none;
}

.nb-r {
    border-right: none;
}

.nb-rd {
    border-right: none;
    border-bottom: none;
}

.db {
    border: #3C7D22 1px dashed;
}

.db-r {
    border-right: #3C7D22 1px dashed;
}

.db-l {
    border-left: #3C7D22 1px dashed;
}

.db-t {
    border-top: #3C7D22 1px dashed;
}

.db-b {
    border-bottom: #3C7D22 1px dashed;
}

.sb {
    border: 1px solid #3C7D22;
}

.sb-r {
    border-right: 1px solid #3C7D22;
}

.sb-r2 {
    border-right: 2px solid #3C7D22;
}

.sb-l {
    border-left: 1px solid #3C7D22;
}

.sb-l2 {
    border-left: 2px solid #3C7D22;
}

.sb-l3 {
    border-left: 3px solid #3C7D22;
}

.sb-t {
    border-top: 1px solid #3C7D22;
}

.sb-b {
    border-bottom: 1px solid #3C7D22;
}

.sb-w {
    border: 1px solid white;
}

.sb-w-t {
    border-top: 1px solid white;
}

.sb-w-b {
    border-bottom: 1px solid white;
}

.sb-w-l {
    border-left: 1px solid white;
}

.sb-w-r {
    border-right: 1px solid white;
}


/* < 0 */
.lightgray {
    color: #caedfb;
    background-color: #caedfb;
    font-style: italic;
    user-select: none;
}

/* = 0 */
.white {
    font-style: italic;
    background-color: #ffffff;
}

/* > 0 */
.gray {
    background-color: #bfbfbf;
}

/* [2, 3] */
.green {
    background-color: #92d050;
}

/* [4, 6] */
.yellow {
    background-color: #ffff00;
}

/* [7, 10] */
.orange {
    background-color: #ffc000;
}

/* [11, 15] */
.red {
    background-color: #ff0000;
}


.nullgray {
    background-color: rgb(239, 239, 239);
}

.pink {
    background-color: #FBE2D5;
}

.lightgreen {
    background-color: #FFFFE1;
}

.headergray {
    background-color: #D9D9D9;
}

.lightblue {
    background-color: #F0FAFE;
}

.tablegreen {
    background-color: #DAF2D0;
}

.darkgreen {
    color: white;
    background-color: #3C7D22;
}

.header-item {
    grid-row: span 4;
}

.parametri {
    padding: 0px 5px 0px 10px;
    text-align: right;
}

.empty {
    grid-row: span 4;
    grid-column: span 7;
}

.history {
    min-width: 40px;
}

.pad5 {
    padding: 5px;
}

@media screen and (max-width: 1600px) {
    .grid-item {
        font-size: 12px;
    }

    .history {
        min-width: 30px;
    }
}
</style>