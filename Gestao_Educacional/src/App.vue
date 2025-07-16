<template>
  <div class="container-xxl position-relative bg-white d-flex p-0">
    <!-- Spinner Start -->
    <div
      v-if="loading"
      id="spinner"
      class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <!-- Spinner End -->

    <!-- Não mostrar a sidebar nas páginas de login e signup -->
    <Sidebar v-if="!isAuthPage" />

    <!-- Content Start -->
    <div class="content" :class="{ 'w-100 m-0': isAuthPage }">
      <RouterView />

      <!-- Footer Start -->
      <div v-if="!isAuthPage" class="container-fluid pt-4 px-4">
        <div class="bg-light rounded-top p-4">
          <div class="row">
            <div class="col-12 col-sm-6 text-center text-sm-start">
              &copy; <a href="#">Sonho</a>, Todos os direitos reservados.
            </div>
            <div class="col-12 col-sm-6 text-center text-sm-end">
              Desenvolvido por <a href="#">Sua Equipe</a>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer End -->
    </div>
    <!-- Content End -->

    <!-- Back to Top -->
    <a v-if="!isAuthPage" href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"
      ><i class="bi bi-arrow-up"></i
    ></a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const loading = ref(true)
const route = useRoute()

// Verificar se estamos em uma página de autenticação (login ou signup)
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/singup'
})

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)
})
</script>
