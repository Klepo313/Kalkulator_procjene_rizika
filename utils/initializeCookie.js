const initializeCookie = async (name) => {
    try {
        const id = await getCookie(name);
        return id;
    } catch (error) {
        console.error("Error getting id-izracuna cookie", error);
        return null;
    }
}

export {
    initializeCookie
}