<template>
  <div class="section">
    <div class="section prava">
      <!-- Prikaz loading state-a dok se prava učitavaju -->
      <div v-if="loadingPrava">
        <font-awesome-icon icon="spinner" spin />
        <span style="margin-left: 8px">Učitavanje prava...</span>
      </div>
      <!-- Prikaz prava (checkbox za svako pravo) -->
      <div v-else v-for="p in prava" :key="p.vpr_sif" class="prava-field">
        <div class="prava-field-checkbox">
          <Checkbox
            v-model="selectedPrava"
            :input-id="p.vpr_sif"
            :value="p.vpr_sif"
            @change="onCheckboxChange(p)"
          />
          <label :for="p.vpr_sif" class="prava-field-label">
            <strong>{{ p.vpr_naziv }}</strong>
          </label>
        </div>
        <!-- Ako postoje podprava za odabrano roditeljsko pravo, prikazujemo ih -->
        <div
          v-if="
            selectedPrava.includes(p.vpr_sif) &&
            podPrava[p.vpr_sif] &&
            podPrava[p.vpr_sif].length > 0
          "
          class="podprava"
        >
          <div v-if="loadingPodprava[p.vpr_sif]">
            <font-awesome-icon icon="spinner" spin />
            <span style="margin-left: 8px">Učitavanje podprava...</span>
          </div>
          <div
            v-else-if="podPrava[p.vpr_sif] && podPrava[p.vpr_sif].length > 0"
            class="podprava-container"
          >
            <div
              v-for="sub in podPrava[p.vpr_sif]"
              :key="sub.vpr_sif"
              class="prava-field-checkbox"
            >
              <Checkbox
                v-model="selectedPrava"
                :input-id="sub.vpr_sif"
                :value="sub.vpr_sif"
                @change="onCheckboxChange(sub)"
              />
              <label :for="sub.vpr_sif">{{ sub.vpr_naziv }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { getPravaForUser, savePravaForUser } from "~/service/user/user";
import Checkbox from "primevue/checkbox";
import { useKorisniciStore } from "#build/imports";
// Pretpostavljamo da su font-awesome ikone globalno registrirane

// Props – korisnički podaci (npr. s eko_id)
const props = defineProps({
  user: { type: Object, required: true },
});

const korisniciStore = useKorisniciStore();

// Reactive varijable
const prava = ref([]); // Sva prava dohvaćena sa API-ja
const selectedPrava = ref([]); // Niz s vpr_sif odabranih prava
const loadingPrava = ref(false);
const loadingPodprava = ref({});
const podPrava = ref({});

// Dohvaćanje prava sa API-ja
const loadPrava = async () => {
  loadingPrava.value = true;
  if (props.user && props.user.eko_id) {
    try {
      // Dohvat glavnih prava (tip "APP")
      let fetchedPrava = await getPravaForUser(props.user.eko_id, "APP");
      prava.value = fetchedPrava;

      // Automatski odaberi prava gdje je prk_status === 1
      selectedPrava.value = prava.value
        .filter((p) => p.prk_status === 1)
        .map((p) => p.vpr_sif);

      // Za svako odabrano roditeljsko pravo učitaj podprava, ako ih ima
      for (const p of prava.value) {
        if (selectedPrava.value.includes(p.vpr_sif)) {
          await handleParentSelection(p);
        }
      }
    } catch (error) {
      // console.error("Greška prilikom dohvata prava:", error);
    } finally {
      loadingPrava.value = false;
    }
  }
};

// Funkcija za dohvat podprava (podređenih prava)
const handleParentSelection = async (pravo) => {
  if (selectedPrava.value.includes(pravo.vpr_sif)) {
    loadingPodprava.value = { ...loadingPodprava.value, [pravo.vpr_sif]: true };
    try {
      const subRights = await getPravaForUser(
        props.user.eko_id,
        "FNC",
        pravo.vpr_id
      );
      if (subRights && subRights.message) {
        // Ako API vrati poruku, postavljamo prazan niz
        podPrava.value = { ...podPrava.value, [pravo.vpr_sif]: [] };
      } else {
        podPrava.value = { ...podPrava.value, [pravo.vpr_sif]: subRights };
        // NOVO: Automatski odaberi podprava čiji je prk_status === 1
        subRights.forEach((sub) => {
          if (
            sub.prk_status === 1 &&
            !selectedPrava.value.includes(sub.vpr_sif)
          ) {
            selectedPrava.value.push(sub.vpr_sif);
          }
        });
      }
    } catch (error) {
      // console.error("Greška prilikom dohvata podprava:", error);
    } finally {
      loadingPodprava.value = {
        ...loadingPodprava.value,
        [pravo.vpr_sif]: false,
      };
    }
  } else {
    delete podPrava.value[pravo.vpr_sif];
    if (loadingPodprava.value[pravo.vpr_sif] !== undefined) {
      const { [pravo.vpr_sif]: removed, ...rest } = loadingPodprava.value;
      loadingPodprava.value = rest;
    }
  }
};

// Funkcija koja se poziva pri promjeni checkboxa (odabiru/deselekciji)
const onCheckboxChange = async (pravo) => {
  // Ako je pravo uključeno, status je 1, inače 0
  const status = selectedPrava.value.includes(pravo.vpr_sif) ? 1 : 0;
  const savingData = {
    userId: props.user.eko_id,
    rightTypeId: pravo.vpr_id,
    status: status,
  };
  // console.log("Saving data: ", savingData);
  try {
    const response = await savePravaForUser(savingData);
    if (response.status === 200) {
      // console.log("Right saved:", response.data);
    }
  } catch (error) {
    // console.error("Error saving right:", error);
  }
  // Ako je pravo upravo odabrano, pokušaj dohvatiti podprava
  if (status === 1) {
    await handleParentSelection(pravo);
  } else {
    // Ako je pravo deselectano, izbriši podprava
    delete podPrava.value[pravo.vpr_sif];
  }
};

// Opcionalno: ažuriraj korisnički store s odabranim pravima
watch(selectedPrava, (newValue) => {
  // Filtriraj glavna prava
  const parentRights = prava.value.filter((item) =>
    newValue.includes(item.vpr_sif)
  );
  // Prikupi podprava (ako su nizovi)
  const subRights = Object.values(podPrava.value)
    .flatMap((item) => (Array.isArray(item) ? item : []))
    .filter((item) => newValue.includes(item.vpr_sif));
  korisniciStore.selectedPrava = [...parentRights, ...subRights];
  // console.log("Objekti odabranih prava:", korisniciStore.selectedPrava);
});

// Učitavanje prava pri montiranju
onMounted(() => {
  loadPrava();
});
</script>

<style scoped>
.section.prava {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prava-field,
.prava-field-label,
.prava-field-checkbox {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.prava-field-checkbox {
  position: relative;
  align-items: center;
}

.prava-field {
  flex-direction: column;
  background-color: var(--admin-bg-color);
  border: var(--border);
  padding: 13px;
  border-radius: 5px;
}

.podprava,
.podprava-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.podprava {
  border-left: var(--border);
  padding-left: 25px;
}

.icon {
  cursor: pointer;
}
.icon:hover {
  opacity: 0.8;
}
.icon:active {
  opacity: 1;
}

.field-split,
.field-split > div {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.field-split > div {
  flex-direction: column;
  flex: 1;
}
.label-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
</style>
