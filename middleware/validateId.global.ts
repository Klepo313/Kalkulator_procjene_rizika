// ~/middleware/validate-predlozak.global.ts
import { useToast } from 'primevue/usetoast'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $validateId } = useNuxtApp()
    const toast = useToast()

    const path = to.path
    const id = typeof to.query.id === 'string' ? to.query.id : null
    console.log('ID:', id)

    const isKespPredlozak = path.startsWith('/kesp/predlozak')
    const isKpkrRoot = path === '/kpkr/predlozak'
    const isKpkrMjere = path.startsWith('/kpkr/predlozak/mjere-prilagodbe')
    const isKpkrRizik = path.startsWith('/kpkr/predlozak/rizik-sazetak')
    const isKpkrChild = path.startsWith('/kpkr/predlozak')

    // 1) KESP: svaki /kesp/predlozak* zahtijeva ID
    if (isKespPredlozak && !id) {
        useState('toastMessage', () => 'ID parametar nedostaje u URL-u.')
        return navigateTo('/kesp/predlosci')
    }

    // 2) KPKR: mjere-prilagodbe i rizik-sazetak zahtijevaju ID
    if ((isKpkrMjere || isKpkrRizik) && !id) {
        useState('toastMessage', () => 'ID parametar nedostaje u URL-u.')
        return navigateTo('/kpkr/predlosci')
    }

    // 3) Ako ima ID i radi se o nekoj predlozak-ruti (KESP ili KPKR bilo koji),
    //    validiraj ID
    if (id && (isKespPredlozak || isKpkrChild)) {
        const valid = await $validateId(id, path)
        if (!valid) {
            useState('toastMessage', () => 'Predani ID parametar nije valjan.')
            const redirectBase = isKespPredlozak ? '/kesp/predlosci' : '/kpkr/predlosci'
            return navigateTo(redirectBase)
        }
    }

    // Otherwise, allow navigation
})
