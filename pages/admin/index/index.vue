<template>
    <div class="body-index">
        <main>
            <!-- <h1>{{ 'Početna stranica' }}</h1>
            <Toast /> -->
            <div class="main-content">
                <section>
                    <font-awesome-icon icon="info-circle" />
                    Još nema sadržaja na početnoj stranici
                    <button type="button"  @click="navigateTo('/admin/korisnici')">
                        Dodavanje korisnika
                        <font-awesome-icon icon="arrow-right" class="ml-2" />
                    </button>
                </section>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>

</script>

<style scoped>
.body-index {
    background: transparent !important;
}

.body-index, main, .main-content {
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

section, section * {
    font-size: 1.4rem;
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
  /* Popunjava se pozadina */
  background-color: var(--text-color);
  /* Mijenjamo boju teksta, npr. na bijelu */
  color: #fff;
}

/* Postavljamo glatku animaciju transformacije za font-awesome-icon */
button .ml-2 {
  transition: transform 0.3s ease;
}

button:hover .ml-2 {
  /* Na hover, strelica se pomiče 3px udesno */
  transform: translateX(5px);
}

button:active .ml-2 {
  /* Na active, strelica se pomiče 4px udesno */
  transform: translateX(8px);
}

</style>