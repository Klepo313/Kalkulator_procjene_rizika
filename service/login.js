// import { useAuthCookie } from '../composables/useAuthCookie'
import { local_url, local_port } from '../composables/variables'
import axios from 'axios';

const login = async (username, password) => {
    try {
        const response = await axios.post(`${local_url + local_port}/user/login`, {
            username: username,
            password: password
        }, {
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("status: ", response.status)

        return response.status;
    } catch (error) {
        console.error('Login error: ' + error)
        return 0;
    }

}

export {
    login,

}