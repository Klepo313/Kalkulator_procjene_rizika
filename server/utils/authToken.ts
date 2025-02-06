// /server/utils/authToken.ts
export function isValidToken(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        console.error("Neispravan JWT token:", error);
        return false;
    }
}
