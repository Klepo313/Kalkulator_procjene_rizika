<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { setupTokenRefresh } from './utils/refreshToken';

const userActive = ref(false); // Praćenje aktivnosti korisnika
let activityTimeout;

function resetActivityTimer() {
  userActive.value = true;

  // Resetiraj timer ako je korisnik aktivan
  clearTimeout(activityTimeout);

  // Ako nema aktivnosti 5 minuta, postavi userActive na false
  activityTimeout = setTimeout(() => {
    userActive.value = false;
  }, 5 * 60 * 1000); // 5 minuta neaktivnosti
}

onMounted(() => {
  // Dodaj event listenere za praćenje korisničke aktivnosti
  window.addEventListener('mousemove', resetActivityTimer);
  window.addEventListener('keydown', resetActivityTimer);
  window.addEventListener('scroll', resetActivityTimer);

  // Pokreni provjeru i potencijalno osvježavanje sesije
  setupTokenRefresh();
});

onBeforeUnmount(() => {
  // Ukloni event listenere kada se komponenta uništava
  window.removeEventListener('mousemove', resetActivityTimer);
  window.removeEventListener('keydown', resetActivityTimer);
  window.removeEventListener('scroll', resetActivityTimer);

  // Očisti timer
  clearTimeout(activityTimeout);
});

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