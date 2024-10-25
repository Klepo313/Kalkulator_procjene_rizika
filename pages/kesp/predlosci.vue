<template>
    <div class="body">
        <header>
            <img src="../../public/static/images/KESP_logo_sidebar.svg" style="height: 100%; cursor: pointer;"
                alt="logo" @click="navigateTo('/kpkr')">
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
                        selection-mode="single" :meta-key-selection="false" paginator :rows="10" striped-rows
                        data-key="uiz_id" filter-display="row" :loading="loading" removable-sort
                        :global-filter-fields="['uiz_id', 'uiz_opis', 'uiz_datum', 'uiz_datod', 'uiz_datdo', 'uiz_godina', 'uiz_razdoblje']"
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

                        <Column field="uiz_id" header="Broj" sortable style="width: 100px;">
                            <template #body="slotProps">
                                {{ slotProps.data.uiz_id || '--' }}
                            </template>
                        </Column>
                        <Column field="uiz_opis" header="Naziv" sortable style="width: auto;">
                            <template #body="slotProps">
                                {{ slotProps.data.uiz_opis || '--' }}
                            </template>
                        </Column>
                        <Column field="uiz_datum" header="Datum" sortable>
                            <template #body="slotProps">
                                {{ formatDateToDMY(slotProps.data.uiz_datum, '.') }}
                            </template>
                        </Column>
                        <Column field="uiz_godina" header="Godina" sortable>
                            <template #body="slotProps">
                                {{ getYearsRange(slotProps.data.uiz_datod, slotProps.data.uiz_datdo) }}
                            </template>
                        </Column>

                        <Column field="uiz_razdoblje" header="Vremensko razdoblje" sortable>
                            <template #body="slotProps">
                                {{ formatDateToDMY(slotProps.data.uiz_datod, '.') + ' - ' +
                                    formatDateToDMY(slotProps.data.uiz_datdo, '.') }}
                            </template>
                        </Column>

                    </DataTable>
                </div>
            </div>
            <footer>
                <nuxt-link to="/" class="footer-link">
                    <font-awesome-icon icon="arrow-left-long" />
                    Početna stranica
                </nuxt-link>
            </footer>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';
import { logout } from '@/service/logout';
import { getKespCalculations } from '~/service/kesp/fetchKespCalculations';
import { formatDateToDMY, getYearsRange } from '@/utils/dateFormatter';
import { setCookie, deleteCookie } from '~/utils/cookieUtils';

definePageMeta({
    middleware: 'auth',
});

const filters = ref({
    global: { value: '', matchMode: 'contains' }
});

const izracuni = ref([]);
const loading = ref(true);

const odabraniIzracun = ref();

const cookiesToDelete = [
    'kesp-id',
];

const onRowSelect = async () => {
    console.log("Uspješno dohvaćen izračun.", odabraniIzracun.value);
    await setCookie({ name: 'kesp-id', value: odabraniIzracun.value.uiz_id });
    navigateTo('/kesp/predlozak');
};

onMounted(async () => {

    deleteCookie(cookiesToDelete);

    const data = await getKespCalculations();
    if (data) {
        if (data.message) {
            izracuni.value = [];
        } else {
            izracuni.value = data;
        }
    }
    console.log(izracuni.value)
    loading.value = false;
});

const doLogout = async () => {
    await logout();
    navigateTo('/login');
};

const noviIzracun = async () => {
    // await setCookie({ name: 'kesp-id', value: odabraniIzracun.value.uiz_id });
    navigateTo('/kesp/predlozak');
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
    background-color: var(--kesp-primary);
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

.footer-link:hover {
    transform: translateX(-3px);
}
</style>