<template>
    <div class="body">
        <header>
            <img src="../images/sidebar_logo.svg" alt="logo" />
            <div class="header-buttons">
                <button class="novi-predlozak" @click="toDashboard">
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
                        selectionMode="single" :metaKeySelection="false" paginator @rowSelect="onRowSelect"
                        removableSort :rows="10" dataKey="aiz_id" filterDisplay="row" :loading="loading"
                        :globalFilterFields="['aiz_opis', 'aiz_datum', 'tvz_naziv', 'kcs_sif', 'kop_sif', 'kop_naziv', 'puk_naziv', 'objekt_djel']">
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

                        <Column field="aiz_opis" header="Naziv" sortable style="width: 12.5%">
                            <template #body="slotProps">
                                {{ slotProps.data.aiz_opis || '--' }}
                            </template>
                        </Column>
                        <Column field="aiz_datum" header="Datum" sortable style="width: 12.5%">
                            <template #body="slotProps">
                                {{ formatDateToDMY(slotProps.data.aiz_datum) }}
                            </template>
                        </Column>
                        <Column field="tvz_naziv" header="Vrsta izračuna" sortable style="width: 12.5%"></Column>
                        <Column field="kop_sif" header="Katastarska općina (šifra)" sortable style="width: 12.5%">
                        </Column>
                        <Column field="kop_naziv" header="Katastarska općina (naziv)" sortable style="width: 12.5%">
                        </Column>
                        <Column field="kcs_sif" header="Katastarska čestica" sortable style="width: 12.5%">
                            <template #body="slotProps">
                                {{ slotProps.data.kcs_sif || '--' }}
                            </template>
                        </Column>
                        <Column field="puk_naziv" header="Područni ured" sortable style="width: 12.5%"></Column>
                        <Column field="objekt_djel" header="Objekt/djelatnost" sortable style="width: 12.5%"></Column>

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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { navigateTo, useCookie } from '#app';
import { logout } from '@/service/logout';
import { getCalculations } from '@/service/fetchCalculations';
import { getCalculation } from '@/service/fetchCalculation';
import { formatDateToDMY } from '@/utils/dateFormatter';

const filters = ref({
    global: { value: '', matchMode: 'contains' }
});

const izracuni = ref([]);
const loading = ref(true);

const odabraniIzracun = ref();
const toast = useToast();
const onRowSelect = async (event) => {
    //const data = await getCalculation(odabraniIzracun.value.aiz_id);
    console.log("Uspješno dohvaćen izračun.", odabraniIzracun.value);
    const idIzracuna = useCookie('id_izracuna', {
        maxAge: 60 * 60 * 24 * 7, // Cookie will expire in 7 days
        path: '/', // Cookie available throughout the app
        secure: false, // Only send cookie over HTTPS
        sameSite: 'strict' // Protect against CSRF attacks
    });

    // Set the cookie values
    idIzracuna.value = odabraniIzracun.value.aiz_id;

    console.log('Setting cookies:', {
        idIzracuna: odabraniIzracun.value.aiz_id,
    });

    navigateTo('/');
};

onMounted(async () => {
    // Fetch the calculations data when the component is mounted
    const data = await getCalculations();
    if (data) {
        izracuni.value = data;
    }
    loading.value = false; // Set loading to false once data is loaded
});

const doLogout = async () => {
    await logout();
    navigateTo('/login');
};

const toDashboard = () => {
    navigateTo('/');
};
</script>

<style scoped>
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