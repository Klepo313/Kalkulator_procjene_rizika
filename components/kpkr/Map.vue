<template>
    <div>
        <h2 class="h2-katastar">
            Uređena zemlja
            <a href="https://oss.uredjenazemlja.hr/map" target="_blank" class="link-as-heading">
                <font-awesome-icon icon="up-right-from-square" />
            </a>
        </h2>
        <!-- Iframe koji prikazuje mapu prema odabranom URL-u -->
        <iframe :src="selectedUrl" style="width: 100%; height: 800px; border: none;" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Početni URL koji će biti prikazan
const selectedUrl = ref('https://oss.uredjenazemlja.hr/map');
</script>

<style scoped>
h2 {
    font-size: 18px;
    border-bottom: 1px solid var(--primary-color);
    color: var(--primary-color);

    display: flex;
    align-items: center;
    gap: 5px;
}

a.link-as-heading {
    font-size: 18px;
    color: var(--primary-color);
    text-decoration: none;
}

a.link-as-heading:hover {
    color: var(--primary-color-hover);
    transform: translate(3px, -3px);
}

label {
    margin-right: 15px;
    font-weight: bold;
}

iframe {
    margin-top: 20px;
}
</style>