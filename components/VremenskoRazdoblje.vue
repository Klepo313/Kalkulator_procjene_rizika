<template>
    <div class="razdoblje">
        <span>
            <label for="godina">
                Godina<span class="required">*</span>
            </label>
            <DatePicker v-model="godina" show-icon fluid icon-display="input" view="year" date-format="yy"
                placeholder="Godina izračuna" readonly @change="onYearChange" />
        </span>
        <div>
            <div>
                <label for="startDate">
                    Početni datum<span class="required">*</span>
                </label>
                <DatePicker id="startDate" v-model="datumOd" date-format="dd.mm.yy" show-icon fluid icon-display="input"
                    placeholder="Početni datum" readonly />
            </div>
            <div>
                <label for="endDate">
                    Krajnji datum<span class="required">*</span>
                </label>
                <DatePicker id="endDate" v-model="datumDo" date-format="dd.mm.yy" show-icon fluid icon-display="input"
                    placeholder="Krajnji datum" readonly />
            </div>
        </div>
    </div>
</template>

<script script>
import { useKespStore } from '#imports';

const kespStore = useKespStore();

const godina = computed({
    get: () => kespStore.godina,
    set: (value) => kespStore.setGodina(value),
});

const datumOd = computed(() => kespStore.datumOd);
const datumDo = computed(() => kespStore.datumDo);

console.log(datumOd.value, datumDo.value, godina.value);

</script>

<style scoped>
.razdoblje {
    max-width: 500px;

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.razdoblje>div,
.razdoblje>div>div,
.razdoblje>span {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.razdoblje>div {
    flex-direction: row;
}

.razdoblje>span {
    width: auto;
}

.required {
    color: var(--red-soft);
}
</style>