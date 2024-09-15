<template>
    <div>
        <div class="body">
            <main>
                <div class="image-container">
                    <img src="../images/KPR_full_logo.svg" alt="logo">
                </div>
                <div class="main-container">
                    <NuxtPage style="width: 100%; height: 100%;" />
                </div>
            </main>

            <FooterText class="footer-text" />
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    pageTransition: { name: 'slide', mode: 'out-in' }
});

</script>

<style scoped>
/* CSS za slide animaciju s efektom nestajanja */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.5s ease, opacity 0.25s ease;
    /* Dodajemo tranziciju za opacity */
}

.slide-enter-from {
    transform: translateX(-100%);
    opacity: 0;
    /* Početak ulaska, izvan ekrana s lijeve strane i nevidljivo */
}

.slide-enter-to {
    transform: translateX(0);
    opacity: 1;
    /* Krajnja točka, element se potpuno vidi i nalazi na mjestu */
}

.slide-leave-from {
    transform: translateX(0);
    opacity: 1;
    /* Element započinje na mjestu i potpuno vidljiv */
}

.slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
    /* Element klizi udesno i postaje nevidljiv */
}

.footer-text {
    position: absolute;
    bottom: 20px;
}

.body {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100dvh;
}

main {
    width: 100%;
    height: 100%;
    padding: 26px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: space-between;
    gap: 0px;

    transition: flex-direction 0.5s ease;
}

.image-container,
.main-container {
    padding: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.image-container {
    padding-left: 0px;
}

.image-container img {
    max-width: 100%;
}

.main-container {
    width: 100%;
    flex-direction: column;
    gap: 30px;

    /* background-color: white;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); */
}
</style>
