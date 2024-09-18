<template>
    <div class="body">
        <div v-if="showPopup" class="success-popup">
            <font-awesome-icon :icon="'circle-exclamation'" />
            <span>
                {{ message }}
            </span>
            <div class="progress-bar" />
        </div>
        <div class="sazetak">
            <div v-if="structuredData" class="grid-table">
                <div class="grid-item nb"></div>
                <div class="grid-item nb-r nb-b rcp">RCP 4.5</div>
                <div class="grid-item nb-b rcp">RCP 8.5</div>
                <div class="grid-item nb"></div>
                <div class="grid-item nb-r nb-b rcp">RCP 4.5</div>
                <div class="grid-item nb-b rcp">RCP 8.5</div>
                <div class="grid-item nb"></div>
                <div class="grid-item nb-r nb-b rcp">RCP 4.5</div>
                <div class="grid-item nb-b rcp">RCP 8.5</div>
                <div class="grid-item nb"></div>
                <div class="grid-item nb-r nb-b rcp">RCP 4.5</div>
                <div class="grid-item nb-b rcp">RCP 8.5</div>

                <div class="grid-item vertical th" style="border-bottom: none;">Kronični</div>
                <div class="grid-item vertical th">Akutni</div>

                <div class="grid-item green postojeci nb-r nb-b">Postojeći</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-r nb-b">P2</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-b">P2</div>

                <div class="grid-item green postojeci nb-l nb-r nb-b">Postojeći</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-r nb-b">P2</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-b">P2</div>

                <div class="grid-item green postojeci nb-l nb-r nb-b">Postojeći</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-r nb-b">P2</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-b">P2</div>

                <div class="grid-item green postojeci nb-l nb-r nb-b">Postojeći</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-r nb-b">P2</div>
                <div class="grid-item darkgreen nb-r nb-b">P0</div>
                <div class="grid-item darkgreen nb-r nb-b">P1</div>
                <div class="grid-item darkgreen nb-b">P2</div>

                <div class="grid-item pink nb-l nb-b nb-r">Temperatura</div>
                <div class="grid-item lightgreen db-l nb-b nb-r">Vjetar</div>
                <div class="grid-item lightgray db-l nb-b nb-r">Voda</div>
                <div class="grid-item gray db-l nb-b">Čvrsta masa</div>

                <div class="grid-item table-header nb-l">Promjene temperature</div>
                <div class="grid-item table-header nb-l">Temperaturni stres</div>
                <div class="grid-item table-header nb-l">Varijabilnost temperature</div>
                <div class="grid-item table-header nb-l"> Otapanje vječnog leda</div>
                <div class="grid-item table-header nb-l"></div>
                <div class="grid-item table-header nb-l nb-t"></div>
                <div class="grid-item table-header nb-l">Toplinski val</div>
                <div class="grid-item table-header nb-l">Hladni val/mraz</div>
                <div class="grid-item table-header nb-l">Požar</div>
                <div class="grid-item table-header nb-l sb-b"></div>

                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="11" :data="structuredData['11']" class="red-table" />
                </div>

                <div class="grid-item table-header">Promjene tokova vjetra</div>
                <div class="grid-item table-header"></div>
                <div class="grid-item table-header nb-t"></div>
                <div class="grid-item table-header nb-t"></div>
                <div class="grid-item table-header nb-t"></div>
                <div class="grid-item table-header nb-t"></div>
                <div class="grid-item table-header">Ciklon, uragan, tajfun</div>
                <div class="grid-item table-header">Oluja</div>
                <div class="grid-item table-header">Tornado</div>
                <div class="grid-item table-header sb-b nb-l"></div>

                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="12" :data="structuredData['12']" class="red-table" />
                </div>

                <div class="grid-item table-header">Promjene u obrascima i vrsti oborina</div>
                <div class="grid-item table-header">Varijabilnost oborina</div>
                <div class="grid-item table-header">Zakiseljavanje oceana</div>
                <div class="grid-item table-header">Prodor slane vode</div>
                <div class="grid-item table-header">Podizanje razine mora</div>
                <div class="grid-item table-header">Nestašica vode</div>
                <div class="grid-item table-header">Suša</div>
                <div class="grid-item table-header">Jake oborine</div>
                <div class="grid-item table-header">Poplave</div>
                <div class="grid-item table-header sb-b">Izljev ledenjačkih jezera</div>

                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="13" :data="structuredData['13']" class="red-table" />
                </div>

                <div class="grid-item table-header">Erozija obale</div>
                <div class="grid-item table-header">Degradacija tla</div>
                <div class="grid-item table-header">Erozija tla</div>
                <div class="grid-item table-header">Soliflukcija</div>
                <div class="grid-item table-header"></div>
                <div class="grid-item table-header nb-t"></div>
                <div class="grid-item table-header">Lavina</div>
                <div class="grid-item table-header">Klizišta</div>
                <div class="grid-item table-header">Slijeganje tla</div>
                <div class="grid-item table-header sb-b"></div>

                <div class="grid-item nb sb-r">
                    <RedTabliceRizika :pozicija="14" :data="structuredData['14']" class="red-table" />
                </div>

                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="21" :data="structuredData['21']" class="red-table" />
                </div>
                <div class="grid-item nb sb-t">

                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="23" :data="structuredData['23']" class="red-table" />
                </div>
                <div class="grid-item nb sb-r">
                    <RedTabliceRizika :pozicija="24" :data="structuredData['24']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="31" :data="structuredData['31']" class="red-table" />
                </div>
                <div class="grid-item nb">

                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="33" :data="structuredData['33']" class="red-table" />
                </div>
                <div class="grid-item nb sb-r">
                    <RedTabliceRizika :pozicija="34" :data="structuredData['34']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="41" :data="structuredData['41']" class="red-table" />
                </div>
                <div class="grid-item nb">

                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="43" :data="structuredData['43']" class="red-table" />
                </div>
                <div class="grid-item nb sb-r">
                    <RedTabliceRizika :pozicija="44" :data="structuredData['44']" class="red-table" />
                </div>
                <div class="grid-item nb sb-t">

                </div>
                <div class="grid-item nb">

                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="53" :data="structuredData['53']" class="red-table" />
                </div>
                <div class="grid-item nb sb-t sb-r">

                </div>
                <div class="grid-item nb">

                </div>
                <div class="grid-item nb">

                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="63" :data="structuredData['63']" class="red-table" />
                </div>
                <div class="grid-item nb sb-r">

                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="71" :data="structuredData['71']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="72" :data="structuredData['72']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="73" :data="structuredData['73']" class="red-table" />
                </div>
                <div class="grid-item nb sb-r">
                    <RedTabliceRizika :pozicija="74" :data="structuredData['74']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="81" :data="structuredData['81']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="82" :data="structuredData['82']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="83" :data="structuredData['83']" class="red-table" />
                </div>
                <div class="grid-item nb sb-r">
                    <RedTabliceRizika :pozicija="84" :data="structuredData['84']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="91" :data="structuredData['91']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="92" :data="structuredData['92']" class="red-table" />
                </div>
                <div class="grid-item nb">
                    <RedTabliceRizika :pozicija="93" :data="structuredData['93']" class="red-table" />
                </div>
                <div class="grid-item nb sb-r">
                    <RedTabliceRizika :pozicija="94" :data="structuredData['94']" class="red-table" />
                </div>
                <div class="grid-item nb sb-t sb-b">

                </div>
                <div class="grid-item nb sb-t sb-b">

                </div>
                <div class="grid-item nb sb-b">
                    <RedTabliceRizika :pozicija="103" :data="structuredData['103']" class="red-table" />
                </div>
                <div class="grid-item nb sb-t sb-r sb-b">

                </div>
            </div>
            <LegendaBoja v-if="structuredData" class="legenda" />
        </div>
        <!-- <span v-else style="font-style: italic;">
            Učitavanje podataka
            <font-awesome-icon icon="spinner" spin />
        </span>
        <span v-if="message">
            <font-awesome-icon icon="file-circle-xmark" />
            Nema podataka za prikaz rizika
        </span> -->

    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { getPropertyGridData } from '~/service/fetchGridData';
