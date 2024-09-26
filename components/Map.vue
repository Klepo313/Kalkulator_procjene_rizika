<template>
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

        // Dodaj sloj s hrvatskim općinama na mapu
        const geojsonLayer = L.geoJSON(geojsonData, {
            style: {
                color: 'blue', // Stilovi za općine
                weight: 2,
                opacity: 0.3
            },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    // Provjeri koja svojstva su dostupna u properties
                    console.log('Općina:', feature.properties);

                    // Ispiši specifično ime općine ako postoji
                    const name = feature.properties.name || 'Nepoznata općina';
                    const adminLevel = feature.properties.admin_level || 'Nepoznata razina';
                    console.log(`Općina: ${name}, Razina administracije: ${adminLevel}`);
                });
            }
        }).addTo(map);
    }
});
</script>

<style scoped>
#map {
    height: 500px;
}
</style>