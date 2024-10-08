export default defineEventHandler((event) => {
    const config = useRuntimeConfig();

    // Pristupiš SECRET_KEY iz runtimeConfig
    const secretKey = config.secretKey;
    console.log('Secret key from config:', secretKey);


    // Iskoristi SECRET_KEY u logici (na primer, za autentifikaciju ili slanje zahteva)
    if (!secretKey) {
        throw new Error('Secret key not found!');
    }

    // Simulacija nekog podatka koji koristi tajni ključ
    return {
        message: 'Secure data accessed successfully',
        keyUsed: secretKey,
    };
});
