import axios from "axios"
import { base_url } from "#imports";

const getSecKey = async () => {
    try {
        const response = await axios.get(`${base_url}/user/secKey`);
        return response.data.secretKey;
    } catch (error) {
        console.error('Error fetching secure data:', error);
    }
};

export {
    getSecKey,
}