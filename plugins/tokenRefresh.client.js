import { useCookie } from '#app';
import { refresh_token } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
    const userToken = useCookie('userToken');
    const expiryTime = useCookie('expiryTime'); // Cookie koji sadrži vrijeme isteka
    const refreshBufferTime = 2 * 60 * 1000; // 2 minute prije isteka

    let refreshTimeout;

    async function refreshToken() {
        try {
            const response = await refresh_token();
            const data = await response.json();

            if (response.ok) {
                userToken.value = data.newToken; // Ažurirajte token u kolačiću
                expiryTime.value = Date.now() + (24 * 60 * 60 * 1000); // Ažurirajte i vrijeme isteka
                scheduleTokenRefresh(); // Restartaj timer
            }
        } catch (error) {
            console.error('Greška prilikom osvježavanja tokena:', error);
        }
    }

    function scheduleTokenRefresh() {
        const tokenExpiry = expiryTime.value ? parseInt(expiryTime.value, 10) : 0; // Čitanje vrijednosti iz cookia
        const timeUntilRefresh = tokenExpiry - Date.now() - refreshBufferTime;

        if (timeUntilRefresh > 0) {
            refreshTimeout = setTimeout(() => {
                if (isUserActive()) {
                    refreshToken();
                }
            }, timeUntilRefresh);
        }
    }

    function isUserActive() {
        return document.hasFocus();
    }

    function setupActivityListeners() {
        const events = ['mousemove', 'keydown', 'scroll'];
        events.forEach((event) => window.addEventListener(event, resetTokenRefresh));
    }

    function resetTokenRefresh() {
        clearTimeout(refreshTimeout);
        scheduleTokenRefresh();
    }

    nuxtApp.hook('app:mounted', () => {
        scheduleTokenRefresh();
        setupActivityListeners();
    });

    nuxtApp.hook('app:unmounted', () => {
        clearTimeout(refreshTimeout);
        const events = ['mousemove', 'keydown', 'scroll'];
        events.forEach((event) => window.removeEventListener(event, resetTokenRefresh));
    });
});
