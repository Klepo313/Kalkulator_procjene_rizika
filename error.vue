<template>
  <div class="error-container">
    <h1 class="error-code">
      <span>4</span>
      <span>0</span>
      <span>4</span>
    </h1>
    <div class="error-text">
      <h2>ups! stranica na postoji.</h2>
      <p>Žao nam je, ali stranica koju tražite ne postoji.</p>
    </div>
    <div class="error-btn">
      <button type="button" @click="goBack">
        <font-awesome-icon icon="arrow-left-long" />
        Prethodna stranica
      </button>

      <!-- <nuxt-link :to="history.back()">
        <button type="button">
          <font-awesome-icon icon="arrow-left-long" />
          Prethodna stranica
        </button>
      </nuxt-link> -->
    </div>
  </div>
</template>

<script setup>
// Script setup dio je trenutno prazan, možeš ga koristiti po potrebi.
const goBack = () => {
  try {
    history.back();
  } catch (error) {
    navigateTo("/");
  }
};
</script>

<style>
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
  margin: 0;
}

.error-code {
  letter-spacing: -1.4rem;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.5rem;
}

/* Primjena bijelog drop shadowa na svaku znamenku */
.error-code span {
  line-height: 1;
  color: var(--text-color);
  font-size: 10rem;
  font-weight: bolder;
  /* text-shadow: horizontalni offset, vertikalni offset, blur radius, boja; */
  text-shadow: -3px 0px 0px rgba(255, 255, 255, 1);
}

.error-text,
.error-btn {
  text-align: center;
  margin-top: 1rem;
}

.error-text h2 {
  margin: 0;
  font-size: 2rem;
  text-transform: uppercase;
  color: var(--text-color);
}

.error-text p {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  color: #777;
}

.error-btn button {
  background-color: var(--text-color);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}
</style>
