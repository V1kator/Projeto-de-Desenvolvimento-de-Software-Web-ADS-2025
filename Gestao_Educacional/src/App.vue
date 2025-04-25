<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container-xxl position-relative bg-white d-flex p-0">
    <RouterLink to="/chamada">Chamada</RouterLink>
    <RouterView />
  </div>

</template>

