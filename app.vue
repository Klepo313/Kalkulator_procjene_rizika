<template>
  <div>
    <NuxtPage />
    <div v-if="showExtendSession" class="extendSession">
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
    </div>
  </div>
</template>

<script setup>
import { refreshToken } from '~/utils/refreshToken';
import { ref } from 'vue';
import { logout } from '~/service/logout';

import { useRoute } from 'vue-router';

const showExtendSession = ref(false); // Postavite na true za prikazivanje bloka
const countdown = ref(120); // 2 minute (120 sekundi)
let intervalId = null; // Globalni interval za praćenje CSRF tokena

// Funkcija za postavljanje kolačića
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Dan u milisekundama
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;SameSite=Strict`;
};

// Funkcija za dohvaćanje kolačića
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Funkcija za formatiranje vremena (prikaz u minutama i sekundama)
const formattedTime = computed(() => {
  const minutes = Math.floor(countdown.value / 60);
  const seconds = countdown.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// Funkcija koja pokreće interval za provjeru CSRF tokena svake sekunde
const startCsrfTokenWatcher = () => {
  intervalId = setInterval(() => {
    const csrfTokenExpiry = getCookie('csrfTokenExpiry');

    if (!csrfTokenExpiry) return;

    // Preostalo vrijeme do isteka CSRF tokena u milisekundama
    const timeLeft = csrfTokenExpiry - new Date().getTime();

    // Ažuriraj odbrojavanje (u sekundama)
    countdown.value = Math.floor(timeLeft / 1000);

    console.log(`Preostalo vrijeme do isteka CSRF tokena: ${countdown.value} sekundi`);

    // Provjeri je li preostalo manje od 2 minute (120 sekundi)
    if (timeLeft <= 2 * 60 * 1000 && timeLeft > 0) {
      showExtendSession.value = true; // Prikaži pop-up
    } else {
      showExtendSession.value = false; // Sakrij pop-up ako je više od 2 minute
    }

    // Ako je preostalo vrijeme isteklo, automatski se odjavi
    if (timeLeft <= 0) {
      clearInterval(intervalId); // Zaustavi interval
      doLogout(); // Automatska odjava
    }
  }, 1000); // Provjeravaj svake sekunde
};

// Praćenje CSRF tokena i prikazivanje pop-upa kada je vrijeme ispod 2 minute
const checkCsrfTokenExpiry = () => {
  const csrfTokenExpiry = getCookie('csrfTokenExpiry');
  if (!csrfTokenExpiry) return;

  const timeLeft = csrfTokenExpiry - new Date().getTime();

  if (timeLeft <= 2 * 60 * 1000) { // Manje od 2 minute
    showExtendSession.value = true; // Prikaži pop-up
    countdown.value = Math.floor(timeLeft / 1000); // Postavi odbrojavanje
    startTimer(); // Pokreni timer
  } else {
    showExtendSession.value = false; // Sakrij pop-up
  }

  if (timeLeft <= 0) {
    doLogout(); // Automatska odjava
  }
};

// Funkcija za pokretanje timera
const startTimer = () => {
  const timerId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timerId); // Prekidaj interval kad countdown dođe do 0
      doLogout(); // Automatska odjava kad istekne vrijeme
    }
  }, 1000);
};

const extendSession = async () => {
  try {
    await refreshToken(); // Pozovi funkciju za osvježavanje tokena
    showExtendSession.value = false; // Sakrij pop-up
    const newCsrfToken = generateCsrfToken(); // Generiraj novi CSRF token
    setCookie('csrfToken', newCsrfToken, 1); // Postavi novi CSRF token u kolačić
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 1 dan
    setCookie('csrfTokenExpiry', expiryTime, 1); // Postavi vrijeme isteka tokena u kolačić
  } catch (error) {
    console.error('Greška pri produljenju sesije', error);
  }
};

const doLogout = async () => {
  await logout();
  navigateTo('/login');
};

// Funkcija za zaustavljanje praćenja CSRF tokena
const stopCsrfTokenWatcher = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  const route = useRoute(); // Dohvati trenutnu rutu

  // Pokreni watcher koji prati promjene rute
  watch(
    () => route.path, // Praćenje promjena u ruti
    (newRoute) => {
      console.log("Provjeravam...");
      if (newRoute !== '/login') {
        // Ako ruta nije '/login', pokreni praćenje CSRF tokena
        // startCsrfTokenWatcher();
      } else {
        // Ako je ruta '/login', zaustavi praćenje CSRF tokena
        // stopCsrfTokenWatcher();
      }
    },
    { immediate: true } // Pokreni watcher odmah prilikom mountanja
  );

  // Praćenje CSRF tokena za promjene
  watch(
    () => getCookie('csrfTokenExpiry'), // Praćenje isteka CSRF tokena
    () => {
      // checkCsrfTokenExpiry(); // Provjeravaj stanje isteka
    }
  );

  // Pokreni inicijalnu provjeru CSRF tokena
  // checkCsrfTokenExpiry();
});

// Gledamo promjenu vidljivosti extendSession bloka
// watch(showExtendSession, (newValue) => {
//   if (newValue) {
//     startTimer(); // Pokreni timer kada se prikaže extendSession blok
//   }
// });

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