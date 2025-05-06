// /middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserStore()
    const { initAuth, isAuthReady } = useAuth()

    // 1. Preskoči login stranicu
    if (to.path === '/login') return

    // 2. Pričekaj da se izvrši inicijalna provjera auth stanja
    if (!isAuthReady.value) {
        await initAuth()
    }

    // 3. Ako nije ulogiran, redirect na login
    if (!userStore.isLoggedin) {
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`)
    }

    // 4. Provjera role ili prefixa role iz definePageMeta
    const meta = to.meta as Record<string, any>
    const { requiredRole, requiredRolePrefix } = meta
    console.log(requiredRole, requiredRolePrefix);
    console.log(userStore.roles);
    if (requiredRole) {
        // exact match
        if (!userStore.roles.includes(requiredRole)) {
            useState('toastCallBackMessage', () => 'Nemate dopuštenih prava za pristup ovoj stranici.')
            return navigateTo('/')
        }
    }
    else if (requiredRolePrefix) {
        // bilo koja rola koja počinje sa prefixom
        const hasPrefix = userStore.roles.some(role =>
            role.startsWith(requiredRolePrefix)
        )
        if (!hasPrefix) {
            useState('toastCallBackMessage', () => 'Nemate dopuštenih prava za pristup ovoj stranici.')
            return navigateTo('/')
        }
    }

    // 5. Ako ništa od gore, propuštamo dalje
})

