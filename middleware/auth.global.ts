// /middleware/auth.global.ts
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
        return navigateTo('/403')
      }
    }
    else if (requiredRolePrefix) {
      // bilo koja rola koja počinje sa prefixom
      const hasPrefix = userStore.roles.some(role =>
        role.startsWith(requiredRolePrefix)
      )
      if (!hasPrefix) {
        return navigateTo('/')
      }
    }
  
    // 5. Ako ništa od gore, propuštamo dalje
  })
  
  
  


// export default defineNuxtRouteMiddleware((to, from) => {
//     const userStore = useUserStore();

//     if (to.path === "/login") return;
    
//     if (!userStore.isLoggedin) {
//         return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
//     }
// });

// export default defineNuxtRouteMiddleware(async (to, from) => {
//     // Preskoči provjeru ako je ruta /login
//     if (to.path === "/login") return;

//     // Dinamički importiraj funkciju za provjeru autentifikacije
//     const { checkAuth } = await import("~/composables/useAuth");

//     // Čekaj da se provjera autentifikacije završi
//     await checkAuth();

//     // Opcionalno: ako korisnik nije autentificiran, možeš preusmjeriti na login
//     const userStore = useUserStore();
//     if (!userStore.isLoggedin) {
//         return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
//     }
// });
