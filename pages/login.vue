<template>
  <div>
    <Toast />
    <div class="body">
      <main>
        <div class="image-container">
          <img
            src="../public/static/images/atd_solucije_iz.png"
            alt="atd_solucije_logo"
          />
        </div>
        <!-- <form
          name="login-form"
          method="post"
          @submit.prevent="checkLogin"
          action=""
        >
          <div class="input-container">
            <label for="username">Korisničko ime</label>
            <input
              type="text"
              name="username"
              id="username"
              ref="usernameInput"
              placeholder="Unesi korisničko ime"
              required
            />
          </div>
          <div class="input-container">
            <label for="password">Lozinka</label>
            <input
              type="password"
              name="password"
              id="password"
              ref="passwordInput"
              placeholder="Unesi lozinku"
              required
            />
          </div>
          <button type="submit" id="loginBtn">
            <span class="login-btn-text" ref="loginBtnText">Prijava</span>
            <span ref="spinnerIcon" class="spin-icon">
              <font-awesome-icon id="spin-icon" icon="spinner" spin />
            </span>
          </button>
        </form> -->

        <Form
          v-slot="$form"
          :resolver="resolver"
          :initial-values="initialValues"
          class="p-fluid"
          @submit="handleLogin"
        >
          <div class="input-container">
            <label for="username">Korisničko ime</label>
            <InputText
              v-model="username"
              name="username"
              id="username"
              placeholder="Unesi korisničko ime"
            />
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
              :feedback="false"
            />
            <!-- <InputText
              v-model="password"
              type="password"
              name="password"
              id="password"
              placeholder="Unesi lozinku"
              required
            /> -->
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
            :disabled="disableLoginButton"
          >
            <!-- Prikazuje se tekst "Prijava" ako se ne učitava, a spinner ako se učitava -->
            <span v-if="!loading" class="login-btn-text">Prijava</span>
            <span v-if="loading" class="spin-icon">
              <font-awesome-icon icon="spinner" spin />
            </span>
          </Button>
        </Form>

        <!-- <transition name="alert">
          <div class="alert" v-if="showAlert" ref="alert">
            <font-awesome-icon icon="info-circle" />
            <span>Pogrešno korisničko ime ili lozinka</span>
            <font-awesome-icon
              icon="xmark"
              size="xl"
              class="close-icon"
              @click="hideAlert"
            />
          </div>
        </transition> -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
const toast = useToast();

const userStore = useUserStore();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
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

const handleLogin = async ({ valid }) => {
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

// const highlightBorders = () => {
//   // Provjerite da su `ref` objekti inicijalizirani prije nego što pristupite njihovim stilovima
//   showAlert.value = true;
//   usernameInput.value.style.border = "3px solid var(--red) !important";
//   passwordInput.value.style.border = "3px solid red";

//   setTimeout(() => {
//     if (usernameInput.value && passwordInput.value && alert.value) {
//       usernameInput.value.style.border = ""; // Revert to default
//       passwordInput.value.style.border = ""; // Revert to default
//       loginBtnText.value.style.display = "inline";
//       spinnerIcon.value.style.display = "none";
//     }
//     // showAlert.value = false;
//   }, 3000); // 3000 milliseconds = 3 seconds
// };
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
  background-color: var(--input-color) !important;
  border: var(--border);
  padding: 0px 20px;
  border-radius: var(--border-form-radius);
}

input:hover {
  background-color: var(--input-hover-color);
  border-color: var(--primary-color);
  outline: none;
}

input:focus {
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
