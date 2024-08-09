<template>
    <div>
        <div class="body">
            <main>
                <div class="image-container">
                    <img src="../images/KPR_full_logo.svg" alt="" srcset="">
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
import { login } from '@/service/login'

const statusCode = ref(0);

const usernameInput = ref(null);
const passwordInput = ref(null);
const alert = ref(null);
const spinnerIcon = ref(null);
const loginBtnText = ref(null);

// State for showing/hiding the alert
const showAlert = ref(false);

onMounted(() => {
    spinnerIcon.value.style.display = "none";
    loginBtnText.value.style.display = "inline";
});

const checkLogin = async () => {
    if (usernameInput.value.value && passwordInput.value.value) {
        statusCode.value = await login(usernameInput.value.value, passwordInput.value.value);

        loginBtnText.value.style.display = "none";
        spinnerIcon.value.style.display = "inline";

        if (statusCode.value == 200) {
            navigateTo('/predlosci');
        } else {
            highlightBorders();
        }
    }

}

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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100dvh;
}

main {
    width: 365px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: space-between;
    gap: 40px;
}

.image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

form {
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