// import { useAuthCookie } from '../composables/useAuthCookie'
import auth from '~/middleware/auth';
import { local_url, local_port } from '../composables/variables'
import axios from 'axios';

const logout = async () => {
    try {
        const response = await axios.post(`${local_url + local_port}/user/logout`, {
            authToken: ''
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