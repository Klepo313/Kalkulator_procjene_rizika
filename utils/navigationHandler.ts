
/**
 * Navigates to the specified endpoint with a query parameter.
 *
 * @param {string} endpoint - The base URL or endpoint to navigate to.
 * @param {string} paramType - The query parameter key.
 * @param {string} paramValue - The query parameter value.
 * @returns {Promise<void>} A promise that resolves once the navigation has been triggered.
 * @throws Will throw an error if the endpoint or parameter values are not provided.
 */
export const navigateWithParameter = async (
    endpoint: string,
    paramType: string,
    paramValue: string
): Promise<void> => {
    if (!endpoint) throw new Error('Endpoint is required');
    if (!paramType || !paramValue) throw new Error('Parameter type and value are required');

    // console.log("Navigacija sa parametrima: ", paramType, paramValue, endpoint);
    const url = `${endpoint}?${paramType}=${paramValue}`;
    // console.log("url: " + url);

    // Navigates using 'replace' to avoid duplicating the route in the history.
    await navigateTo(url, { replace: true });
};

/**
 * Retrieves the 'id' query parameter from the current URL.
 *
 * @returns {string | null} The value of the 'id' parameter if present and valid; otherwise, null.
 */
export const getIdFromUrl = (): string | null => {
    if (import.meta.client) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        // console.log("parametar predlozak: ", id);
        if (typeof id === 'string' && id !== 'null') {
            return id;
        }
    } else {
        console.warn("getIdFromUrl is called on the server side where window is not available.");
    }
    return null;
};
