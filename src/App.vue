<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <h1 class="naslov">Dobrodošli na Project Partner!</h1>
  <RouterLink to="login">Prijava</RouterLink>
  <RouterLink to="registration">Registracija</RouterLink>
</template>

<style scoped>

.naslov {
  text-align: center;
}

</style>
