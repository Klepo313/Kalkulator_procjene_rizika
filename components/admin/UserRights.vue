<template>
  <div class="section">
    <div class="section prava">
      <div v-if="loadingPrava">
        <font-awesome-icon icon="spinner" spin />
        <span style="margin-left: 8px">Učitavanje prava...</span>
      </div>
      <div v-else v-for="p in prava" :key="p.vpr_sif" class="prava-field">
        <div class="prava-field-checkbox">
          <Checkbox
            v-model="selectedPrava"
            :input-id="p.vpr_sif"
            :value="p.vpr_sif"
            @change="handleParentSelection(p)"
          />
          <label :for="p.vpr_sif" class="prava-field-label">
            <strong>{{ p.vpr_naziv }}</strong>
          </label>
          <span
            v-if="selectedPrava.includes(p.vpr_sif)"
            class="popover-trigger"
            @click="openPopover($event, p)"
          >
            <font-awesome-icon icon="calendar-plus" class="icon" />
          </span>
        </div>

        <!-- Podprava (samo ako je roditeljsko pravo odabrano) -->
        <div v-if="selectedPrava.includes(p.vpr_sif)" class="podprava">
          <!-- Loading za ovo roditeljsko pravo -->
          <div v-if="loadingPodprava[p.vpr_sif]">
            <font-awesome-icon icon="spinner" spin />
            <span style="margin-left: 8px">Učitavanje podprava...</span>
          </div>

          <!-- Ako API vrati message, prikaz poruke -->
          <!-- <div v-else-if="podPrava[p.vpr_sif] && podPrava[p.vpr_sif].message">
            <span style="opacity: 0.7; font-style: italic">
              {{ podPrava[p.vpr_sif].message }}
            </span>
          </div> -->

          <!-- Ako postoje podprava, prikaz checkboxova -->
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
              />
              <label :for="sub.vpr_sif">{{ sub.vpr_naziv }}</label>
            </div>
          </div>

          <!-- Ako nema ni podprava ni poruke -->
          <div v-else>
            <span>Nema podprava.</span>
          </div>
        </div>
      </div>
    </div>
    <Popover ref="popover" v-on:hide="onPopOverHide">
      <div class="field-split">
        <div>
          <div class="label-container">
            <font-awesome-icon icon="calendar-plus" />
            <label for="datod">Vrijedi od</label>
          </div>
          <DatePicker
            id="datod"
            name="eko_datod_"
            v-model="selectedPravo.eko_datod"
            icon-display="input"
            input-id="eko_datod"
            show-icon
            date-format="dd.mm.yy"
            placeholder="Vrijedi od"
            required
          />
        </div>
        <div>
          <div class="label-container">
            <font-awesome-icon icon="calendar-plus" />
            <label for="datdo">Vrijedi do</label>
          </div>
          <DatePicker
            id="datdo"
            name="eko_datdo_"
            v-model="selectedPravo.eko_datdo"
            icon-display="input"
            show-icon
            input-id="eko_datdo"
            date-format="dd.mm.yy"
            placeholder="Vrijedi do"
          />
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import { isVisible } from "@primevue/core";
import { ref, watch, onMounted } from "vue";
import { getPravaForUser, getUser, savePravaForUser } from "~/service/user/user";

const props = defineProps({
  user: { type: Object, required: true },
});

const korisniciStore = useKorisniciStore();

const prava = ref([]);
const selectedPrava = ref([]);
const loadingPrava = ref(false);
const loadingPodprava = ref({});
const podPrava = ref({});

const selectedPravo = ref({});
const popover = ref();

// Funkcija koja se poziva klikom na ikonu
const openPopover = (event, pravo) => {
  selectedPravo.value = { ...pravo };
  console.log("pravo: ", selectedPravo.value);
  popover.value.toggle(event);
};

const onPopOverHide = async () => {
  const savingData = {
    userId: props.user?.eko_id,
    rightTypeId: selectedPravo.value?.vpr_id,
    dateFrom: formatDateToDMY(selectedPravo.value?.eko_datod, "-"),
    dateTo: formatDateToDMY(selectedPravo.value?.eko_datdo, "-"),
    status: 1,
  };

  console.log("savingData: ", savingData);

  const response = await savePravaForUser(savingData);
  if (response.status === 200) {
    console.log(response.data);
  }

  selectedPravo.value = {};
};

