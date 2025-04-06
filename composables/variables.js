const local_url = 'http://localhost:'
const local_port = 4000
const public_url = 'https://{PUBLIC_KEY}:'
const public_port = 4000

// const config = useRuntimeConfig();
// const baseUrl = config.public.baseURL;

//cconsole.log("mode: ", process.env.NODE_ENV)

const isDev = process.env.NODE_ENV === 'development';
// const base_url = baseUrl;
const base_url = isDev
    ? `http://localhost:4000`
    : `https://cadastre-server-mz7l.onrender.com` //`https://cadastre-server-1.onrender.com/` //`https://cadastre-server-1.onrender.com` //VUE-produkcija: `https://cadastre-server-mz7l.onrender.com` // `https://cadastre-server.onrender.com`;

// TEST (sa Starter planom): https://cadastre-server-mz7l.onrender.com
// PROD : https://cadastre-server-1.onrender.com

export {
    local_url,
    local_port,
    public_url,
    public_port,
    base_url
}