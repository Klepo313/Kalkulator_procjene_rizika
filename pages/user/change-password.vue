<template>
    <div class="body">
        <Toast />
        <button class="logout" @click="doLogout">
            <font-awesome-icon icon="arrow-right-from-bracket" class="logout-icon" />
            Odjava
        </button>
        <main>
            <div>
                <h1>Postavi novu lozinku</h1>
                <p>Postavi novu lozinku koju ćeš koristiti za prijavu u aplikaciju.</p>
            </div>
            <Form v-slot="$form" :initialValues="initialValues" :resolver="formResolver" @submit="onFormSubmit"
                class="form">
                <div class="field">
                    <label for="oldPassword" class="label">Stara lozinka</label>
                    <Password v-model="oldPassword" name="oldPassword" placeholder="Unesi staru lozinku"
                        :feedback="false" toggle-mask fluid />
                    <Message v-if="$form.oldPassword?.invalid" severity="error" size="small" variant="simple">
                        <ul class="my-0 px-4 flex flex-col gap-1">
                            <li v-for="(error, index) of $form.oldPassword.errors" :key="index">
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </div>
                <hr style="margin: 13px 0px; width: 100%;">
                <div class="field">
                    <label for="password" class="label">Lozinka</label>
                    <Password v-model="password" name="password" placeholder="Unesi lozinku" :feedback="false"
                        toggleMask fluid />
                    <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                        <ul class="my-0 px-4 flex flex-col gap-1">
                            <li v-for="(error, index) in $form.password.errors" :key="index"
                                class="flex items-center gap-2">
                                <font-awesome-icon icon="key" :class="{
                                    'text-red-500': error.severity === 'error',
                                    'text-yellow-500': error.severity === 'warn',
                                    'text-gray-500': error.severity === 'secondary'
                                }" />
                                <span :class="{
                                    'text-red-500': error.severity === 'error',
                                    'text-yellow-500': error.severity === 'warn',
                                    'text-gray-500': error.severity === 'secondary'
                                }" style="margin-left: 5px;">
                                    {{ error.message }}
                                </span>
                            </li>
                        </ul>
                    </Message>
                </div>
                <div class="field">
                    <label for="passwordRepeat" class="label">Ponovljena lozinka</label>
                    <Password v-model="passwordRepeat" name="passwordRepeat" placeholder="Ponovno unesi lozinku"
                        :feedback="false" toggle-mask fluid />
                    <Message v-if="$form.passwordRepeat?.invalid" severity="error" size="small" variant="simple">
                        <ul class="my-0 px-4 flex flex-col gap-1">
                            <li v-for="(error, index) of $form.passwordRepeat.errors" :key="index">
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </div>
                <button type="submit">
                    <font-awesome-icon v-if="loading" icon="spinner" spin />
                    <template v-else>
                        Spremi lozinku
                    </template>
                </button>
            </Form>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { logout, updatePassword } from '~/service/user/user';

const oldPassword = ref('');
const password = ref('');
const passwordRepeat = ref('');

const toast = useToast();

const initialValues = reactive({
    password: '',
    passwordRepeat: '',
});

const loading = ref(false);

const resolver = z
    .object({
        oldPassword: z.string().min(1, { message: 'Lozinka mora biti popunjena.' }),
        password: z
            .string()
            .min(8, { message: 'Lozinka mora sadržavati barem 8 znakova.' })
            .max(16, { message: 'Lozinka mora sadržavati najviše 16 znakova.' })
            .refine((value) => /[a-z]/.test(value), {
                message: 'Lozinka mora sadržavati barem jedno malo slovo.',
            })
            .refine((value) => /[A-Z]/.test(value), {
                message: 'Lozinka mora sadržavati barem jedno veliko slovo.',
            })
            .refine((value) => /\d/.test(value), {
                message: 'Lozinka mora sadržavati barem jedan broj.',
            })
            .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
                message: 'Lozinka mora sadržavati barem jedan specijalni znak.',
            }),
        passwordRepeat: z.string().min(0, { message: 'Lozinke se moraju podudarati.' }),
    })
    .refine(
        (data) => data.password === data.passwordRepeat,
        { message: 'Lozinke se moraju podudarati.', path: ['passwordRepeat'] }
    );


const formResolver = zodResolver(resolver);

const showSuccess = () => toast.add({ severity: 'success', summary: 'Uspješno promjenjena lozinka', life: 3000 });

const showError = (message) => toast.add({ severity: 'error', summary: 'Greška pri promjeni lozinke', detail: message, life: 3000 });

const onFormSubmit = async ({ valid }) => {
    if (valid) {
        // console.log("Forma je validna i podaci su spremljeni.")
        loading.value = true;

        const data = {
            oldPassword: oldPassword.value,
            newPassword: passwordRepeat.value
        }
        try {
            const response = await updatePassword(data);
            if (response.status == 200) {
                showSuccess();
            }
            // else {
            //     showError(resError);
            // }
        } catch (error) {
            // console.error("Greška pri promjeni lozinke: ", error?.response?.data?.message);
            showError(error?.response?.data?.message);
        } finally {
            loading.value = false;
        }

        // console.log("Lozinke: ", data);
        navigateTo('/');

    } else {
        // console.error("Forma nije validna.")
    }
}

const doLogout = async () => {
    await logout(); reloadNuxtApp();
    navigateTo('/login');
};
</script>

<style scoped>
.body {
    height: 100dvh;
    background-color: white;
}

.body,
main,
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 26px;
}

main {
    padding: 26px 0px;
    gap: 26px;
}

main>div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

h1 {
    border-bottom: none;
    text-align: center;
    padding: 0;
}

.form {
    width: 100%;
    gap: 13px;
    border-radius: 5px;
    border: var(--border);
    background-color: var(--bg);
}

.form>div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field {
    width: 100%;
}

.logout {
    position: absolute;
    top: 26px;
    right: 26px;

    background: none;
    border: none;
    color: var(--red);
    font-weight: 600;
    width: auto;
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

button[type="submit"] {
    width: 100%;
    background-color: var(--text-color);
    color: white;
}

button[type="submit"]:hover {
    background-color: var(--text-color-hover);
}

button[type="submit"]:active {
    background-color: var(--text-color-focus);
}

ul {
    list-style-position: inside;
    list-style-type: none;
    margin: 0;
}

.text-red-500 {
    color: red;
}

.text-yellow-500 {
    color: rgb(209, 183, 34);
}

.text-gray-500 {
    color: gray;
}
</style>