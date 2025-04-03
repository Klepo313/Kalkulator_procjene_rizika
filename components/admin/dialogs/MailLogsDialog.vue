<template>
  <Dialog
    :visible="modelVisible"
    header="Povijest poslane pošte"
    :style="{ width: '800px' }"
    :closable="false"
    maximizable
    modal
    :content-style="{ height: 'auto' }"
  >
    <template #header>
      <span class="dialog-header-text-grid">
        <font-awesome-icon icon="envelope" class="dialog-header-icon-grid" />
        <span class="dialog-header-text-span span1">
          Povijest poslane pošte
        </span>
        <span class="dialog-header-text-span span2">
          {{ userName }}
        </span>
      </span>
    </template>
    <template #default>
      <DataTable :value="mailLogs" :rows="10" scrollable scroll-height="200px">
        <Column header="#" header-style="width:3rem">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column field="naziv" header="Naslov" sortable />
        <Column field="date" header="Datum" sortable />
      </DataTable>
    </template>
    <template #footer>
      <div class="mail-dialog-footer">
        <button class="p-button p-component p-button-secondary" @click="close">
          Zatvori
        </button>
        <button class="submitBtn" type="button">
          <font-awesome-icon icon="paper-plane" />
          Generiraj nove korisničke podatke
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
const props = defineProps({
  visible: Boolean,
  mailLogs: { type: Array, default: () => [] },
  user: { type: Object, default: () => ({}) },
});
const emits = defineEmits(["update:visible"]);

const modelVisible = ref(props.visible);
watch(
  () => props.visible,
  (val) => {
    modelVisible.value = val;
  }
);

const close = () => {
  emits("update:visible", false);
};

const userName = computed(() =>
  props.user ? `${props.user.epr_ime} ${props.user.epr_prezime}` : ""
);
</script>

<style scoped>
.dialog-header-text-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  font-size: 1.2rem;
  font-weight: 600;
}
.dialog-header-icon-grid {
  grid-column: 1;
  grid-row: 1 / 3;
  font-size: 1.2rem;
}
.dialog-header-text-span.span1 {
  font-size: 1.2rem;
}
.dialog-header-text-span.span2 {
  opacity: 0.6;
}
.mail-dialog-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
