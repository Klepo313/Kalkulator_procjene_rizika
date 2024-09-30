<template>
    <div>
        <div class="body">
            Kalkulator emisija stakleničkih plinova
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: [
        'auth'
    ],
    pageTransition: { name: 'slide', mode: 'out-in' }
});

const idIzracuna = useCookie('id_izracuna', {
    maxAge: 60 * 60 * 24 * 7, // Cookie will expire in 7 days
    path: '/', // Cookie available throughout the app
    secure: process.env.ENVIRONMENT === 'PRODUCTION', // Secure cookies in production // true, //process.env.ENVIRONMENT === 'PRODUCTION', // Secure cookies in production
    sameSite: process.env.ENVIRONMENT === 'PRODUCTION' ? 'None' : 'Lax', // Use 'None' only in production
});
idIzracuna.value = '/';

const vrstaIzracuna = useCookie('vrsta_izracuna');
vrstaIzracuna.value = null;

</script>

<style scoped>
.body {
    position: relative;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
}

h2 {
    font-size: 20px;
}

.main-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    padding: 26px;
    width: 100%;
}

.card-container {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    padding: 20px;
    width: 100%;
    max-width: 210px;
    aspect-ratio: 1/1;

    background-color: var(--white-color);
    border: 1px solid rgb(20, 82, 28, 0.2);
    border-radius: var(--border-form-radius);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.card * {
    color: var(--primary-color);
    font-size: 16px;
    font-weight: 600;
    text-align: center;
}

.card:hover {
    background-color: var(--primary-color-focus);
    cursor: pointer;
}

.card:hover *,
.card:active * {
    color: white;
}

.card:active {
    background-color: var(--primary-color-hover);
}

.footer-link {
    position: absolute;
    left: 0px;
    bottom: 0px;
}
</style>