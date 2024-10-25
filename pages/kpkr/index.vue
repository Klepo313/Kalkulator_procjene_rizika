<template>
    <div>
        <div class="body">
            <header>
                <div class="image-container">
                    <img src="../../public/static/images/atd_solucije_iz.png" alt="logo" class="header-image"
                        @click="navigateTo('/')">
                </div>
                <button v-if="$route.path !== '/login'" class="logout" @click="doLogout">
                    <font-awesome-icon icon="arrow-right-from-bracket" class="logout-icon" />
                    Odjava
                </button>
            </header>

            <main>
                <div class="image-container">
                    <img src="../../public/static/images/KPKR_logo.svg" alt="logo">
                </div>
                <div class="main-container">
                    <div class="main-form">
                        <!-- <h2>Odaberi opciju</h2> -->
                        <div class="card-container">
                            <div class="card" @click="noviIzracun">
                                <font-awesome-icon icon="plus" />
                                <span>
                                    Novi predložak <br> izračuna
                                </span>
                            </div>
                            <div class="card" @click="navigateTo('/kpkr/predlosci')">
                                <font-awesome-icon icon="list-ul" />
                                <span>
                                    Prethodni <br> izračuni
                                </span>
                            </div>
                        </div>
                        <div class="download-container">
                            <font-awesome-icon icon="download" />
                            Upute za korištenje
                        </div>
                    </div>
                </div>
            </main>

            <FooterText class="footer-text" />
        </div>
    </div>
</template>


<script setup>
import { logout } from '~/service/logout';
import { useIzracunStore } from '#imports';

const izracunStore = useIzracunStore();

definePageMeta({
    middleware: [
        'auth'
    ],
    pageTransition: { name: 'slide', mode: 'out-in' }
});

const cookiesToDelete = [
    'scenarij',
    'id-izracuna',
    'vrsta-izracuna',
];

const noviIzracun = () => {
    izracunStore.updateIdIzracuna('/');
    navigateTo('/kpkr/predlozak');
};

const doLogout = async () => {
    await logout();
    navigateTo('/login');
};

onMounted(async () => {
    // const res = await initializeCookie(['username', 'surname']);
    // console.log("username: ", res['username'], "surname: ", res.surname);
    izracunStore.clearStore();
})

</script>

<style scoped>
.body {
    position: relative;
    width: 100%;
    height: 100dvh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 26px;
}

header .image-container {
    height: 37px;
}

.image-container img {
    width: 100%;
}

.header-image {
    height: 100%;
    /* Postavi visinu slike prema visini containera */
    width: auto;
    /* Zadrži omjer slike */
    object-fit: contain;
    /* Zadrži cijelu sliku unutar containera */
    cursor: pointer;
}

h2 {
    font-size: 20px;
}

main {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.main-container {
    width: 100%;
}

.main-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;

    padding: 26px;
    width: 100%;
}

.card-container {
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    padding: 20px;
    width: 100%;
    max-width: 210px;
    aspect-ratio: 1/1;

    background-color: var(--white-color);
    border: 1px solid rgb(20, 82, 28, 0.2);
    border-radius: var(--border-form-radius);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.card * {
    color: var(--primary-color);
    font-size: 16px;
    font-weight: 600;
    text-align: center;
}

.card:hover {
    background-color: var(--primary-color-focus);
    cursor: pointer;
}

.card:hover *,
.card:active * {
    color: white;
}

.card:active {
    background-color: var(--primary-color-hover);
}

.footer-text {
    position: absolute;
    bottom: 20px;
}

.download-container {
    padding: 0px 10px 5px 10px;
    border-bottom: 1px solid transparent;

    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.download-container:hover {
    color: var(--text-color);
    border-bottom: 1px solid var(--text-color);
    cursor: pointer;
}

.download-container:active {
    transform: translateY(1px);
    color: var(--primary-color);
    border-bottom: 1px solid var(--primary-color);
}

.logout {
    position: absolute;
    top: 26px;
    right: 26px;

    background: none;
    border: none;
    color: var(--red);
    font-weight: 600;
}

.logout:hover {
    background-color: rgb(227, 227, 227);
}

.logout:active {
    background-color: rgb(227, 227, 227);
}

.logout-icon,
.plus-icon {
    margin-right: 10px;
}
</style>