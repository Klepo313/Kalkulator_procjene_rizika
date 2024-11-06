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

const checkLogin = async () => {
    try {
        const url = `${base_url}/user/is_loggedin`;

        const response = await axios.get(url, {
            withCredentials: true,
        });

        console.log("Logiran? ", response.data.isLoggedin, response.status);

        // Ako je status 200, vraćamo isLoggedin vrijednost
        if (response.status == 200) {
            return response.data.isLoggedin;
        } else {
            return false;
        }

    } catch (error) {
        // Ako se dogodi neka druga greška (npr. mrežna greška), vraćamo 0
        console.error('Greška pri provjeri logiranja: ' + error);
        return 0;
    }
};

const refresh_token = async () => {
    try {
        const response = await axios.post(`${base_url}/user/refresh_token`, {
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.status;
    } catch (error) {
        console.error('Refresh token error: ' + error);
        return 0;
    }
}

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
    login,
    logout,
    checkLogin,
    refresh_token,
    getSecKey
}