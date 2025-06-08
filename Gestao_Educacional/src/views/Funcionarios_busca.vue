<template>
  <div class="content p-4">
    <!-- Filtro + botão -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input v-model="filtro" class="form-control w-50" type="text" placeholder="Pesquisar funcionário..." />
      <button class="btn btn-primary" @click="abrirFormularioNovo">
        <i class="fa fa-plus me-2"></i>Novo Funcionário
      </button>
    </div>

    <!-- Formulário -->
    <FuncionarioForm
      v-if="modoFormulario.ativo"
      :modelo="formulario"
      :edicao="modoFormulario.edicao"
      :materias="materiasDisponiveis"
      @salvar="salvarFuncionario"
      @cancelar="cancelarFormulario"
      @excluir="excluirFuncionario"
    />

    <!-- Tabela -->
    <FuncionarioTable :funcionarios="funcionariosFiltrados" @editar="abrirFormularioEdicao" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FuncionarioForm from '@/components/FuncionarioForm.vue'
import FuncionarioTable from '@/components/FuncionarioTable.vue'

interface Funcionario {
  id: number
  nome: string
  cpf: string
  cargo: 'professor' | 'administrador'
  status: 'ativo' | 'desligado'
  materia: string
  admissao: string
  desligamento?: string
}

// Lista simulada de matérias
const materiasDisponiveis = ref([
  'Matemática',
  'Português',
  'Física',
  'História'
])

// Lista simulada de funcionários
const funcionarios = ref<Funcionario[]>([
  {
    id: 1,
    nome: 'Carlos Souza',
    cpf: '12345678900',
    cargo: 'professor',
    status: 'ativo',
    materia: 'Matemática',
    admissao: '2022-02-15'
  },
  {
    id: 2,
    nome: 'Ana Lima',
    cpf: '98765432100',
    cargo: 'administrador',
    status: 'desligado',
    materia: 'Português',
    admissao: '2021-08-10',
    desligamento: '2023-01-05'
  }
])

const filtro = ref('')
const formulario = ref<Funcionario>({
  id: 0,
  nome: '',
  cpf: '',
  cargo: 'professor',
  status: 'ativo',
  materia: '',
  admissao: '',
  desligamento: ''
})

const modoFormulario = ref({ ativo: false, edicao: false })

const funcionariosFiltrados = computed(() =>
  funcionarios.value.filter(f =>
    f.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

function abrirFormularioNovo() {
  formulario.value = {
    id: Date.now(),
    nome: '',
    cpf: '',
    cargo: 'professor',
    status: 'ativo',
    materia: '',
    admissao: '',
    desligamento: ''
  }
  modoFormulario.value = { ativo: true, edicao: false }
}

function abrirFormularioEdicao(id: number) {
  const func = funcionarios.value.find(f => f.id === id)
  if (func) {
    formulario.value = { ...func }
    modoFormulario.value = { ativo: true, edicao: true }
  }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
}

function salvarFuncionario(func: Funcionario) {
  if (modoFormulario.value.edicao) {
    const index = funcionarios.value.findIndex(f => f.id === func.id)
    if (index !== -1) funcionarios.value[index] = { ...func }
  } else {
    funcionarios.value.push({ ...func })
  }
  cancelarFormulario()
}

function excluirFuncionario(id: number) {
  const func = funcionarios.value.find(f => f.id === id)
  if (func && confirm(`Deseja realmente excluir ${func.nome}?`)) {
    funcionarios.value = funcionarios.value.filter(f => f.id !== id)
    cancelarFormulario()
  }
}
</script>
