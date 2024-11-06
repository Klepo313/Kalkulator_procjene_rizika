import { base_url } from '../composables/variables'
import axios from 'axios';

const logout = async () => {
    try {
        const response = await axios.post(`${base_url}/user/logout`, {
            authToken: '',
            csrfToken: ''
        }, {
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.status;
    } catch (error) {
        console.error('Logout error: ' + error)
        return 0;
    }

}

export {
    logout,
}