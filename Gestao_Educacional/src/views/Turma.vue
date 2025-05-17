<template>
  <div class="content p-4">
    <!-- Barra de pesquisa + botão -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input v-model="filtro" class="form-control w-50" type="text" placeholder="Pesquisar turma..." />
      <button class="btn btn-primary" @click="abrirFormularioNovaTurma">
        <i class="fa fa-plus me-2"></i>Nova Turma
      </button>
    </div>

    <!-- Formulário de turma -->
    <TurmaForm
      v-if="modoFormulario.ativo"
      :modelo="formulario"
      :edicao="modoFormulario.edicao"
      @salvar="salvarTurma"
      @cancelar="cancelarFormulario"
      @excluir="confirmarExclusao"
    />

    <!-- Tabela -->
    <TurmaTable :turmas="turmasFiltradas" @editar="abrirFormularioEdicao" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TurmaForm from '@/components/TurmaForm.vue'
import TurmaTable from '@/components/TurmaTable.vue'

interface Turma {
  id: number
  nome: string
  periodo: string
  status: 'ativo' | 'inativo'
}

// Lista de turmas (mock)
const turmas = ref<Turma[]>([
  { id: 1, nome: '1º Ano A', periodo: '2024.1', status: 'ativo' },
  { id: 2, nome: '2º Ano B', periodo: '2023.2', status: 'inativo' },
  { id: 3, nome: '3º Ano C', periodo: '2024.1', status: 'ativo' },
])

const filtro = ref('')
const formulario = ref<Turma>({ id: 0, nome: '', periodo: '', status: 'ativo' })
const modoFormulario = ref({ ativo: false, edicao: false })

// Filtro da lista
const turmasFiltradas = computed(() =>
  turmas.value.filter(t =>
    t.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

// Nova turma
function abrirFormularioNovaTurma() {
  formulario.value = { id: Date.now(), nome: '', periodo: '', status: 'ativo' }
  modoFormulario.value = { ativo: true, edicao: false }
}

// Editar turma existente
function abrirFormularioEdicao(id: number) {
  const turma = turmas.value.find(t => t.id === id)
  if (turma) {
    formulario.value = { ...turma }
    modoFormulario.value = { ativo: true, edicao: true }
  }
}

// Cancelar edição/criação
function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
  formulario.value = { id: 0, nome: '', periodo: '', status: 'ativo' }
}

// Salvar nova ou editar existente
function salvarTurma(turma: Turma) {
  if (modoFormulario.value.edicao) {
    const index = turmas.value.findIndex(t => t.id === turma.id)
    if (index !== -1) {
      turmas.value[index] = { ...turma }
    }
  } else {
    turmas.value.push({ ...turma })
  }
  cancelarFormulario()
}

// Excluir turma com confirmação
function confirmarExclusao(id: number) {
  const turma = turmas.value.find(t => t.id === id)
  if (turma && confirm(`Deseja excluir a turma "${turma.nome}"?`)) {
    turmas.value = turmas.value.filter(t => t.id !== id)
    cancelarFormulario()
  }
}
</script>

