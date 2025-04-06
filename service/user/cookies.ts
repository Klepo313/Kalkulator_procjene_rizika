import axios from "axios";

interface Cookie {
    name: string;
    value: string;
}

/**
 * Sets cookies on the server.
 *
 * @param {Cookie | Cookie[]} cookies - A single cookie object or an array of cookie objects.
 * @returns {Promise<any>} The response data from the server.
 */
export const setCookie = async (cookies: Cookie | Cookie[]): Promise<any> => {
    // Ensure cookies is an array
    const config = useRuntimeConfig()
    const base_url = config.public.baseURL
    const cookieArray: Cookie[] = Array.isArray(cookies) ? cookies : [cookies];

    const response = await axios.post(`${base_url}/user/set-cookie`, cookieArray, {
        withCredentials: true,
    });

    return response.data;
};

/**
 * Retrieves cookie values from the server.
 *
 * @param {string | string[]} names - A single cookie name or an array of cookie names.
 * @returns {Promise<any>} An object containing all requested cookie values.
 */
export const getCookie = async (names: string | string[]): Promise<any> => {
    let response;

    if (Array.isArray(names)) {
        // For an array, join the names with a comma for the query string.
        const config = useRuntimeConfig()
        const base_url = config.public.baseURL
        const nameString = names.join(',');
        response = await axios.get(`${base_url}/user/get-cookie`, {
            params: { names: nameString },
            withCredentials: true,
        });
    } else {
        response = await axios.get(`${base_url}/user/get-cookie`, {
            params: { names },
        });
    }

    return response.data;
};

/**
 * Deletes specified cookies on the server.
 *
 * @param {string | string[]} names - A single cookie name or an array of cookie names to delete.
 * @returns {Promise<any>} The response data from the server.
 */
export const deleteCookie = async (names: string | string[]): Promise<any> => {
    const cookieNames: string[] = Array.isArray(names) ? names : [names];
    const config = useRuntimeConfig()
    const base_url = config.public.baseURL

    const response = await axios.delete(`${base_url}/user/delete-cookie`, {
        params: {
            name: cookieNames.join(','),
        },
        withCredentials: true,
    });

    return response.data;
};
