<template>
  <Dialog
    v-model:visible="modalVisible"
    modal
    header="Novi predložak"
    :style="{ width: '25rem' }"
    @hide="hide">
    <div class="dialog">
      <div class="short-field">
        <label for="vrsetIzracuna" class="font-semibold w-24"
          >Vrste izračuna</label
        >
        <Select
          v-model="vrstaIzracuna"
          id="vrsetIzracuna"
          class="flex-auto"
          :options="vrsteIzracuna"
          option-label="tvz_naziv" />
      </div>
    </div>

    <template #footer>
      <Button
        label="Odustani"
        text
        severity="secondary"
        @click="hide"
        autofocus />
      <button
        label="Novi predložak"
        outlined
        severity="primary"
        @click="continueNav"
        autofocus>
        Nastavi <font-awesome-icon icon="arrow-right" />
      </button>
    </template>
  </Dialog>
</template>

<script setup>
import { getCalculationTypes } from "~/service/kpkr/form";

const emit = defineEmits(["update:visible"]);

const cardStore = useCardStore();

const props = defineProps({
  visible: Boolean,
});

const modalVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

// pripravi cookie–ref
const vrstaCookie = useCookie("vrstaIzracuna", {
  // automatski serijaliziramo objekt
  encode: JSON.stringify,
  decode: JSON.parse,
});

const vrstaIzracuna = ref(null);
const vrsteIzracuna = ref(null);

const getVrsteIzracuna = async () => {
  try {
    const response = await getCalculationTypes();
    const data = response.data;
    if (response.status === 200) {
      vrstaIzracuna.value = data[0];
    }
    vrsteIzracuna.value = data;
  } catch (error) {
    return error;
  }
};

const continueNav = async () => {
  // emit("continueNav", vrstaIzracuna.value);
  vrstaCookie.value = null;
  cardStore.resetCardStore();

  // postavi novi
  if (vrstaIzracuna.value) {
    vrstaCookie.value = {
      tvz_id: vrstaIzracuna.value.tvz_id,
      tvz_naziv: vrstaIzracuna.value.tvz_naziv,
    };
  }

  await navigateTo("/kpkr/predlozak");
  // await navigateTo({
  //   path: "/kpkr/predlozak",
  //   query: {
  //     tvz_id: vrstaIzracuna.value.tvz_id,
  //     tvz_naziv: vrstaIzracuna.value.tvz_naziv,
  //   },
  // });
  emit("update:visible", false);
};

const hide = () => {
  emit("update:visible", false);
};

onMounted(async () => {
  await getVrsteIzracuna();
});
</script>

<style scoped>
.dialog {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
ul {
  margin-top: 2px;
  list-style-type: disc;
  list-style-position: inside;
}
.short-field {
  /* margin-top: 13px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.short-field > * {
  width: 100%;
}

.gwp-calc {
  background-color: none;
  border: none;
  cursor: pointer;
}

.gwp-calc span {
  margin-left: 5px;
}

.gwp-calc * {
  color: var(--primary-color);
}

.gwp-calc:hover span,
.gwp-calc:active span {
  text-decoration: underline;
}
</style>
