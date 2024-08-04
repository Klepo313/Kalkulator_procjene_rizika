<template>
    <div class="body">
        <header>
            <img src="../images/sidebar_logo.svg" alt="logo">
            <div class="header-buttons">
                <button class="novi-predlozak" @click="toDashboard">
                    <font-awesome-icon icon="plus" class="plus-icon" />
                    Novi predložak
                </button>
                <button class="logout">
                    <font-awesome-icon icon="arrow-right-from-bracket" class="logout-icon" />
                    Odjava
                </button>
            </div>
        </header>
        <main>
            <div class="main-content">
                <h1>Prethodni predlošci</h1>
                <div class="table">
                    <DataTable v-model:filters="filters" :value="customers" paginator showGridlines :rows="10"
                        dataKey="id" filterDisplay="menu" :loading="loading"
                        :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']">
                        <template #header>
                            <div class="flex justify-between">
                                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                    @click="clearFilter()" />
                                <IconField>
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                </IconField>
                            </div>
                        </template>
                        <template #empty> No customers found. </template>
                        <template #loading> Loading customers data. Please wait. </template>
                        <Column field="name" header="Name" style="min-width: 12rem">
                            <template #body="{ data }">
                                {{ data.name }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                            </template>
                        </Column>
                        <Column header="Country" filterField="country.name" style="min-width: 12rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <img alt="flag"
                                        src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                                        :class="`flag flag-${data.country.code}`" style="width: 24px" />
                                    <span>{{ data.country.name }}</span>
                                </div>
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                            </template>
                            <template #filterclear="{ filterCallback }">
                                <Button type="button" icon="pi pi-times" @click="filterCallback()"
                                    severity="secondary"></Button>
                            </template>
                            <template #filterapply="{ filterCallback }">
                                <Button type="button" icon="pi pi-check" @click="filterCallback()"
                                    severity="success"></Button>
                            </template>
                            <template #filterfooter>
                                <div class="px-4 pt-0 pb-4 text-center">Customized Buttons</div>
                            </template>
                        </Column>
                        <Column header="Agent" filterField="representative" :showFilterMatchModes="false"
                            :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <img :alt="data.representative.name"
                                        :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`"
                                        style="width: 32px" />
                                    <span>{{ data.representative.name }}</span>
                                </div>
                            </template>
                            <template #filter="{ filterModel }">
                                <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name"
                                    placeholder="Any">
                                    <template #option="slotProps">
                                        <div class="flex items-center gap-2">
                                            <img :alt="slotProps.option.name"
                                                :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`"
                                                style="width: 32px" />
                                            <span>{{ slotProps.option.name }}</span>
                                        </div>
                                    </template>
                                </MultiSelect>
                            </template>
                        </Column>
                        <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                            <template #body="{ data }">
                                {{ formatDate(data.date) }}
                            </template>
                            <template #filter="{ filterModel }">
                                <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy"
                                    placeholder="mm/dd/yyyy" />
                            </template>
                        </Column>
                        <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                            <template #body="{ data }">
                                {{ formatCurrency(data.balance) }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputNumber v-model="filterModel.value" mode="currency" currency="USD"
                                    locale="en-US" />
                            </template>
                        </Column>
                        <Column header="Status" field="status" :filterMenuStyle="{ width: '14rem' }"
                            style="min-width: 12rem">
                            <template #body="{ data }">
                                <Tag :value="data.status" :severity="getSeverity(data.status)" />
                            </template>
                            <template #filter="{ filterModel }">
                                <Select v-model="filterModel.value" :options="statuses" placeholder="Select One"
                                    showClear>
                                    <template #option="slotProps">
                                        <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                                    </template>
                                </Select>
                            </template>
                        </Column>
                        <Column field="activity" header="Activity" :showFilterMatchModes="false"
                            style="min-width: 12rem">
                            <template #body="{ data }">
                                <ProgressBar :value="data.activity" :showValue="false" style="height: 6px">
                                </ProgressBar>
                            </template>
                            <template #filter="{ filterModel }">
                                <Slider v-model="filterModel.value" range class="m-4"></Slider>
                                <div class="flex items-center justify-between px-2">
                                    <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                    <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center"
                            style="min-width: 8rem">
                            <template #body="{ data }">
                                <i class="pi"
                                    :class="{ 'pi-check-circle text-green-500 ': data.verified, 'pi-times-circle text-red-500': !data.verified }"></i>
                            </template>
                            <template #filter="{ filterModel }">
                                <label for="verified-filter" class="font-bold"> Verified </label>
                                <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary
                                    inputId="verified-filter" />
                            </template>
                        </Column>
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
import { CustomerService } from '@/service/CustomerService';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { navigateTo } from '#app';

const customers = ref();
const filters = ref();
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const loading = ref(true);

onMounted(() => {
    CustomerService.getCustomersMedium().then((data) => {
        customers.value = getCustomers(data);
        loading.value = false;
    });
});


const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

initFilters();

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const clearFilter = () => {
    initFilters();
};
const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
        d.date = new Date(d.date);

        return d;
    });
};
const getSeverity = (status) => {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
};

const toDashboard = () => {
    navigateTo('/');
};

</script>

<style scoped>
.body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    height: 100%;

    background-color: var(--bg-layout-color);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    overflow: visible;
    padding: 34px;

    display: flex;
    flex-direction: column;
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