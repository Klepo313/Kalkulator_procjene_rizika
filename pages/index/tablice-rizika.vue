<template>
    <div class="body">
        <main>
            <h1>Tablice rizika</h1>
            <Tabs value="0">
                <TabList>
                    <Tab class="reset-style" value="0">
                        <font-awesome-icon icon="table-columns" class="tab-icon" />
                        Tablica rizik bez mjera prilagodbe
                    </Tab>
                    <Tab class="reset-style" value="1">
                        <font-awesome-icon icon="table" class="tab-icon" />
                        Tablica rizik sa mjerama prilagodbe
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <TablicaRizika class="tablica" />
                    </TabPanel>
                    <TabPanel value="1">
                        <TablicaRizika class="tablica" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </main>
        <footer>
            <nuxt-link to="/rizik-sazetak" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Rizik sažetak
            </nuxt-link>
            <div class="actionButtons">
                <span class="action-icon">
                    <font-awesome-icon icon="expand" size="lg" />
                </span>
                <span class="action-icon">
                    <font-awesome-icon icon="download" size="lg" />
                </span>
            </div>
        </footer>
    </div>
</template>

<script setup>

</script>

<style scoped>
.reset-style {
    all: revert;
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

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
}

footer {
    width: 50%;
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
    font-weight: 600;
    cursor: pointer;
}

.p-tab {
    opacity: 0.7;
    border: none;
}

.p-tab.p-tab-active {
    color: var(--primary-color);
    opacity: 1;
}

.tab-icon {
    margin-right: 5px;
}

.tablica {
    width: 100%;
    height: 100%;
}
</style>