import { restructureData } from '~/utils/dataFormatter';

const propertyData = ref([]);
const structuredData = ref([]);

const message = ref('');
const showPopup = ref(false);

const props = defineProps({
    tip: String,
})
const tip = props.tip;

const idIzracuna = ref();
const vrstaIzracuna = ref(); //
idIzracuna.value = parseInt(useCookie('id_izracuna').value);
vrstaIzracuna.value = useCookie('vrsta_izracuna').value;


const propertyGridData = async () => {
    const data = await getPropertyGridData(idIzracuna.value, tip);
    propertyData.value = data.data;
    propertyData.value = data.data;
    if (propertyData.value.message) {
        message.value = propertyData.value.message;
        showPopup.value = true;

        // Uklanjanje popup-a nakon 3 sekunde
        // setTimeout(() => {
        //     showPopup.value = false;
        // }, 3000);
    } else {
        structuredData.value = restructureData(propertyData.value);
        console.log("restructure proces: ", structuredData.value, structuredData.value['11'].length);
    }

    structuredData.value = restructureData(propertyData.value);
}

onMounted(() => {
    if (vrstaIzracuna.value == 'Imovina') {
        propertyGridData();
    }

})

</script>

<style scoped>
.body {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.grid-table {
    display: grid;
    grid-template-columns: repeat(33, 1fr);
    grid-template-rows: repeat(13, 1fr);
    margin: 0;
    padding: 0;
    background-color: white;
    color: #2a2a2a;
    /* border: 1px solid #2a2a2a; */
}

.grid-item {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #a6c9ec;
    font-size: 14px;

    text-wrap: wrap;
}

.vertical {
    writing-mode: sideways-lr;
    text-orientation: sideways;
    text-align: center;
    text-wrap: wrap;

    font-size: 14px;
    font-weight: 500;
    padding: 5px;

    border-right: none;
    border-left: none;
    border-bottom: none;
}

.rcp {
    color: #0070c0;
    font-weight: 500;
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

.red-table {
    width: 100%;
    height: 100%;
    border: none;
}

.table-header {
    align-items: center;
    justify-content: center;
    text-align: center;

    font-weight: 500;

    padding: 5px 20px;

    border-right: none;
    border-bottom: none;
}

.postojeci {
    /* font-weight: bold; */
    justify-content: flex-end;
    padding-right: 5px;
    color: white;
}

.sazetak {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
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
    font-weight: 500;
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

.th {
    /* font-weight: bold; */
    border-right: 1px dashed #a6c9ec;
    border-left: 1px solid #a6c9ec;
    border-bottom: 1px solid #a6c9ec;
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


.db {
    border: #a6c9ec 1px dashed;
}

.db-r {
    border-right: #a6c9ec 1px dashed;
}

.db-l {
    border-left: #a6c9ec 1px dashed;
}

.db-t {
    border-top: #a6c9ec 1px dashed;
}

.db-b {
    border-bottom: #a6c9ec 1px dashed;
}

.sb {
    border: 1px solid #a6c9ec;
}

.sb-r {
    border-right: 1px solid #a6c9ec;
}

.sb-l {
    border-left: 1px solid #a6c9ec;
}

.sb-t {
    border-top: 1px solid #a6c9ec;
}

.sb-b {
    border-bottom: 1px solid #a6c9ec;
}




.pink {
    background-color: #fbe2d5;
}

.lightgreen {
    background-color: #daf2d0;
}

.gray {
    background-color: #bfbfbf;
}

.lightgray {
    background-color: #caedfb;
}

.green {
    background-color: #4d93d9;
}

.darkgreen {
    color: white;
    background-color: #0070c0;
}




.nb-rd {
    border-right: none;
    border-bottom: none;
}

.nb-l {
    border-left: none;
}

.nb-r {
    border-right: none;
}

.nb-d {
    border-bottom: none;
}

.nb-rd:nth-child(2) {
    border-right: 1px solid #a6c9ec;
}

.grid-item:first-child {
    grid-column: 1 / 4;
}

.grid-item:nth-child(2) {
    grid-column: 4 / 7;
}

.grid-item:nth-child(3) {
    grid-column: 7 / 10;
}

.grid-item:nth-child(4) {
    grid-column: 10 / 12;
}

.grid-item:nth-child(5) {
    grid-column: 12 / 15;
}

.grid-item:nth-child(6) {
    grid-column: 15 / 18;
}

.grid-item:nth-child(7) {
    grid-column: 18 / 20;
}

.grid-item:nth-child(8) {
    grid-column: 20 / 23;
}

.grid-item:nth-child(9) {
    grid-column: 23 / 26;
}

.grid-item:nth-child(10) {
    grid-column: 26 / 28;
}

.grid-item:nth-child(11) {
    grid-column: 28 / 31;
}

.grid-item:nth-child(12) {
    grid-column: 31 / 34;
}

.grid-item:nth-child(13) {
    grid-column: 1;
    grid-row: 3 / 10;
}

.grid-item:nth-child(14) {
    grid-column: 1;
    grid-row: 10 / 14;
}

.grid-item:nth-child(15) {
    grid-column: 1 / 4;
}

.grid-item:nth-child(22) {
    grid-column: 10 / 12;
}

.grid-item:nth-child(29) {
    grid-column: 18 / 20;
}

.grid-item:nth-child(36) {
    grid-column: 26 / 28;
}


.grid-item:nth-child(43) {
    grid-column: 2 / 10;
}

.grid-item:nth-child(44) {
    grid-column: 10 / 18;
}

.grid-item:nth-child(45) {
    grid-column: 18 / 26;
}

.grid-item:nth-child(46) {
    grid-column: 26 / 34;
}

.grid-item:nth-child(47) {
    grid-column: 2;
    grid-row: 4;
}

.grid-item:nth-child(48) {
    grid-column: 2;
    grid-row: 5;
}

.grid-item:nth-child(49) {
    grid-column: 2;
    grid-row: 6;
}

.grid-item:nth-child(50) {
    grid-column: 2;
    grid-row: 7;
}

.grid-item:nth-child(51) {
    grid-column: 2;
    grid-row: 8;
}

.grid-item:nth-child(52) {
    grid-column: 2;
    grid-row: 9;
}

.grid-item:nth-child(53) {
    grid-column: 2;
    grid-row: 10;
}

.grid-item:nth-child(54) {
    grid-column: 2;
    grid-row: 11;
}

.grid-item:nth-child(55) {
    grid-column: 2;
    grid-row: 12;
}

.grid-item:nth-child(56) {
    grid-column: 2;
    grid-row: 13;
}

.grid-item:nth-child(57) {
    grid-column: 3 / 10;
}

.grid-item:nth-child(58) {
    grid-column: 10;
    grid-row: 4;
}

.grid-item:nth-child(59) {
    grid-column: 10;
    grid-row: 5;
}

.grid-item:nth-child(60) {
    grid-column: 10;
    grid-row: 6;
}

.grid-item:nth-child(61) {
    grid-column: 10;
    grid-row: 7;
}

.grid-item:nth-child(62) {
    grid-column: 10;
    grid-row: 8;
}

.grid-item:nth-child(63) {
    grid-column: 10;
    grid-row: 9;
}

.grid-item:nth-child(64) {
    grid-column: 10;
    grid-row: 10;
}

.grid-item:nth-child(65) {
    grid-column: 10;
    grid-row: 11;
}

.grid-item:nth-child(66) {
    grid-column: 10;
    grid-row: 12;
}

.grid-item:nth-child(67) {
    grid-column: 10;
    grid-row: 13;
}

.grid-item:nth-child(68) {
    grid-column: 11 / 18;
}

.grid-item:nth-child(69) {
    grid-column: 18;
    grid-row: 4;
}

.grid-item:nth-child(70) {
    grid-column: 18;
    grid-row: 5;
}

.grid-item:nth-child(71) {
    grid-column: 18;
    grid-row: 6;
}

.grid-item:nth-child(72) {
    grid-column: 18;
    grid-row: 7;
}

.grid-item:nth-child(73) {
    grid-column: 18;
    grid-row: 8;
}

.grid-item:nth-child(74) {
    grid-column: 18;
    grid-row: 9;
}

.grid-item:nth-child(75) {
    grid-column: 18;
    grid-row: 10;
}

.grid-item:nth-child(76) {
    grid-column: 18;
    grid-row: 11;
}

.grid-item:nth-child(77) {
    grid-column: 18;
    grid-row: 12;
}

.grid-item:nth-child(78) {
    grid-column: 18;
    grid-row: 13;
}

.grid-item:nth-child(79) {
    grid-column: 19 / 26;
}

.grid-item:nth-child(80) {
    grid-column: 26;
    grid-row: 4;
}

.grid-item:nth-child(81) {
    grid-column: 26;
    grid-row: 5;
}

.grid-item:nth-child(82) {
    grid-column: 26;
    grid-row: 6;
}

.grid-item:nth-child(83) {
    grid-column: 26;
    grid-row: 7;
}

.grid-item:nth-child(84) {
    grid-column: 26;
    grid-row: 8;
}

.grid-item:nth-child(85) {
    grid-column: 26;
    grid-row: 9;
}

.grid-item:nth-child(86) {
    grid-column: 26;
    grid-row: 10;
}

.grid-item:nth-child(87) {
    grid-column: 26;
    grid-row: 11;
}

.grid-item:nth-child(88) {
    grid-column: 26;
    grid-row: 12;
}

.grid-item:nth-child(89) {
    grid-column: 26;
    grid-row: 13;
}

.grid-item:nth-child(90) {
    grid-column: 27 / 34;
}

.grid-item:nth-child(91) {
    grid-row: 5;
    grid-column: 3 / 10;
}

.grid-item:nth-child(92) {
    grid-row: 5;
    grid-column: 11 / 18;
}

.grid-item:nth-child(93) {
    grid-row: 5;
    grid-column: 19 / 26;
}

.grid-item:nth-child(94) {
    grid-row: 5;
    grid-column: 27 / 34;
}

.grid-item:nth-child(95) {
    grid-row: 6;
    grid-column: 3 / 10;
}

.grid-item:nth-child(96) {
    grid-row: 6;
    grid-column: 11 / 18;
}

.grid-item:nth-child(97) {
    grid-row: 6;
    grid-column: 19 / 26;
}

.grid-item:nth-child(98) {
    grid-row: 6;
    grid-column: 27 / 34;
}

.grid-item:nth-child(99) {
    grid-row: 7;
    grid-column: 3 / 10;
}

.grid-item:nth-child(100) {
    grid-row: 7;
    grid-column: 11 / 18;
}

.grid-item:nth-child(101) {
    grid-row: 7;
    grid-column: 19 / 26;
}

.grid-item:nth-child(102) {
    grid-row: 7;
    grid-column: 27 / 34;
}

.grid-item:nth-child(103) {
    grid-row: 8;
    grid-column: 3 / 10;
}

.grid-item:nth-child(104) {
    grid-row: 8;
    grid-column: 11 / 18;
}

.grid-item:nth-child(105) {
    grid-row: 8;
    grid-column: 19 / 26;
}

.grid-item:nth-child(106) {
    grid-row: 8;
    grid-column: 27 / 34;
}

.grid-item:nth-child(107) {
    grid-row: 9;
    grid-column: 3 / 10;
}

.grid-item:nth-child(108) {
    grid-row: 9;
    grid-column: 11 / 18;
}

.grid-item:nth-child(109) {
    grid-row: 9;
    grid-column: 19 / 26;
}

.grid-item:nth-child(110) {
    grid-row: 9;
    grid-column: 27 / 34;
}

.grid-item:nth-child(111) {
    grid-row: 10;
    grid-column: 3 / 10;
}

.grid-item:nth-child(112) {
    grid-row: 10;
    grid-column: 11 / 18;
}

.grid-item:nth-child(113) {
    grid-row: 10;
    grid-column: 19 / 26;
}

.grid-item:nth-child(114) {
    grid-row: 10;
    grid-column: 27 / 34;
}

.grid-item:nth-child(115) {
    grid-row: 11;
    grid-column: 3 / 10;
}

.grid-item:nth-child(116) {
    grid-row: 11;
    grid-column: 11 / 18;
}

.grid-item:nth-child(117) {
    grid-row: 11;
    grid-column: 19 / 26;
}

.grid-item:nth-child(118) {
    grid-row: 11;
    grid-column: 27 / 34;
}

.grid-item:nth-child(119) {
    grid-row: 12;
    grid-column: 3 / 10;
}

.grid-item:nth-child(120) {
    grid-row: 12;
    grid-column: 11 / 18;
}

.grid-item:nth-child(121) {
    grid-row: 12;
    grid-column: 19 / 26;
}

.grid-item:nth-child(122) {
    grid-row: 12;
    grid-column: 27 / 34;
}

.grid-item:nth-child(123) {
    grid-row: 13;
    grid-column: 3 / 10;
}

.grid-item:nth-child(124) {
    grid-row: 13;
    grid-column: 11 / 18;
}

.grid-item:nth-child(125) {
    grid-row: 13;
    grid-column: 19 / 26;
}

.grid-item:nth-child(126) {
    grid-row: 13;
    grid-column: 27 / 34;
}
</style>