<template>
  <div class="body-index">
    <main>
      <h1>Početna stranica</h1>
      <div class="main-content">
        <section>
          <div>
            <h2>Popis ugovora</h2>
            <p>
              Popis ugovora koje su sklopljeni između pravnih osoba i tvrtke
              'ATD Solucije'. <br />
            </p>
          </div>
          <ContractList />
        </section>
        <section>
          <div>
            <h2>Popis korisnika</h2>
            <p>
              Popis korisnika za pravne osobe koje su zabilježene u sustavu.
            </p>
          </div>
          <UserList />
        </section>
      </div>
    </main>
    <footer />
  </div>
</template>

<script setup>
import UserList from "~/components/admin/lists/UserList.vue";
import ContractList from "~/components/admin/lists/ContractList.vue";
</script>

<style scoped>
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
/* .body-index {
  background: transparent !important;
}

.body-index,
main,
.main-content {
  width: 100%;
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-align: center;
}


button {
  background: none;
  color: var(--text-color);
  border: 2px solid var(--text-color);
  height: auto !important;
  padding: 13px 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button:hover {
  background-color: var(--text-color);
  color: #fff;
}

button .ml-2 {
  transition: transform 0.3s ease;
}

button:hover .ml-2 {
  transform: translateX(5px);
}

button:active .ml-2 {
  transform: translateX(8px);
} */
</style>
