export const navigateWithParameter = async (endpoint, paramType, paramValue) => {

    if (!endpoint) throw new Error('Endpoint is required');
    if (!paramType || !paramValue) throw new Error('Parameter type and value are required');

    // console.log("Navigacija sa parametrima: ", paramType, paramValue, endpoint);

    const url = `${endpoint}?${paramType}=${paramValue}`;
    // console.log("url: " + url);

    // Navigacija sa 'replace' kako bi se izbeglo dupliranje rute u istoriji
    await navigateTo(url, { replace: true });
}