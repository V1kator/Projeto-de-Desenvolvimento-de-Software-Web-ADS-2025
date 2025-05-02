
<template>
  <div class="container-xxl position-relative bg-white d-flex p-0">
    <RouterLink to="/chamada">Sonho</RouterLink>
    <RouterView />
    <SignIn />
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Spinner from './components/Spinner.vue'
import Login from './views/Login.vue'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)
})
</script>

