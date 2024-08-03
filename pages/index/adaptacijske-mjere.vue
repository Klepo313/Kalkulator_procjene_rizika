<template>
    <div class="body">
        <main>
            <h1>Adaptacijske mjere</h1>

            <!-- <div class="main-grid">
                <div class="grid-item header">1</div>
                <div class="grid-item"></div>
                <div class="grid-item">1</div>
                <div class="grid-item">1</div>
            </div> -->
            <div class="main-content">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Naziv mjere</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="mjeraList.length === 0">
                            <td colspan="2" style="font-style: italic;">
                                <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                                Tablica prazna
                            </td>
                        </tr>
                        <tr v-for="mjera in mjeraList" :key="mjera.id">
                            <td>{{ mjera.name }}</td>
                            <td class="empty-th">
                                <font-awesome-icon icon="minus" class="minus-icon" @click="removeMjera(mjera)"
                                    style="margin-right: 15px;" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="newRow">
                    <Select v-model="selectedMjera" :options="mjere" filter :optionLabel="formatOption"
                        placeholder="Izaberi mjeru" class="select-mjere"></Select>
                    <button class="newMjeraBtn" @click="addMjera">
                        <font-awesome-icon icon="plus" />
                        <span>Dodaj mjeru</span>
                    </button>
                </div>
            </div>

        </main>
        <footer>
            <nuxt-link to="/" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Opći podaci
            </nuxt-link>
            <button class="footer-btn" @click="toRizikSazetak">
                Prikaži rizik
                <font-awesome-icon icon="arrow-right-long" style="margin-left: 10px;" />
            </button>
        </footer>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { navigateTo } from '#app';

const toRizikSazetak = () => {
    navigateTo('/rizik-sazetak');
};

const selectedMjera = ref(null);
const mjere = ref([
    { id: 4234, name: 'Neki neki naziv' },
    { id: 4235, name: 'Neki drugi neki naziv' },
    { id: 4236, name: 'Neki treći neki naziv' },
    { id: 4237, name: 'Neki četvrti neki naziv' },
    { id: 4238, name: 'Neki peti neki naziv' },
    { id: 4239, name: 'Neki šesti neki naziv' },
    { id: 4240, name: 'Neki sedmi neki naziv' },
    { id: 4241, name: 'Neki osmi neki naziv' },
    { id: 4242, name: 'Neki deveti neki naziv' },
    { id: 4243, name: 'Neki deseti neki naziv' },
]);

const mjeraList = ref([]);
const addMjera = () => {
    if (selectedMjera.value && !mjeraList.value.some(mjera => mjera.id === selectedMjera.value.id)) {
        mjeraList.value.push({ ...selectedMjera.value });
        selectedMjera.value = null; // Reset the selectedMjera after adding
    }
};

const removeMjera = (mjera) => {
    mjeraList.value = mjeraList.value.filter(item => item.id !== mjera.id);
};

const formatOption = (option) => {
    return `${option.id} - ${option.name}`;
};

</script>

<style scoped>
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

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
}

/* .main-grid {
    width: 60%;
    display: grid;
    grid-template-columns: 1fr 50px;
    gap: 5px;
} */

.main-content {
    width: 50%;
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.custom-table th,
.custom-table td {
    height: 42.5px;
    padding: 0px 12px;

    color: var(--text-color);
    text-align: left;
    border-bottom: var(--border);
}

.custom-table thead th {
    background-color: var(--input-focus-color);
    font-weight: bold;
}

.empty-th {
    color: var(--red) !important;
    text-align: right !important;
    /* 
    display: flex;
    align-items: center;
    justify-content: flex-end; */
}

.minus-icon {
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
}

.minus-icon:hover {
    background-color: #a32b2b20;
}

th:first-child {
    border-top-left-radius: 5px;
}

th:last-child {
    border-top-right-radius: 5px;
}

.custom-table tbody tr:nth-child(even) {
    background-color: var(--bg-color);
}

.custom-table tbody tr:nth-child(odd) {
    background-color: var(--bg-color);
}

.grid-item {
    outline: auto;
}

.newRow {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.select-mjere {
    width: 100%;
}

.newMjeraBtn {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.newMjeraBtn span {
    text-wrap: nowrap;
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

/* main {
    position: relative;
    width: 100%;
    grid-column: 1;
    grid-row: 2;
}

.custom-table {
    margin-top: 20px;
    width: 100%;
    border-collapse: collapse;
    background-color: #1a1a1a;
    color: white;
}

.custom-table th,
.custom-table td {
    height: 42.5px;
    padding: 0px 12px;
    text-align: left;
}

.custom-table thead th {
    background-color: #333;
    font-weight: 500;
}

.custom-table tbody tr:nth-child(even) {
    background-color: #2a2a2a;
}

.custom-table tbody tr:nth-child(odd) {
    background-color: #1a1a1a;
}

.newRow {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.select-mjere {
    width: 100%;
}

.newMjeraBtn {
    width: 30%;
    height: 44px;
    border-radius: 5px;
} */
</style>