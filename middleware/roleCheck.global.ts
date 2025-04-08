// /middleware/roleCheck.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();

    // Izbjegavamo provjere za određene rute
    const excludedPaths = [
        "/login",
        "/user/change-password"
    ];

    if (excludedPaths.includes(to.path)) {
        return;
    }

    // Ako stranica definira meta podatke o potrebnoj roli, provjeravamo ih
    const requiredRole = to.meta.requiredRole;
    const requiredRolePrefix = to.meta.requiredRolePrefix;

    if (requiredRole || requiredRolePrefix) {
        const userRoles = userStore.roles || [];

        const hasAccess = requiredRole
            ? userRoles.includes(requiredRole)
            : userRoles.some(role => role.startsWith(requiredRolePrefix));

        if (!hasAccess) {
            console.warn(`Pristup odbijen za ${to.path} - nedostaje potrebna rola.`);
            return navigateTo("/"); // ili stranicu s objašnjenjem da nema pristup
        }
    }

    // console.log(`Pristup odobren za ${to.path} s rolama:`, userStore.roles);
});
