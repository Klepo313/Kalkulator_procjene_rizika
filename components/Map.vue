<template>
    <div>
        <div>
            <!-- Radio buttoni za odabir mape -->
            <label>
                <input type="radio" value="https://oss.uredjenazemlja.hr/map" v-model="selectedUrl" />
                Uređena Zemlja
            </label>
            <label>
                <input type="radio" value="https://geoportal.dgu.hr/" v-model="selectedUrl" />
                Geoportal
            </label>
        </div>

        <!-- Iframe koji prikazuje mapu prema odabranom URL-u -->
        <iframe :src="selectedUrl" style="width: 100%; height: 600px; border: none;"></iframe>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Početni URL koji će biti prikazan
const selectedUrl = ref('https://oss.uredjenazemlja.hr/map');
</script>

<style scoped>
h3 {
    margin-bottom: 10px;
}

label {
    margin-right: 15px;
    font-weight: bold;
}

iframe {
    margin-top: 20px;
}
</style>