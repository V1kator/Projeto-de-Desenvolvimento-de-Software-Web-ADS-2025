import { createRouter, createWebHistory } from 'vue-router'
import Chamada from '@/views/Chamada.vue'
import AlunoEditar from '@/views/Aluno_editar.vue'
import AlunosBusca from '@/views/Alunos_busca.vue'
import EventoEditar from '@/views/Evento_editar.vue'
import EventosBusca from '@/views/Eventos_busca.vue'
import FuncionarioEditar from '@/views/Funcionario_editar.vue'
import FuncionariosBusca from '@/views/Funcionarios_busca.vue'
import Login from '@/views/Login.vue'
import SingUp from '@/views/SingUp.vue'
import Materia from '@/views/Materia.vue'
import Turma from '@/views/Turma.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/chamada',
      name: 'chamada',
      component: Chamada,
    },
    {
      path: '/aluno-editar',
      name: 'aluno-editar',
      component: AlunoEditar,
    },
    {
      path: '/alunos-busca',
      name: 'alunos-busca',
      component: AlunosBusca,
    },
    {
      path: '/evento-editar',
      name: 'evento-editar',
      component: EventoEditar,
    },
    {
      path: '/eventos-busca',
      name: 'eventos-busca',
      component: EventosBusca,
    },
    {
      path: '/funcionario-editar',
      name: 'funcionario-editar',
      component: FuncionarioEditar,
    },
    {
      path: '/funcionarios-busca',
      name: 'funcionarios-busca',
      component: FuncionariosBusca,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/singup',
      name: 'singup',
      component: SingUp,
    },
    {
      path: '/materia',
      name: 'materia',
      component: Materia,
    },
    {
      path: '/turma',
      name: 'turma',
      component: Turma,
    }
  ],
})

export default router
