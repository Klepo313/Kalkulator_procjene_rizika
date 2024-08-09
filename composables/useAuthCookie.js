import { useCookie } from '#app'

export default function useAuthCookie() {
    const authCookie = useCookie('auth-token') // Create a cookie with the name 'auth-token'

    function setAuthCookie(value, options = {}) {
        // Set the cookie value with optional options such as expires, path, etc.
        authCookie.value = value
    }

    function getAuthCookie() {
        return authCookie.value
    }

    return {
        setAuthCookie,
        getAuthCookie
    }
}