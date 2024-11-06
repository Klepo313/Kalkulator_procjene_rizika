import axios from "axios"
import { base_url } from "#imports";

const getSecKey = async () => {
    try {
        const response = await axios.get(`/api/secureData`);
        // console.log("Response key:", response.data);
        return response.data.keyUsed;
        // return response.data.secretKey;
    } catch (error) {
        console.error('Error fetching secure data:', error);
    }
};

export {
    getSecKey,
}