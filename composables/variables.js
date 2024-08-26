const local_url = 'http://localhost:'
const local_port = 4000
const public_url = 'https://{PUBLIC_KEY}:'
const public_port = 4000

const isDev = process.env.NODE_ENV === 'development';
const base_url = isDev
    ? `http://localhost:4000`
    : `https://${process.env.BASE_URL}`;

export {
    local_url,
    local_port,
    public_url,
    public_port,
    base_url
}