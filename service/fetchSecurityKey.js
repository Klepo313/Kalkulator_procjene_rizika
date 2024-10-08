import axios from "axios"

const getSecKey = async () => {
    try {
        const response = await axios.get('/api/secureData');
        return response.data.keyUsed;
    } catch (error) {
        console.error('Error fetching secure data:', error);
    }
};

export {
    getSecKey,
}