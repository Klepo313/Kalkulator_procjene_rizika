// server/api/user.ts
import { parseCookies } from "h3"; // H3 omogućava lakši rad s HTTP zahtjevima

export default defineEventHandler(async (event) => {
    const vars = useRuntimeConfig();
    const cookies = parseCookies(event);
    const token = cookies.authToken; // Čitamo JWT token iz kolačića

    console.log("SERVER SIDE TOKEN: ", token)

    if (!token) {
        return { user: null };
    }

    // try {
    //     const res = await fetch(`${vars.public.API_BASE_PATH}/user/me`, {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });

    //     if (res.ok) {
    //         const user = await res.json();
    //         return { user };
    //     } else {
    //         return { user: null };
    //     }
    // } catch (error) {
    //     console.error("Error fetching user:", error);
    //     return { user: null };
    // }
});
