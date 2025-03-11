// /middleware/auth.global.js
// export default defineNuxtRouteMiddleware(async (to, from) => {
//     const user = useAuthStore();
//     const { loggedIn, user: sessionUser } = useUserSession();
  
//     // Ako je korisnik na /login stranici, preskačemo provjere autentifikacije
//     if (to.path === "/login") {
//         console.log("Na login stranici - preskačemo auth provjere.");
//         return;
//     }
  
//     console.log("User mid: ", user);
    
//     if (!user.isLoggedin && !loggedIn.value) {
//         return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
//     }
    
//     if (loggedIn.value) {
//         user.isLoggedin = true;
//         user.userRoles = sessionUser.userRoles || [];
//         user.exp = sessionUser.exp || null;
//     }
// });

// middleware/auth.global.js
// export default defineNuxtRouteMiddleware(async (to, from) => {
//   // Preskoči provjeru ako smo na /login
//   if (to.path === "/login") {
//     console.log("Na login stranici - preskačemo auth provjere.");
//     return;
//   }

//   const auth = useAuthStore();

//   // Ako stanje autentifikacije još nije inicijalizirano, čekamo provjeru
//   if (!auth.initialized) {
//     await auth.checkAuth();
//     auth.initialized = true;
//   }

//   // Ako korisnik nije prijavljen, preusmjeri ga na login stranicu
//   if (!auth.isLoggedin) {
//     return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
//   }
// });

  

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useAuthStore();

    const route = useRoute(); // Dohvaćamo trenutnu rutu

    // Ako je korisnik na /login stranici, ne radimo provjere autentifikacije
    if (route.path === "/login") {
        console.log("Na login stranici - preskačemo auth provjere.");
        return;
    }

    console.log("user mid: ", user);
    if (!user.isLoggedin) {
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }
})
