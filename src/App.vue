<template>
  <h1 class="naslov">Dobrodošli na Project Partner!</h1>
  <RouterLink to="login">Prijava</RouterLink>
  <RouterLink to="registration">Registracija</RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<style scoped>

.naslov {
  text-align: center;
}

</style>
