export const getIdFromUrl = () => {
    if (import.meta.client) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        console.log("parametar predlozak: ", id);
        if (id) {
            return id; // Vrati dešifrovanu vrednost
        }
    } else {
        console.warn("getIdFromUrl is called on the server side where window is not available.");
    }
    return null;
};
