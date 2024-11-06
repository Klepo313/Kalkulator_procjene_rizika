<template>
  <div>
    <!-- <LoadingLayout v-if="loading" /> -->
    <NuxtLoadingIndicator />
    <NuxtPage />

    <!-- <div v-if="showExtendSession" class="extendSession">
      <div class="expand-content">
        <h2>Sesija ističe za {{ formattedTime }} minuta </h2>
        <p>Da bi ste nastavljali koristiti aplikaciju, morate produžiti sesiju.
          Ukoliko vrijeme istekne, bit ćete automatski odjavljeni.
        </p>
        <div class="buttons">
          <button class="odjava" @click="doLogout">Odjavi se</button>
          <button class="produzi" @click="extendSession">Produži sesiju</button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>


// import { useUserStore, useIzracunStore } from '~/stores/main-store';
// const userStore = useUserStore();
// const izracunStore = useIzracunStore();

// onMounted(async () => {

//   await userStore.initializeUser()
//   console.log("Inicijalizacija storea: ", {
//     name: userStore.name,
//     surname: userStore.surname,
//     username: userStore.username,
//     email: userStore.email
//   });

// })


const title = ref('Kalkulator procjene rizika')
const description = ref('Kalkulator procjene rizika')

useHead({
  title,
  meta: [{
    name: 'description',
    content: description
  }]
})

</script>

<style scoped>
h2 {
  font-size: 1.3rem;
  border-bottom: var(--border);
}

p {
  font-size: 16px
}

.extendSession {
  z-index: 99;
  position: fixed;
  overflow: hidden;

  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  padding: 13px;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
}

.expand-content {
  width: 100%;
  max-width: 500px;
  max-height: calc(100dvh - 26px - 39px);
  padding: 26px 39px;
  overflow-y: auto;

  background-color: white;
  border-radius: 5px;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.odjava {
  background: none;
  color: var(--text-color);
  padding: 0;
  width: auto;
  height: auto;
}

.odjava:hover {
  text-decoration: underline;
}
</style>