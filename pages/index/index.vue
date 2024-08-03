<template>
    <div class="body">
        <main>
            <h1>Opći podaci</h1>
            <div class="main-grid">
                <div class="grid-item header">Datum</div>
                <div class="grid-item">
                    <DatePicker v-model="icondisplay" showIcon fluid iconDisplay="input" inputId="icondisplay"
                        dateFormat="dd.mm.yy" class="form-input" placeholder="Odaberi datum" />
                </div>

                <div class="grid-item header">Vrsta izračuna</div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaIzracuna" :options="vrsteIzracuna" optionLabel="name"
                        placeholder="Odaberi vrstu izračuna" class="form-input">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="grid-item header">Katastarska općina</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaKatastarskaOpcina" :suggestions="filtriraneKatastarskeOpcine"
                        @complete="searchKatastarskeOpcine" placeholder="Unesi katastarsku općinu"
                        :virtualScrollerOptions="{ itemSize: 38 }" optionLabel="name" class="form-input" />
                </div>

                <div class="grid-item header">Katastarska čestica</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaKatastarskaCestica" :suggestions="filtriraneKatastarskeCestice"
                        @complete="searchKatastarskeCestice" placeholder="Unesi katastarsku česticu"
                        :virtualScrollerOptions="{ itemSize: 38 }" optionLabel="name" class="form-input" />
                </div>

                <div class="grid-item header">Vrsta objekta</div>
                <div class="grid-item">
                    <Select v-model="odabranaVrstaObjekta" :options="vrsteObjekta" optionLabel="name"
                        placeholder="Odaberi vrstu objekta" class="form-input">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="grid-item header">Djelatnost</div>
                <div class="grid-item">
                    <AutoComplete v-model="odabranaDjelatnost" :suggestions="filtriraneDjelatnosti"
                        @complete="searchDjelatnosti" placeholder="Unesi djelatnost"
                        :virtualScrollerOptions="{ itemSize: 38 }" :optionLabel="formatOption" class="form-input">
                    </AutoComplete>
                </div>

                <div class="grid-item header">Skupina djelatnosti</div>
                <div class="grid-item">
                    <!-- <AutoComplete v-model="odabranaSkupinaDjelatnosti" :suggestions="filtriraneSkupineDjelatnosti"
                        @complete="searchSkupineDjelatnosti" placeholder="Unesi djelatnost"
                        :virtualScrollerOptions="{ itemSize: 38 }" :optionLabel="formatOption" class="form-input">
                    </AutoComplete> -->
                    <input class="dataInput" type="text" disabled
                        placeholder="Popuni podatke na formi za prikaz skupine djelatnosti">
                </div>

                <div class="grid-item header">Ispostava</div>
                <div class="grid-item">
                    <input class="dataInput" type="text" disabled
                        placeholder="Popuni podatke na formi za prikaz ispostave">
                </div>

                <div class="grid-item header">Područni ured</div>
                <div class="grid-item">
                    <input class="dataInput" type="text" disabled
                        placeholder="Popuni podatke na formi za prikaz područnog ureda">
                </div>
            </div>
            <span class="map-link" @click="openMapPopUp">
                <font-awesome-icon icon="arrow-up-right-from-square"></font-awesome-icon>
                <span>
                    Otvori katastarsku mapu i odaberi česticu
                </span>
            </span>
        </main>
        <footer>
            <nuxt-link to="/adaptacijske-mjere" class="footer-link">
                Adaptacijske mjere
                <font-awesome-icon icon="arrow-right-long" />
            </nuxt-link>
        </footer>
        <div class="pop-up">
            <div class="pop-up-content">

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"

const icondisplay = ref();

const odabranaVrstaIzracuna = ref();
const odabranaKatastarskaOpcina = ref();
const odabranaKatastarskaCestica = ref();
const odabranaVrstaObjekta = ref();
const odabranaDjelatnost = ref();
const odabranaSkupinaDjelatnosti = ref();

const filtriraneKatastarskeOpcine = ref();
const filtriraneKatastarskeCestice = ref();
const filtriraneVrsteObjekta = ref();
const filtriraneDjelatnosti = ref();
const filtriraneSkupineDjelatnosti = ref();

const vrsteIzracuna = ref([
    { name: "Proces" },
    { name: "Imovina" }
]);
const katastarskeOpcine = ref([
    { name: "Šišljavić" },
    { name: "Mladićić" },
    { name: "Kaštela" }
]);
const katastarskeCestice = ref([
    { name: "337/12" },
    { name: "337/14" },
    { name: "327/13" },
    { name: "347/15" },
])
const vrsteObjekta = ref([
    { name: "Zgrada" },
    { name: "Poljoprivredno zemljište" },
    { name: "Ostalo" },
])
const djelatnosti = ref([
    { id: "01.11.", name: "Uzgoj žitarica (osim riže), mahunarki i uljanog sjemena" },
    { id: "02.15.", name: "Uzgoj ribe" },
])
const skupineDjelatnosti = ref([
    { id: "1.11.", name: "Uzgoj jednogodišnjih usjeva" },
    { id: "2.22.", name: "Uzgoj dvogodišnjih usjeva" },
])

const searchKatastarskeOpcine = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let query = event.query;
    let _filteredItems = [];

    for (let i = 0; i < katastarskeOpcine.value.length; i++) {
        let item = katastarskeOpcine.value[i];

        if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
            _filteredItems.push(item);
        }
    }

    filtriraneKatastarskeOpcine.value = _filteredItems;
};

const searchKatastarskeCestice = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let query = event.query;
    let _filteredItems = [];

    for (let i = 0; i < katastarskeCestice.value.length; i++) {
        let item = katastarskeCestice.value[i];

        if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
            _filteredItems.push(item);
        }
    }

    filtriraneKatastarskeCestice.value = _filteredItems;
};

const formatOption = (option) => {
    return `${option.id} - ${option.name}`;
};

const searchDjelatnosti = (event) => {
    // Normalizacija upita za pretragu
    let query = event.query.toLowerCase();
    let _filteredItems = djelatnosti.value.filter((item) =>
        item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
    );
    filtriraneDjelatnosti.value = _filteredItems;
};

const searchSkupineDjelatnosti = (event) => {
    // Normalizacija upita za pretragu
    let query = event.query.toLowerCase();
    let _filteredItems = skupineDjelatnosti.value.filter((item) =>
        item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
    );
    filtriraneSkupineDjelatnosti.value = _filteredItems;
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
    justify-content: flex-end;
}
</style>