<template>
    <div class="body">
        <header>
            <img src="../images/sidebar_logo.svg" alt="logo">
            <div class="header-buttons">
                <button class="novi-predlozak" @click="noviIzracun">
                    <font-awesome-icon icon="plus" class="plus-icon" />
                    Novi predložak
                </button>
                <button class="logout" @click="doLogout">
                    <font-awesome-icon icon="arrow-right-from-bracket" class="logout-icon" />
                    Odjava
                </button>
            </div>
        </header>
        <main>
            <div class="main-content">
                <h1>Prethodni izračuni</h1>
                <div class="table">
                    <DataTable v-model:filters="filters" v-model:selection="odabraniIzracun" :value="izracuni"
                        selection-mode="single" :meta-key-selection="false" paginator :rows="10" stripedRows
                        data-key="aiz_id" filter-display="row" :loading="loading"
                        :global-filter-fields="['aiz_id', 'aiz_opis', 'aiz_datum', 'tvz_naziv', 'kcs_sif', 'kop_sif', 'kop_naziv', 'puk_naziv', 'objekt_djel']"
                        @row-select="onRowSelect">
                        <template #header>
                            <div class="flex justify-end">
                                <IconField>
                                    <InputIcon>
                                        <font-awesome-icon icon="search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value"
                                        placeholder="Pretraži prethodne izračune" class="search-field max" />
                                </IconField>
                            </div>
                        </template>
                        <template #empty> Nisu pronađeni izračuni </template>
                        <template #loading> Učitavanje prethodnih izračuna. Molimo pričekajte. </template>

                        <Column field="aiz_id" header="Broj" sortable style="width: 5%">
                            <template #body="slotProps">
                                {{ slotProps.data.aiz_id || '--' }}
                            </template>
                        </Column>
                        <Column field="aiz_opis" header="Naziv" sortable style="width: 10%">
                            <template #body="slotProps">
                                {{ slotProps.data.aiz_opis || '--' }}
                            </template>
                        </Column>
                        <Column field="aiz_datum" header="Datum" sortable style="width: 6%">
                            <template #body="slotProps">
                                {{ formatDateToDMY(slotProps.data.aiz_datum, '.') }}
                            </template>
                        </Column>
                        <Column field="tvz_naziv" header="Vrsta izračuna" sortable style="width: 6%" />
                        <Column field="kop_sif" header="Katastarska općina (šifra)" sortable style="width: 6%" />
                        <Column field="kop_naziv" header="Katastarska općina (naziv)" sortable style="width: 8%" />
                        <Column field="kcs_sif" header="Katastarska čestica" sortable style="width: 6%">
                            <template #body="slotProps">
                                {{ slotProps.data.kcs_sif || '--' }}
                            </template>
                        </Column>
                        <Column field="puk_naziv" header="Područni ured" sortable style="width: 6%" />
                        <Column field="objekt_djel" header="Objekt/djelatnost" sortable style="width: 20%" />

                    </DataTable>
                </div>
            </div>
            <footer>
                <nuxt-link to="/login" class="footer-link">
                    <font-awesome-icon icon="arrow-left-long" />
                    Prijava
                </nuxt-link>
            </footer>
        </main>
        <!-- <div class="pop-up">
            <div class="pop-up-content">
                
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { navigateTo, useCookie } from '#app';
import { logout } from '@/service/logout';
import { getCalculations } from '@/service/fetchCalculations';
import { formatDateToDMY } from '@/utils/dateFormatter';

definePageMeta({
    middleware: 'auth',
});

const filters = ref({
    global: { value: '', matchMode: 'contains' }
});

const izracuni = ref([]);
const loading = ref(true);

const odabraniIzracun = ref();

const idIzracuna = useCookie('id_izracuna');
//idIzracuna.value = '/';

const vrstaIzracuna = useCookie('vrsta_izracuna');
vrstaIzracuna.value = null;

const onRowSelect = async () => {
    //const data = await getCalculation(odabraniIzracun.value.aiz_id);
    console.log("Uspješno dohvaćen izračun.", odabraniIzracun.value);

    // Set the cookie values
    idIzracuna.value = odabraniIzracun.value.aiz_id;
    navigateTo('/');
};

onMounted(async () => {
    // Fetch the calculations data when the component is mounted

    idIzracuna.value = '/';
    const data = await getCalculations();
    console.log("izracuni: ", data)
    if (data) {
        if (data.message) {
            izracuni.value = [];
        } else {
            izracuni.value = data;
        }
    }
    loading.value = false; // Set loading to false once data is loaded
});

const doLogout = async () => {
    await logout();
    navigateTo('/login');
};

const noviIzracun = () => {
    idIzracuna.value = '/';
    navigateTo('/');
};
</script>

<style scoped>
.pop-up {
    /* display: none; */
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

    background-color: white;
    border: var(--border);
    border-radius: 5px;
    padding: 26px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.p-paginator .p-paginator-content button {
    outline: auto !important;
    width: auto !important;
}

.ukloni-btn,
.dodaj-btn,
.p-datatable-filter-apply-button {
    width: auto !important;
    padding: 0px 10px;
}

.dodaj-btn {
    border: none;
}

.table-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.clear-filter-btn {
    width: auto;
    color: var(--text-color);
    border: var(--border);
}

.clear-filter-btn:hover {
    color: white !important;
    background-color: var(--text-color) !important;
    border: var(--border) !important;
}

.search-field {
    width: auto;
    background: none !important;
}

.max {
    width: 100% !important;
}

.body {
    display: flex;
    flex-direction: column;
    gap: 26px;
    width: 100%;
    min-height: 100vh;
    padding: 26px;
}

header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

footer {
    justify-content: flex-start;
}

button {
    text-wrap: nowrap;
}

h1 {
    font-size: 20px;
    padding-bottom: 7px;
    border-bottom: 2px solid var(--text-color);
}

.header-buttons {
    display: flex;
    gap: 35px;
}

.logout {
    background: none;
    border: none;
    color: var(--red);
    font-weight: 600;
}

.logout:hover {
    background-color: rgb(227, 227, 227);
}

.logout:active {
    background-color: rgb(227, 227, 227);
}

.logout-icon,
.plus-icon {
    margin-right: 10px;
}

main {
    width: 100%;
    min-height: 100%;

    background-color: var(--bg-layout-color);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    overflow: visible;
    padding: 34px;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
}

.main-content {
    width: 100%;
    height: 100%;
}

.table {
    padding-top: 20px;
}
</style>