const loadPrava = async () => {
  loadingPrava.value = true;
  if (props.user && props.user?.eko_id) {
    try {
      // Dohvat glavnih prava (tip "APP")
      prava.value = await getPravaForUser(props.user?.eko_id, "APP");
      prava.value = prava.value.map((p) => ({
        ...p,
        eko_datod: props.user?.eko_datod,
        eko_datdo: props.user?.eko_datdo, // pretpostavljamo da je ispravan naziv polja
      }));

      // Ako korisnik već ima prava, postavimo ih
      if (props.user?.prava && props.user?.prava.length) {
        selectedPrava.value = props.user?.prava.map((item) => item.vpr_sif);
        // Učitavamo podprava za svako roditeljsko pravo
        for (const vprSif of selectedPrava.value) {
          const parentRight = prava.value.find((p) => p.vpr_sif === vprSif);
          if (parentRight) {
            await handleParentSelection(parentRight);
          }
        }
      }
    } catch (error) {
      console.error("Greška prilikom dohvata prava:", error);
    } finally {
      loadingPrava.value = false;
    }
  }
};

const handleParentSelection = async (pravo) => {
  if (selectedPrava.value.includes(pravo.vpr_sif)) {
    loadingPodprava.value = { ...loadingPodprava.value, [pravo.vpr_sif]: true };
    try {
      const subRights = await getPravaForUser(
        props.user?.eko_id,
        "FNC",
        pravo.vpr_id
      );
      if (subRights && subRights.message) {
        podPrava.value = {
          ...podPrava.value,
          [pravo.vpr_sif]: { message: subRights.message },
        };
      } else {
        podPrava.value = { ...podPrava.value, [pravo.vpr_sif]: subRights };
      }
    } catch (error) {
      console.error("Greška prilikom dohvata podprava:", error);
    } finally {
      loadingPodprava.value = {
        ...loadingPodprava.value,
        [pravo.vpr_sif]: false,
      };
    }
  } else {
    delete podPrava.value[pravo.vpr_sif];
    if (
      podPrava.value[pravo.vpr_sif] &&
      Array.isArray(podPrava.value[pravo.vpr_sif])
    ) {
      podPrava.value[pravo.vpr_sif].forEach((sub) => {
        const index = selectedPrava.value.indexOf(sub.vpr_sif);
        if (index > -1) {
          selectedPrava.value.splice(index, 1);
        }
      });
    }
    if (loadingPodprava.value[pravo.vpr_sif] !== undefined) {
      const { [pravo.vpr_sif]: removed, ...rest } = loadingPodprava.value;
      loadingPodprava.value = rest;
    }
  }
};

// Učitavanje prava pri montiranju
onMounted(() => {
  loadPrava();
});

// Deep watch za props.user.prava da se ažuriraju checkboxi
watch(
  () => props.user?.prava,
  (newPrava) => {
    if (newPrava && newPrava.length) {
      selectedPrava.value = newPrava.map((item) => item?.vpr_sif);
      newPrava.forEach((pravo) => {
        const parentRight = prava.value.find(
          (p) => p?.vpr_sif === pravo?.vpr_sif
        );
        if (parentRight) {
          handleParentSelection(parentRight);
        }
      });
    } else {
      selectedPrava.value = [];
    }
  },
  { immediate: true, deep: true }
);

watch(selectedPrava, (newValue) => {
  // Iz glavnih prava (prava.value)
  const parentRights = prava.value.filter((item) =>
    newValue.includes(item?.vpr_sif)
  );

  // Iz podprava - prolazimo kroz sve vrijednosti objekta podPrava.value,
  // ako je vrijednost niz, spajamo sve elemente, a zatim filtriramo prema selectedPrava
  const subRights = Object.values(podPrava.value)
    .flatMap((item) => (Array.isArray(item) ? item : []))
    .filter((item) => newValue.includes(item.vpr_sif));

  const selectedRightsObjects = [...parentRights, ...subRights];
  korisniciStore.selectedPrava = selectedRightsObjects;
  console.log("Objekti odabranih prava :", selectedRightsObjects);
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
