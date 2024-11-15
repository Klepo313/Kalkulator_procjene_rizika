export const getIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("parametar predlozak: ", id);
    if (id) {
        return id; // Vrati dešifrovanu vrednost
    }
    return null;
};