<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>

const title = ref('Kalkulator procjene rizika')
const description = ref('Kalkulator procjene rizika')

useHead({
  title,
  meta: [{
    name: 'description',
    content: description
  }]
})

const accessToken = useCookie('accessToken', {
  maxAge: 60 * 60 * 24 * 7, // Cookie will expire in 7 days
  path: '/', // Cookie available throughout the app
  secure: process.env.ENVIRONMENT === 'PRODUCTION', // Secure cookies in production // true, //process.env.ENVIRONMENT === 'PRODUCTION', // Secure cookies in production
  sameSite: process.env.ENVIRONMENT === 'PRODUCTION' ? 'None' : 'Lax', // Use 'None' only in production
});
accessToken.value = '/';

</script>