<!-- pages/error.vue -->
<template>
    <div class="error-page">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button @click="goToHome">Go to Home</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Koristimo router za navigaciju
const router = useRouter()

// Funkcija za navigaciju na početnu stranicu
const goToHome = () => {
    router.push('/')
}
</script>

<style scoped>
.error-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-color);
    text-align: center;
}
</style>