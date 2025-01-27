<template>
  <div>
    <NuxtLoadingIndicator class="indicator" />
    <NuxtPage class="page" />
    <div class="screen-size">
      <div>
        <font-awesome-icon icon="desktop" size="3xl" />
        <h1>Aplikacija nije podržana za rad na mobilnim i tablet uređajima.</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref('Kalkulator procjene klimatskih rizika')
const description = ref('ATD Solucije')

useHead({
  title,
  meta: [{
    name: 'description',
    content: description
  }]
})

</script>

<style scoped>
h2 {
  font-size: 1.3rem;
  border-bottom: var(--border);
}

p {
  font-size: 16px
}

.extendSession {
  z-index: 99;
  position: fixed;
  overflow: hidden;

  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  padding: 13px;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
}

.expand-content {
  width: 100%;
  max-width: 500px;
  max-height: calc(100dvh - 26px - 39px);
  padding: 26px 39px;
  overflow-y: auto;

  background-color: white;
  border-radius: 5px;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.odjava {
  background: none;
  color: var(--text-color);
  padding: 0;
  width: auto;
  height: auto;
}

.odjava:hover {
  text-decoration: underline;
}

.screen-size {
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  padding: 26px;
  text-align: center;
  color: #000;
}

.screen-size * {
  font-size: 1.2rem;
}

@media screen and (max-width: 1120px) {

  .indicator,
  .page {
    display: none;
  }

  .screen-size {
    display: flex;
  }

}
</style>