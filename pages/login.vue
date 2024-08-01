<template>
    <div>
        <div class="body">
            <main>
                <div class="image-container">
                    <img src="../images/KPR_full_logo.svg" alt="" srcset="">
                </div>
                <form>
                    <div class="input-container">
                        <label for="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Unesi email" required>
                    </div>
                    <div class="input-container">
                        <label for="password">Lozinka</label>
                        <input type="password" name="password" id="password" placeholder="Unesi lozinku" required>
                    </div>
                    <button type="button" id="loginBtn" @click="toDashboard">Prijava</button>
                </form>
            </main>
        </div>
    </div>
</template>

<script setup>
import { navigateTo } from '#app';

const toDashboard = () => {
    navigateTo('/');
};
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
</style>