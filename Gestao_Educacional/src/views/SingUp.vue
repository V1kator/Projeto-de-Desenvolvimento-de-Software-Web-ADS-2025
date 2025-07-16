<template>
  <div class="container-fluid">
    <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh;">
      <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
        <div class="bg-light rounded p-4 p-sm-5 my-4 mx-3">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <a href="/" class="">
              <h3 class="text-primary"><i class="fa fa-hashtag me-2"></i>Sonho</h3>
            </a>
            <h3>Sign Up</h3>
          </div>
          <div class="form-floating mb-3">
            <input
              v-model="username"
              type="text"
              class="form-control"
              id="floatingText"
              placeholder="Username"
            >
            <label for="floatingText">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="Email address"
            >
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating mb-4">
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
            >
            <label for="floatingPassword">Password</label>
          </div>
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="form-check">
              <input
                v-model="agreeTerms"
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
              >
              <label class="form-check-label" for="exampleCheck1">I agree to terms</label>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-primary py-3 w-100 mb-4"
            @click="handleSignUp"
          >
            Sign Up
          </button>
          <p class="text-center mb-0">Already have an Account? <router-link to="/login">Sign In</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Referências para os campos do formulário
const username = ref('')
const email = ref('')
const password = ref('')
const agreeTerms = ref(false)

// Obter o router
const router = useRouter()

// Função para lidar com o cadastro
const handleSignUp = () => {
  // Validação básica dos campos
  if (!username.value || !email.value || !password.value) {
    alert('Por favor, preencha todos os campos')
    return
  }

  // Verificar se o usuário concordou com os termos
  if (!agreeTerms.value) {
    alert('Você precisa concordar com os termos para continuar')
    return
  }

  // Em um caso real, você enviaria os dados para o backend para criar o usuário
  // Aqui estamos apenas simulando o cadastro bem-sucedido

  // Armazenar informações do usuário (apenas para demonstração)
  localStorage.setItem('username', username.value)
  localStorage.setItem('userEmail', email.value)

  // Navegar para a página de chamada após o cadastro bem-sucedido
  router.push('/chamada')
}
</script>
