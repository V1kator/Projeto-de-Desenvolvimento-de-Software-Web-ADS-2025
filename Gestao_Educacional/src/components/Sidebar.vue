<template>
  <div class="sidebar pe-4 pb-3">
    <nav class="navbar bg-light navbar-light">
      <RouterLink to="/chamada" class="navbar-brand mx-4 mb-3">
        <h3 class="text-primary"><i class="fa fa-hashtag me-2"></i>Sonho</h3>
      </RouterLink>

      <div class="d-flex align-items-center ms-4 mb-4">
        <div class="position-relative">
          <img class="rounded-circle" src="@/assets/img/user.jpg" alt="" style="width: 40px; height: 40px;" />
          <div class="bg-success rounded-circle border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
        </div>
        <div class="ms-3">
          <h6 class="mb-0">Jhon Doe</h6>
          <span>Admin</span>
        </div>
      </div>

      <div class="navbar-nav w-100">
        <RouterLink to="/chamada" class="nav-item nav-link">
          <i class="fa fa-tachometer-alt me-2"></i>Chamada
        </RouterLink>

        <RouterLink to="/alunos-busca" class="nav-item nav-link">
          <i class="fa fa-users me-2"></i>Buscar Alunos
        </RouterLink>

        <RouterLink to="/funcionarios-busca" class="nav-item nav-link">
          <i class="fa fa-user-tie me-2"></i>Buscar Funcionários
        </RouterLink>

        <RouterLink to="/eventos-busca" class="nav-item nav-link">
          <i class="fa fa-calendar-alt me-2"></i>Buscar Eventos
        </RouterLink>

        <RouterLink to="/turma" class="nav-item nav-link">
          <i class="fa fa-user-plus me-2"></i>Turma
        </RouterLink>

        <RouterLink to="/materia" class="nav-item nav-link">
          <i class="fa fa-user-plus me-2"></i>Matéria
        </RouterLink>

        <RouterLink to="/login" class="nav-item nav-link">
          <i class="fa fa-sign-in-alt me-2"></i>Login
        </RouterLink>

        <RouterLink to="/singup" class="nav-item nav-link">
          <i class="fa fa-user-plus me-2"></i>Cadastro
        </RouterLink>

      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
