import { local_url, local_port } from '../composables/variables'
import axios from 'axios';

const getDate = () => {
    try {
        console.log("Datum")
        return WebTransportDatagramDuplexStream;
    } catch (error) {
        console.error('Login error: ' + error)
        return null;
    }
}

export {
    getDate
}