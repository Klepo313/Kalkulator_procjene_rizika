<template>
    <div>
        <div class="body">
            <main>
                <div class="image-container">
                    <img src="../public/static/images/atd_solucije_iz.png" alt="atd_solucije_logo">
                </div>
                <form name="login-form" method="post" @submit.prevent="checkLogin" action="">
                    <div class="input-container">
                        <label for="username">Korisničko ime</label>
                        <input type="text" name="username" id="username" ref="usernameInput"
                            placeholder="Unesi korisničko ime" required>
                    </div>
                    <div class="input-container">
                        <label for="password">Lozinka</label>
                        <input type="password" name="password" id="password" ref="passwordInput"
                            placeholder="Unesi lozinku" required>
                    </div>
                    <button type="submit" id="loginBtn">
                        <span class="login-btn-text" ref="loginBtnText">Prijava</span>
                        <span ref="spinnerIcon" class="spin-icon">
                            <font-awesome-icon id="spin-icon" icon="spinner" spin />
                        </span>
                    </button>
                </form>

                <transition name="alert">
                    <div class="alert" v-if="showAlert" ref="alert">
                        <font-awesome-icon icon="info-circle" />
                        <span>Pogrešno korisničko ime ili lozinka</span>
                        <font-awesome-icon icon="xmark" size="xl" class="close-icon" @click="hideAlert" />
                    </div>
                </transition>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';
import { useUserStore } from '~/stores/main-store';
import { login } from '~/service/user/user';
// import { encryptCookie, decryptCookie } from '~/utils/cookieUtils';

definePageMeta({
    pageTransition: { name: 'slide', mode: 'out-in' }
});

const route = useRoute();

const userStore = useUserStore();
const authStore = useAuthStore();

const statusCode = ref(0);
const usernameInput = ref(null);
const passwordInput = ref(null);
const alert = ref(null);
const spinnerIcon = ref(null);
const loginBtnText = ref(null);

// State for showing/hiding the alert
const showAlert = ref(false);

onMounted(async () => {
    spinnerIcon.value.style.display = "none";
    loginBtnText.value.style.display = "inline";
});

const checkLogin = async () => {
    loginBtnText.value.style.display = "none";
    spinnerIcon.value.style.display = "inline";

    if (usernameInput.value.value && passwordInput.value.value) {
        // // console.log(usernameInput.value.value, passwordInput.value.value);
        const response = await login(usernameInput.value.value, passwordInput.value.value);

        statusCode.value = response.status;
        const isFirstLogin = response.isFirstLogin;

        if (statusCode.value == 200) {
            // // console.log("response login: ", response);

            userStore.updateAll({
                name: response.name,
                surname: response.surname,
                username: response.username,
                email: response.email,
                roles: response.roles,
            });

            userStore.isLoggedin = true;
            // authStore.userRoles = response.roles || [];
            authStore.exp = response.exp || 0;

            // ✅ Sada imamo sigurno učitane podatke i možemo raditi redirekciju
            if (isFirstLogin) {
                navigateTo('/user/change-password');
            } else {
                let redirectTo = route.query.redirectTo || '/';
                // // console.log("redirectTo: ", redirectTo);

                const userRoles = userStore.roles; // Sada je sigurno dohvaćen!
                let hasAccess = true;

                const accessRules = [
                    { path: "/kpkr", requiredRole: "AP001" },
                    { path: "/kesp", requiredRole: "AP002" },
                    { path: "/admin", requiredRolePrefix: "AD" }
                ];

                // Tražimo pravilo koje odgovara `redirectTo`
                const rule = accessRules.find(rule => redirectTo.startsWith(rule.path));

                if (rule) {
                    hasAccess = rule.requiredRole
                        ? userRoles.includes(rule.requiredRole)
                        : userRoles.some(role => role.startsWith(rule.requiredRolePrefix || ""));
                }

                // Ako korisnik nema pravo pristupa, preusmjeri ga na `/`
                if (!hasAccess) {
                    console.warn(`Korisnik nema pravo pristupa: ${redirectTo}, preusmjeravam na /`);
                    redirectTo = '/';
                }

                navigateTo(redirectTo);
            }
        } else {
            highlightBorders();
        }
    }
};

const highlightBorders = () => {
    // Provjerite da su `ref` objekti inicijalizirani prije nego što pristupite njihovim stilovima
    showAlert.value = true;
    usernameInput.value.style.border = '3px solid var(--red) !important';
    passwordInput.value.style.border = '3px solid red';

    setTimeout(() => {
        if (usernameInput.value && passwordInput.value && alert.value) {
            usernameInput.value.style.border = '';  // Revert to default
            passwordInput.value.style.border = '';  // Revert to default
            loginBtnText.value.style.display = "inline";
            spinnerIcon.value.style.display = "none";
        }
        // showAlert.value = false;
    }, 3000);  // 3000 milliseconds = 3 seconds

}

const hideAlert = () => {
    showAlert.value = false; // Manually hide the alert
}
</script>


<style scoped>
.body {
    width: 100%;
    height: 100dvh;

    display: flex;
    align-items: center;
    justify-content: center;
}

.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    padding: 26px;
    width: 100%;
}

.image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.image-container img {
    width: 60%;
}

main {
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: space-between;
    gap: 40px;
}

h2 {
    font-size: 20px;
}

input,
textarea {
    height: 38px;
    width: 100%;
    background-color: var(--input-color);
    border: var(--border);
    padding: 0px 20px;
    border-radius: var(--border-form-radius);
}

input:hover,
textarea:hover {
    background-color: var(--input-hover-color);
    border-color: var(--primary-color);
    outline: none;
}

input:focus,
textarea:focus {
    background-color: var(--input-focus-color) !important;
    border-color: var(--primary-color) !important;
    outline: none;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.spin-icon {
    display: none;
}

.alert {
    position: absolute;
    font-size: 16px;
    font-weight: bold;

    background-color: var(--red);
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    width: 100%;
    height: 60px;

    top: 0px;
    left: 0px;

    /* display: none; */
}

.close-icon {
    position: absolute;
    right: 24px;
    cursor: pointer;
}

.close-icon:hover {
    transform: scale(0.9);
    opacity: 0.8;
}

.close-icon:active {
    transform: scale(1.1);
}

/* Transition classes for alert */
.alert-enter-active,
.alert-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}

.alert-enter-from,
.alert-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.alert-enter-to,
.alert-leave-from {
    transform: translateY(0);
    opacity: 1;
}
</style>