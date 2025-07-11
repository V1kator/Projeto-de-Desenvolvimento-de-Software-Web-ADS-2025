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
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import TurmaForm from '@/components/TurmaForm.vue'
import TurmaTable from '@/components/TurmaTable.vue'
import turmaService, { Turma } from '@/services/turmaService'

const turmas = ref<Turma[]>([])
const filtro = ref('')
const formulario = ref<Turma>({ id: 0, nome: '', periodo: '', status: 'ativo' })
const modoFormulario = ref({ ativo: false, edicao: false })

// Carrega todas as turmas da API
async function carregarTurmas() {
  try {
    turmas.value = await turmaService.listar()
  } catch {
    Swal.fire('Erro', 'Erro ao carregar turmas da API.', 'error')
  }
}

onMounted(carregarTurmas)

// Computed para filtro de busca
const turmasFiltradas = computed(() =>
  turmas.value.filter(t =>
    t.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

// Abre formulário para nova turma
function abrirFormularioNovaTurma() {
  formulario.value = { id: 0, nome: '', periodo: '', status: 'ativo' }
  modoFormulario.value = { ativo: true, edicao: false }
}

// Abre formulário com dados da turma para edição
async function abrirFormularioEdicao(id: number) {
  try {
    const turma = await turmaService.buscarPorId(id)
    formulario.value = { ...turma }
    modoFormulario.value = { ativo: true, edicao: true }
  } catch {
    Swal.fire('Erro', 'Turma não encontrada.', 'error')
  }
}

// Cancela o formulário e reseta estado
function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
  formulario.value = { id: 0, nome: '', periodo: '', status: 'ativo' }
}

// Salva turma (nova ou edição)
async function salvarTurma(turma: Turma) {
  try {
    if (modoFormulario.value.edicao) {
      await turmaService.atualizar(turma)
      Swal.fire('Atualizado!', 'Turma atualizada com sucesso.', 'success')
    } else {
      await turmaService.criar({
        nome: turma.nome,
        periodo: turma.periodo,
        status: turma.status
      })
      Swal.fire('Cadastrado!', 'Turma criada com sucesso.', 'success')
    }

    await carregarTurmas()
    cancelarFormulario()
  } catch {
    Swal.fire('Erro', 'Não foi possível salvar a turma.', 'error')
  }
}

// Confirma e executa exclusão da turma
async function confirmarExclusao(id: number) {
  const turma = turmas.value.find(t => t.id === id)
  if (!turma) return

  const confirm = await Swal.fire({
    title: `Excluir "${turma.nome}"?`,
    text: 'Essa ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (confirm.isConfirmed) {
    try {
      await turmaService.excluir(id)
      await carregarTurmas()
      cancelarFormulario()
      Swal.fire('Excluído!', 'Turma excluída com sucesso!', 'success')
    } catch {
      Swal.fire('Erro', 'Erro ao excluir a turma.', 'error')
    }
  }
}
</script>
