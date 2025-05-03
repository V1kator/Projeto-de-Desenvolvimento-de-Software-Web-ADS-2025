<template>
  <div class="container-fluid">
    <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh">
      <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
        <div class="bg-light rounded p-4 p-sm-5 my-4 mx-3">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <a href="/" class="">
              <h3 class="text-primary"><i class="fa fa-hashtag me-2"></i>Sonho</h3>
            </a>
            <h3>Sign In</h3>
          </div>
          <div class="form-floating mb-3">
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="Email address"
            />
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating mb-4">
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label for="floatingPassword">Password</label>
          </div>
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="form-check">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
              />
              <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <a href="">Forgot Password</a>
          </div>
          <button type="submit" class="btn btn-primary py-3 w-100 mb-4" @click="handleLogin">
            Sign In
          </button>
          <p class="text-center mb-0">
            Don't have an Account? <router-link to="/singup">Sign Up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Referências para os campos do formulário
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Obter o router
const router = useRouter()

// Função para lidar com o login
const handleLogin = () => {
  // Aqui você pode adicionar a lógica de validação e autenticação
  // Por exemplo, verificar se email e senha estão preenchidos
  if (email.value && password.value) {
    // Em um caso real, você faria uma chamada à API para autenticar o usuário
    // Por enquanto, vamos apenas navegar para a página de chamada

    // Armazenar informações de login se "Remember Me" estiver marcado
    if (rememberMe.value) {
      localStorage.setItem('userEmail', email.value)
      // Não armazene senhas no localStorage em produção!
      // Isso é apenas para demonstração
    }

    // Navegar para a página de chamada
    router.push('/chamada')
  } else {
    // Exibir mensagem de erro se os campos não estiverem preenchidos
    alert('Por favor, preencha todos os campos')
  }
}
</script>
