<template>
    <div>
        <div v-if="data" class="grid">
            <!-- v-for tdg_rbr == 10 -->
            <div class="_grid-item first-div" :class="getColorClass(data[0].history)">
                <span class="first" :style="getFontSize(data[0].history)">
                    {{ data[0].history }}
                </span>
            </div>
            <div class="_grid-item db-s" :class="getColorClass(data[0].p0_4_5)" :style="getFontSize(data[0].p0_4_5)">
                {{ data[0].p0_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[0].p1_4_5)" :style="getFontSize(data[0].p1_4_5)">
                {{ data[0].p1_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[0].p2_4_5)" :style="getFontSize(data[0].p2_4_5)">
                {{ data[0].p2_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[0].p0_8_5)" :style="getFontSize(data[0].p0_8_5)">
                {{ data[0].p0_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[0].p1_8_5)" :style="getFontSize(data[0].p1_8_5)">
                {{ data[0].p1_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[0].p2_8_5)" :style="getFontSize(data[0].p2_8_5)">
                {{ data[0].p2_8_5 }}
            </div>

            <div class="_grid-item first-div" :class="getColorClass(data[1].history)">
                <span class="first" :style="getFontSize(data[1].history)">
                    {{ data[1].history }}
                </span>
            </div>
            <div class="_grid-item db-s" :class="getColorClass(data[1].p0_4_5)" :style="getFontSize(data[1].p0_4_5)">
                {{ data[1].p0_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[1].p1_4_5)" :style="getFontSize(data[1].p1_4_5)">
                {{ data[1].p1_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[1].p2_4_5)" :style="getFontSize(data[1].p2_4_5)">
                {{ data[1].p2_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[1].p0_8_5)" :style="getFontSize(data[1].p0_8_5)">
                {{ data[1].p0_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[1].p1_8_5)" :style="getFontSize(data[1].p1_8_5)">
                {{ data[1].p1_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[1].p2_8_5)" :style="getFontSize(data[1].p2_8_5)">
                {{ data[1].p2_8_5 }}
            </div>

            <div class="_grid-item first-div" :class="getColorClass(data[2].history)">
                <span class="first" :style="getFontSize(data[2].history)">
                    {{ data[2].history }}
                </span>
            </div>
            <div class="_grid-item db-s" :class="getColorClass(data[2].p0_4_5)" :style="getFontSize(data[2].p0_4_5)">
                {{ data[2].p0_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[2].p1_4_5)" :style="getFontSize(data[2].p1_4_5)">
                {{ data[2].p1_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[2].p2_4_5)" :style="getFontSize(data[2].p2_4_5)">
                {{ data[2].p2_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[2].p0_8_5)" :style="getFontSize(data[2].p0_8_5)">
                {{ data[2].p0_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[2].p1_8_5)" :style="getFontSize(data[2].p1_8_5)">
                {{ data[2].p1_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[2].p2_8_5)" :style="getFontSize(data[2].p2_8_5)">
                {{ data[2].p2_8_5 }}
            </div>

            <div class="_grid-item first-div" :class="getColorClass(data[3].history)">
                <span class="first" :style="getFontSize(data[3].history)">
                    {{ data[3].history }}
                </span>
            </div>
            <div class="_grid-item db-s" :class="getColorClass(data[3].p0_4_5)" :style="getFontSize(data[3].p0_4_5)">
                {{ data[3].p0_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[3].p1_4_5)" :style="getFontSize(data[3].p1_4_5)">
                {{ data[3].p1_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[3].p2_4_5)" :style="getFontSize(data[3].p2_4_5)">
                {{ data[3].p2_4_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[3].p0_8_5)" :style="getFontSize(data[3].p0_8_5)">
                {{ data[3].p0_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[3].p1_8_5)" :style="getFontSize(data[3].p1_8_5)">
                {{ data[3].p1_8_5 }}
            </div>
            <div class="_grid-item" :class="getColorClass(data[3].p2_8_5)" :style="getFontSize(data[3].p2_8_5)">
                {{ data[3].p2_8_5 }}
            </div>
        </div>
        <div v-else class="grid">
            <div class="_grid-item first-div">
                <span class="first">
                    <font-awesome-icon icon="spinner" spin />
                </span>
            </div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>

            <div class="_grid-item first-div">
                <span class="first">
                    <font-awesome-icon icon="spinner" spin />
                </span>
            </div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>

            <div class="_grid-item first-div">
                <span class="first">
                    <font-awesome-icon icon="spinner" spin />
                </span>
            </div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>

            <div class="_grid-item first-div">
                <span class="first">
                    <font-awesome-icon icon="spinner" spin />
                </span>
            </div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { getColorClass } from '../../utils/getColorClass'

const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    pozicija: Number,
    // eslint-disable-next-line vue/require-default-prop
    data: Object,
})

// Reaktivna vrednost data je direktno povezana sa props.data
const data = computed(() => props.data);


const isScreenWidthLessThan1500 = ref(false);

const updateScreenWidth = () => {
    if (typeof window !== 'undefined') {
        isScreenWidthLessThan1500.value = window.innerWidth < 1500;
    }
};

// Dodaj event listener za promjene u veličini ekrana unutar onMounted hook-a
onMounted(() => {
    updateScreenWidth(); // Inicijalno postavljanje prilikom mount-a
    window.addEventListener('resize', updateScreenWidth);
});

// Ukloni event listener kada komponenta bude uništena
onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);
});

// watch funkcija koja reagira na promjene u reaktivnoj varijabli
watch(isScreenWidthLessThan1500, (newValue) => {
    //cconsole.log(`Screen width is less than 1500: ${newValue}`);
});

const isDoubleDigit = (value) => {
    // Provjerava je li vrijednost broj i je li dvoznamenkast
    return value >= 10 && value <= 99; // typeof value === 'number' && 
}
const getFontSize = (value) => {
    // Vraća stil na temelju provjere je li broj dvoznamenkast
    if (isDoubleDigit(value) && isScreenWidthLessThan1500.value) {
        return { fontSize: '12px' };
    }
    return {};
}

</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(4, 1fr);
    box-sizing: border-box;

    width: 100%;
    height: 100%;
}

._grid-item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    box-sizing: border-box;
    border: 1px solid #3C7D22;
    border-bottom: none;
    border-right: none;
}

/* .first-div {
    padding: 0px 1px;
} */

.first {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    border-left: 2px solid #3C7D22;
    border-right: 2px solid #3C7D22;
}

.db-r {
    border-right: 1px dashed #3C7D22;
}

.db-s {
    border-left-style: solid;
}

.nullgray {
    background-color: rgb(239, 239, 239);
}

/* < 0 */
.lightgray {
    color: #caedfb;
    background-color: #caedfb;
    font-style: italic;
    user-select: none;
}

/* = 0 */
.white {
    background-color: #ffffff;
}

/* > 0 */
.gray {
    background-color: #bfbfbf;
}

/* [2, 3] */
.green {
    background-color: #92d050;
}

/* [4, 6] */
.yellow {
    background-color: #ffff00;
}

/* [7, 10] */
.orange {
    background-color: #ffc000;
}

/* [11, 15] */
.red {
    background-color: #ff0000;
}
</style>
