<template>
  <div>
    <div class="body">
      <header>
        <div class="image-container">
          <img
            src="../public/static/images/atd_solucije_iz.png"
            alt="logo"
            class="header-image"
            @click="navigateTo('/')"
          />
        </div>
        <button
          v-if="$route.path !== '/login'"
          class="logout"
          @click="doLogout"
        >
          <font-awesome-icon
            icon="arrow-right-from-bracket"
            class="logout-icon"
          />
          Odjava
        </button>
      </header>

      <main>
        <div class="main-container">
          <div class="card-container">
            <div v-if="loading">
              <font-awesome-icon icon="spinner" spin />
              <span> Učitavanje podataka </span>
            </div>
            <div
              v-for="(card, index) in filteredCards"
              v-else-if="roles.length"
              :key="index"
              class="card"
            >
              <div class="image-container">
                <font-awesome-icon v-if="!card.isLoaded" icon="spinner" spin />
                <img v-else :src="card.miniLogo" alt="logo" />
              </div>
              <div class="card-content">
                <font-awesome-icon v-if="!card.isLoaded" icon="spinner" spin />
                <img v-else :src="card.textLogo" alt="logo" />
                <div class="btn">
                  <button
                    :class="card.buttonClass"
                    @mouseover="card.showTooltip = true"
                    @mouseleave="card.showTooltip = false"
                    @click="handleButtonClick(card)"
                    :disabled="card.clicked"
                  >
                    <template v-if="card.clicked">
                      <font-awesome-icon icon="spinner" spin />
                    </template>
                    <template v-else>
                      Nastavi
                      <font-awesome-icon icon="arrow-right" />
                    </template>
                  </button>

                  <div
                    v-if="card.tooltip.status === 1 && card.showTooltip"
                    class="tooltip"
                  >
                    {{ card.tooltip.text }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else style="text-align: center">
              <h2 class="no-results-header">
                Nemate definirana korisnička prava na korištenje nekih od
                aplikacija
              </h2>
              <p class="no-results">
                Javite se Vašem administratoru aplikacije
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterText class="footer-text" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { logout } from "~/service/user/user";
import { useUserStore } from "~/stores/main-store";
import FooterText from "~/components/ostalo/FooterText.vue";

definePageMeta({
  pageTransition: { name: "slide", mode: "out-in" },
});

const userStore = useUserStore();
const authStore = useAuthStore();

const roles = ref([null]);
const res = ref(null);
const loading = ref(true);

async function fetchImageAsBlob(imageId) {
  const response = await fetch(`/static/images/${imageId}.svg`); // Dohvati sliku pomoću API poziva
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

const cards = ref([
  {
    role: "AP001",
    miniLogoId: "kpkr_logo_mini", // ID slike u bazi
    textLogoId: "kpkr_logo_text",
    miniLogo: "",
    textLogo: "",
    clicked: false,
    buttonClass: "kpkrBtn",
    navigation: "/kpkr",
    isLoaded: false,
    showTooltip: false,
    tooltip: {
      text: "Kalkulator procjene klimatskih rizika još nije u funkciji.",
      status: 0,
    },
    styles: {
      primary: "#14521C",
      hover: "#176221",
      focus: "#1a7225",
    },
  },
  {
    role: "AP002",
    miniLogoId: "kesp_logo_mini",
    textLogoId: "kesp_logo_text",
    miniLogo: "",
    textLogo: "",
    clicked: false,
    buttonClass: "kespBtn",
    navigation: "/kesp",
    isLoaded: false,
    showTooltip: false,
    tooltip: {
      text: "Kalkulator emisije stakleničkih plinova još nije u funkciji.",
      status: 0,
    },
    styles: {
      primary: "#5F5727",
      hover: "#807434",
      focus: "#8d813b",
    },
  },
  {
    role: "AD%",
    miniLogoId: "admin_logo_mini",
    textLogoId: "admin_logo_text",
    miniLogo: "",
    textLogo: "",
    clicked: false,
    buttonClass: "adminBtn",
    navigation: "/admin",
    isLoaded: false,
    showTooltip: false,
    tooltip: {
      text: "Administratorska prava",
      status: 0,
    },
    styles: {
      primary: "#1e1e1e",
      hover: "#2a2a2a",
      focus: "#3a3a3a",
    },
  },
]);

const filteredCards = computed(() => {
  if (roles.value.message) {
    return [];
  }
  return cards.value.filter((card) => {
    if (card.role === "AD%") {
      // Provjera postoji li u roles.value neka rola koja počinje s 'AD'
      return roles.value.some((role) => role.startsWith("AD"));
    }
    return roles.value.includes(card.role);
  });
});

const handleButtonClick = (card) => {
  if (card.clicked) return;
  card.clicked = true;
  navigateTo(card.navigation);
};

onMounted(async () => {
  res.value = await userStore.getAll;
  roles.value = res.value.roles || { message: "Nemate dopuštenih prava." };
  for (const card of cards.value) {
    card.miniLogo = await fetchImageAsBlob(card.miniLogoId);
    card.textLogo = await fetchImageAsBlob(card.textLogoId);
    card.isLoaded = true;
  }
  loading.value = false;
});

const doLogout = async () => {
  await logout();
  navigateTo("/login");
};
</script>

<style scoped>
.footer-text {
  position: absolute;
  bottom: 20px;
}

.body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100dvh;
  background-color: var(--admin-bg-color);
}

header {
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px;
}

header .image-container {
  height: 37px;
}

main {
  width: 100%;
  height: 80%;
  padding: 26px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  gap: 60px;

  transition: flex-direction 0.5s ease;
}

.no-results-header {
  font-size: 2rem;
}

.no-results {
  font-size: 1.5rem;
}

.image-container,
.main-container,
.card-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: auto;
  padding-left: 0px;
}

.image-container img {
  width: 100%;
}

.header-image {
  height: 100%;
  /* Postavi visinu slike prema visini containera */
  width: auto;
  /* Zadrži omjer slike */
  object-fit: contain;
  /* Zadrži cijelu sliku unutar containera */
  cursor: pointer;
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.btn {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.btn button {
  width: 100%;
}

.kespBtn {
  background-color: var(--kesp-primary);
}

.kespBtn:hover {
  background-color: var(--kesp-primary-hover);
}

.kespBtn:active {
  background-color: var(--kesp-primary-focus);
}

.adminBtn {
  background-color: var(--text-color);
}

.adminBtn:hover {
  background-color: var(--text-color-hover);
}

.adminBtn:active {
  background-color: var(--text-color-focus);
}

.card {
  padding: 20px;
  width: 100%;
  max-width: 300px;
  height: 300px;
  /* aspect-ratio: 1/1; */

  font-size: 16px;
  font-weight: bold;

  background-color: var(--white-color);
  border: 1px solid rgb(20, 82, 28, 0.2);
  border-radius: var(--border-form-radius);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
}

.card1 {
  align-items: center;
  justify-content: center;
}

.tooltip {
  position: absolute;
  top: -40px;
  /* Pozicioniraj iznad gumba */
  left: 50%;
  transform: translateX(-50%);

  border: var(--border);
  border-radius: 5px;
  background-color: var(--text-color);
  color: white;

  padding: 5px 10px;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;

  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.btn:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

/* .card>.image-container {
    width: 70%;
} */

.main-container,
.card-container {
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
}

.logout {
  /* position: absolute;
    top: 26px;
    right: 26px; */

  background: none;
  border: none;
  color: var(--red);
  font-weight: 600;
  width: auto;
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
</style>
