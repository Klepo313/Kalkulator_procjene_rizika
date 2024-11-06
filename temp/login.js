// import { useAuthCookie } from '../composables/useAuthCookie'
import { base_url } from '../composables/variables'
import axios from 'axios';

const login = async (username, password) => {
    try {
        const response = await axios.post(`${base_url}/user/login`, {
            username: username,
            password: password
        }, {
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return {
            status: response.status,
            username: response.data.userName,
            name: response.data.name,
            surname: response.data.surname,
            email: response.data.email,
            roles: response.data.roles,
        };
    } catch (error) {
        console.error('Login error: ' + error)
        return 0;
    }

}

export {
    login,

}