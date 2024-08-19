<template>
    <div>
        <main>
            <h1>Rizik sažetak</h1>
            <div class="interactive">
                <RizikSazetak ref="rizikSazetakRef" class="rizik-sazetak" />
            </div>
        </main>
        <!-- <Tabs value="0" class="interactive-tabs">
            <TabList class="reset-style">
                <Tab value="0">Rizik sažetak</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="interactive">
                        <int>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs> -->
        <footer>
            <nuxt-link to="/adaptacijske-mjere" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Adaptacijske mjere
            </nuxt-link>
            <div class="actionButtons">
                <span class="action-icon">
                    <font-awesome-icon icon="expand" size="lg" />
                </span>
                <span class="action-icon" @click="downloadRizikSazetak">
                    <font-awesome-icon icon="download" size="lg" />
                </span>
            </div>
            <nuxt-link to="/tablice-rizika" class="footer-link">
                Tablice rizika
                <font-awesome-icon icon="arrow-right-long" />
            </nuxt-link>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Kreiramo referencu za pristup komponenti
const rizikSazetakRef = ref(null);

// Funkcija za generisanje i preuzimanje PDF-a
// const downloadRizikSazetak = () => {
//     const element = document.querySelector('.rizik-sazetak');

//     // Konfigurišite opcije za html2pdf
//     const options = {
//         margin: [10, 10, 10, 10], // Margine [gore, desno, dole, levo]
//         filename: 'RizikSazetak.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: {
//             scale: 2, // Povećana rezolucija za bolju kvalitetu
//             useCORS: true, // Omogućava Cross-Origin Resource Sharing
//         },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
//     };

//     // Generisanje i preuzimanje PDF-a
//     html2pdf().from(element).set(options).save();
// };

// Osigurajte da rizikSazetakRef bude dostupan nakon montaže
onMounted(() => {

});
</script>

<style scoped>
footer {
    margin-top: 26px;
}

.actionButtons {
    display: flex;
    align-items: center;
    gap: 16px;
}

.action-icon:hover {
    color: var(--primary-color);
    cursor: pointer;
}

.reset-style {
    all: revert;
}

.p-tablist-tab-list button {
    width: auto !important;
    color: var(--text-color);

    outline: none;
    border: none;
    border-radius: 0px;
    background-color: var(--white);
    font-size: 16px;
}

.p-tab {
    opacity: 0.7;
    border: none;
}

.p-tab.p-tab-active {
    color: var(--primary-color);
    opacity: 1;
    border-bottom: 3px solid var(--primary-color);
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

.rizik-sazetak {
    width: 100%;
    height: 100%;
}
</style>