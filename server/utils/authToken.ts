// /server/utils/authToken.ts
import axios from "axios";
import { H3Event } from "h3";

export function isValidToken(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        // console.error("Neispravan JWT token:", error);
        return false;
    }
}

export const getAuthTokenFromEndpoint = async (event: H3Event): Promise<string | null> => {
    try {
      // Pretpostavimo da je BASE_URL definiran u .env ili se koristi localhost za razvoj
      const baseURL = process.env.BASE_URL;
      const url = `${baseURL}/user/get-cookie`;
  
      // Slanje GET zahtjeva s query parametrom "names" i prosljeđivanje postojećih cookie zaglavlja
      const response = await axios.get(url, {
        params: {
          names: 'authToken',
        },
        headers: {
          cookie: event.node.req.headers.cookie || '',
        },
      });
      
      // Očekujemo objekt oblika: { authToken: "vrijednost" }
      return response.data.authToken || null;
    } catch (error) {
      console.error('Error fetching authToken from endpoint:', error);
      return null;
    }
  };