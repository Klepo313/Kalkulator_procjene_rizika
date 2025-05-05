<template>
  <div>
    <Toast />
    <div class="body">
      <main>
        <div class="image-container">
          <img src="../public/static/images/atd_solucije_iz.png" alt="logo" />
        </div>
        <Form
          v-slot="$form"
          :resolver="resolver"
          :initial-values="initialValues"
          class="p-fluid"
          @submit="handleLogin">
          <div class="input-container">
            <label for="username">Korisničko ime</label>
            <InputText
              v-model="username"
              name="username"
              id="username"
              placeholder="Unesi korisničko ime" />
            <Message
              v-if="$form.username?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.username.error.message }}</Message
            >
          </div>
          <div class="input-container">
            <label for="password">Lozinka</label>
            <InputText
              v-model="password"
              type="password"
              name="password"
              id="password"
              placeholder="Unesi lozinku"
              :feedback="false" />
            <Message
              v-if="$form.password?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.password.error.message }}</Message
            >
          </div>
          <Button
            type="submit"
            class="p-button p-component p-login"
            :disabled="disableLoginButton">
            <span v-if="!loading" class="login-btn-text">Prijava</span>
            <span v-if="loading" class="spin-icon">
              <font-awesome-icon icon="spinner" spin />
            </span>
          </Button>
        </Form>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { navigateTo } from "#app";
import { useUserStore } from "~/stores/main-store";
import { login } from "~/service/user/user";
import InputText from "primevue/inputtext";
// import { encryptCookie, decryptCookie } from '~/utils/cookieUtils';

definePageMeta({
  pageTransition: { name: "slide", mode: "out-in" },
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const userStore = useUserStore();
const authStore = useAuthStore();
const logoStore = useLogoStore();

const username = ref<string>("");
const password = ref<string>("");
const initialValues = ref({
  username: "",
  password: "",
});
const resolver = ref(
  zodResolver(
    z.object({
      username: z.string().min(1, { message: "Korisničko ime je obavezno" }),
      password: z.string().min(1, { message: "Lozinka je obavezna" }),
    })
  )
);

// Varijabla koja kontrolira prikaz spinnere ikone
const loading = ref(false);
const disableLoginButton = ref(false);

const handleLogin = async ({ valid }: { valid: boolean }) => {
  // Provjeravamo da su uneseni username i password
  if (valid) {
    loading.value = true;
    try {
      const response = await login(username.value, password.value);

      if (response.status === 200) {
        // Ažuriramo podatke korisnika
        userStore.updateAll({
          name: response.name,
          surname: response.surname,
          username: response.username,
          email: response.email,
          roles: response.roles,
        });
        userStore.isLoggedin = true;
        authStore.exp = response.exp || 0;

        // Toast poruka za uspješnu prijavu
        toast.add({
          severity: "success",
          summary: "Uspješna prijava",
          detail: `Korisnik ${
            response.name + " " + response.surname
          } uspješno prijavljen`,
          life: 3000,
        });

        disableLoginButton.value = true;
        logoStore.fetchLogos();

        if (response.isFirstLogin) {
          navigateTo("/user/change-password");
        } else {
          let redirectTo = route.query.redirectTo || "/";
          const userRoles = userStore.roles;
          let hasAccess = true;
          const accessRules = [
            { path: "/kpkr", requiredRole: "AP001" },
            { path: "/kesp", requiredRole: "AP002" },
            { path: "/admin", requiredRolePrefix: "AD" },
          ];

          const rule = accessRules.find((rule) =>
            redirectTo.startsWith(rule.path)
          );
          if (rule) {
            hasAccess = rule.requiredRole
              ? userRoles.includes(rule.requiredRole)
              : userRoles.some((role) =>
                  role.startsWith(rule.requiredRolePrefix || "")
                );
          }
          if (!hasAccess) {
            // console.warn(
            //   `Korisnik nema pravo pristupa: ${redirectTo}, preusmjeravam na /`
            // );
            redirectTo = "/";
          }
          navigateTo(redirectTo);
        }
      } else {
        console.log(response);
        const message = response?.response?.data?.message;
        // Ako prijava nije uspješna, prikaži toast s porukom iz response-a
        toast.add({
          severity: "error",
          summary: "Neuspješna prijava",
          detail:
            message === "Invalid username or password."
              ? "Pogrešno korisničko ime ili lozinka."
              : message,
          life: 6000,
        });
      }
    } catch (error) {
      //   console.log(error);
      toast.add({
        severity: "error",
        summary: "Greška",
        detail: error.message || "Došlo je do greške prilikom prijave",
        life: 3000,
      });
    } finally {
      loading.value = false;
    }
  } else {
    // console.error("Form is not valid");
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: "Nisu uneseni svi podaci",
      life: 3000,
    });
  }
};
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

input {
  height: 38px;
  width: 100%;
  background-color: var(--input-admin-color);
  border: var(--border);
  padding: 0px 20px;
  border-radius: var(--border-form-radius);
}

input:hover {
  background-color: var(--input-admin-hover-color);
  border-color: var(--input-admin-color);
  outline: none;
}

input:focus {
  background-color: var(--input-admin-focus-color) !important;
  border-color: var(--border) !important;
  outline: none;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.p-login {
  background-color: var(--text-color);
  border: none !important;
  cursor: pointer;
}

.p-login:hover {
  background-color: var(--text-color-hover) !important;
}

.p-login:active {
  background-color: var(--text-color-focus) !important;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
