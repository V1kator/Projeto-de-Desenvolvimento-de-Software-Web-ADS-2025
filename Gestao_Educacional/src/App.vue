<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container-xxl position-relative bg-white d-flex p-0">
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <RouterView />
  </div>

</template>

