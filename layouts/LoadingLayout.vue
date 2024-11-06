<!-- layouts/LoadingLayout.vue
<template>
    <div class="loading-container">
        <img src="/static/images/atd_solucije.png" class="logo" alt="Loading Logo">
        <p class="logo">
            Vaš savjetnik za uspješno i održivo poslovanje i financiranje
        </p>
    </div>
</template>

<script setup>
// Opciono možete dodati skripte ovde
</script>

<style scoped>
.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background-color: #ffffff;
    /* Boja pozadine */
}

.logo,
.text {
    height: 40px;
    width: auto;
    object-fit: contain;
    animation: pulse 1s infinite;
}

img {
    width: auto;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.5;
        transform: scale(0.98);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }
}
</style> -->

<template>
    <div>
        <div class="loading-container">
            <main>
                <!-- <div class="popup-content">
                    <div class="UI-loader" />
                </div> -->
                <div class="popup-header">
                    <img src="../public/static/images/atd_solucije.png" class="logo" alt="Loading Logo">
                    <!-- <h2>{{ message }}</h2> -->
                    <!-- <p>{{ description }}</p> -->
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    // message: String,
    loader: String
})

const message = 'ATD Solucije';
const description = 'Vaš savjetnik za uspješno i održivo poslovanje i financiranje'
const loader = computed(() => props.loader);

</script>

<style scoped>
.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background-color: #ffffff;
    /* Boja pozadine */
}

main,
.popup-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.logo,
.text {
    height: 40px;
    width: auto;
    object-fit: contain;
    animation: pulse 1s infinite;
}

img {
    width: auto;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.5;
        transform: scale(0.98);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>