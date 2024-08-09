<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { useNuxtApp } from '#app';
import { defineNuxtRouteMiddleware } from '#imports';

const title = ref('Kalkulator procjene rizika')
const description = ref('Kalkulator procjene rizika')

useHead({
  title,
  meta: [{
    name: 'description',
    content: description
  }]
})

</script>