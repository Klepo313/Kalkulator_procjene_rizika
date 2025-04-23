import { getIdFromUrl } from '~/utils/navigationHandler';
import { useToast } from 'primevue/usetoast';

// export default defineNuxtRouteMiddleware(async (to) => {
//     const { $validateId } = useNuxtApp();
//     const toast = useToast();

//     // Čitamo id iz URL parametra (client-only!)
//     const id = getIdFromUrl();
//     const path = to.path;

//     const isKesp = path.startsWith('/kesp/predlozak');
//     const isKpkr = path.startsWith('/kpkr/predlozak');

//     const shouldCheck = (isKpkr || isKesp) && id;

//     const redirectBase = isKpkr
//         ? '/kpkr/predlosci'
//         : '/kesp/predlosci';

//     console.log("shouldCheck: ", shouldCheck);
//     console.log("id: ", id);
//     console.log("path: ", path);

//     if (!id && isKesp) {
//         const toastMessage = useState('toastMessage', () => '');
//         toastMessage.value = 'Nije predan id izračuna.';
//         return navigateTo(redirectBase);
//     }

//     if (!shouldCheck) return;

//     const isValid = await $validateId(id, path);

//     if (!isValid) {
//         const toastMessage = useState('toastMessage', () => '');
//         toastMessage.value = 'Izračun nije moguće dohvatiti jer id nije valjan.';

//         return navigateTo(redirectBase);
//     }
// });

export default defineNuxtRouteMiddleware(async (to) => {
    const { $validateId } = useNuxtApp();
    const toast = useToast();

    const path = to.path;
    const id = typeof to.query.id === 'string' ? to.query.id : null;

    const isKesp = path.startsWith('/kesp/predlozak');
    const isKpkr = path.startsWith('/kpkr/predlozak');

    const needsValidation = isKesp || isKpkr;

    // Provjera: ruta zahtijeva ID, ali ga nema
    if (needsValidation && !id) {
        const redirectBase = isKesp ? '/kesp/predlosci' : '/kpkr/predlosci';
        const toastMessage = useState('toastMessage', () => '');
        toastMessage.value = 'ID parametar nedostaje u URL-u.';
        return navigateTo(redirectBase);
    }

    if (!needsValidation || !id) return;

    // Provjera validnosti ID-a
    const isValid = await $validateId(id, path);

    if (!isValid) {
        const redirectBase = isKesp ? '/kesp/predlosci' : '/kpkr/predlosci';
        const toastMessage = useState('toastMessage', () => '');
        toastMessage.value = 'Predani ID parametar nije valjan.';
        return navigateTo(redirectBase);
    }
});

