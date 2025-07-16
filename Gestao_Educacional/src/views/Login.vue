<template>
  <div class="container-fluid">
    <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh">
      <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
        <div class="bg-light rounded p-4 p-sm-5 my-4 mx-3">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <a href="/" class="">
              <h3 class="text-primary"><i class="fa fa-hashtag me-2"></i>Sonho</h3>
            </a>
            <h3>Login</h3>
          </div>

          <div class="form-floating mb-3">
            <input
              v-model="email"
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="CPF"
            />
            <label for="floatingInput">CPF</label>
          </div>

          <div class="form-floating mb-4">
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Senha"
            />
            <label for="floatingPassword">Senha</label>
          </div>

          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="form-check">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
              />
              <label class="form-check-label" for="exampleCheck1">Lembrar-me</label>
            </div>
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button type="submit" class="btn btn-primary py-3 w-100 mb-4" @click="handleLogin">
            Entrar
          </button>

          <p class="text-center mb-0">
            Não tem uma conta? <router-link to="/signup">Cadastre-se</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FuncionarioService from '@/services/FuncionarioService'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Por favor, preencha todos os campos')
    return
  }

  try {
    const dados = await FuncionarioService.loginPorCpf(email.value)

    if (dados.senha === password.value) {
      if (rememberMe.value) {
        localStorage.setItem('userCpf', email.value)
      }

      router.push('/chamada')
    } else {
      alert('Senha incorreta')
    }
  } catch (error) {
    alert('CPF não encontrado ou erro ao fazer login')
    console.error(error)
  }
}
</script>
