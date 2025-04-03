<template>
  <div class="body">
    <main>
      <h1>Ugovori</h1>
      <div class="main-content">
        <section>
          <div>
            <h2>Popis ugovora</h2>
            <p>
              Popis ugovora koje su sklopljeni između pravnih osoba i tvrtke
              'ATD Solucije'. <br />
              <!-- 'KPKR' - Kalkulator procjene klimatskih rizika <br>
              'KESP' - Kalkulator emisija stakleničkih plinova -->
            </p>
          </div>
          <ContractList
            @open-new-contract-dialog="openNewUserContractHandler"
          />
          <NewContractDialog
            :visible="editUserDialog"
            @update:visible="editUserDialog = $event"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import ContractList from "~/components/admin/lists/ContractList.vue";
import NewContractDialog from "~/components/admin/dialogs/NewContractDialog.vue";

const editUserDialog = ref(false);

const openNewUserContractHandler = () => {
  // Open the new contract dialog
  editUserDialog.value = true;
};
</script>

<style scoped>
* {
  color: var(--text-color);
  opacity: 1 !important;
}

.body {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 26px;
  background-color: white !important;
}

h1 {
  width: 100%;
  text-align: left;
  padding-bottom: 7px;
  border-bottom: 2px solid var(--text-color);
}

h2 {
  font-size: 16px;
  color: var(--text-color);
}

main {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto;
  gap: 34px;
  height: 100%;
}

main > div {
  width: 100%;
  height: 100%;
}

.main-content,
section {
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}
</style>
