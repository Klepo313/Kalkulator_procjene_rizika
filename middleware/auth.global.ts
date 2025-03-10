// /middleware/auth.global.js

// /middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useAuthStore();
  
    // Ako je korisnik na /login stranici, preskačemo provjere autentifikacije
    if (to.path === "/login") {
      //c// console.log("Na login stranici - preskačemo auth provjere.");
      return;
    }
  
    //c// console.log("user mid: ", user);
    if (!user.isLoggedin) {
      return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }
  });
  

// export default defineNuxtRouteMiddleware(async (to, from) => {
//     const user = useAuthStore();

//     const route = useRoute(); // Dohvaćamo trenutnu rutu

//     // Ako je korisnik na /login stranici, ne radimo provjere autentifikacije
//     if (route.path === "/login") {
//         // console.log("Na login stranici - preskačemo auth provjere.");
//         return;
//     }

//     // console.log("user mid: ", user);
//     if (!user.isLoggedin) {
//         return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
//     }
// })
