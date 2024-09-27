<!-- <template>
    <div id="map" style="height: 500px;"></div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(async () => {
    if (import.meta.client) {
        const L = await import('leaflet');

        const map = L.map('map').setView([45.8150, 15.9819], 7); // Središte Hrvatske

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Učitaj GeoJSON datoteku iz /public/blobs
        const response = await fetch('/blobs/hrvatske_opcine.geojson');
        const geojsonData = await response.json();

        // Filtriraj samo općine s admin_level: 8
        const ZupanijeFilteredData = {
            ...geojsonData,
            features: geojsonData.features.filter(feature => feature.properties.admin_level == 6)
        };
        const OpćineFilteredData = {
            ...geojsonData,
            features: geojsonData.features.filter(feature => feature.properties.admin_level == 7)
        };

        console.log("Filtrirana GeoJSON - ŽUPANIJE - data: ", ZupanijeFilteredData);
        console.log("Filtrirana GeoJSON - OPĆINE - data: ", OpćineFilteredData);

        // Dodaj sloj s zupanijama na mapu
        const zupanijeLayer = L.geoJSON(ZupanijeFilteredData, {
            style: {
                color: 'red', // Stilovi za općine
                weight: 2,
                opacity: 0.2
            },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    const name = feature.properties.name || 'Nepoznata općina';
                    console.log(`Županija: ${name}, Admin level: ${feature.properties.admin_level}`);
                });
            }
        })

        // Dodaj sloj s općinama na mapu
        const opcineLayer = L.geoJSON(OpćineFilteredData, {
            style: {
                color: 'blue', // Stilovi za općine
                weight: 1,
                opacity: 0.3
            },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    const name = feature.properties.name || 'Nepoznata općina';
                    console.log(`Općina: ${name}, Admin level: ${feature.properties.admin_level}`);
                });
            }
        })


        zupanijeLayer.addTo(map);
        opcineLayer.addTo(map);
    }
});
</script>

<style scoped>
#map {
    height: 500px;
}
</style> -->

<template>
    <div>
        <h2 class="h2-katastar">Uređena zemlja</h2>
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
}

label {
    margin-right: 15px;
    font-weight: bold;
}

iframe {
    margin-top: 20px;
}
</style>