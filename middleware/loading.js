// middleware/loading.js
export default defineNuxtRouteMiddleware((to, from) => {
    const { layout } = useNuxtApp();

    // Postavi `LoadingLayout` pre nego što stranica počne da se učitava
    layout.value = 'LoadingLayout';

    // Kada se stranica završi s učitavanjem, vrati se na podrazumevani layout
    onBeforeRouteLeave(() => {
        layout.value = 'default';
    });
});
