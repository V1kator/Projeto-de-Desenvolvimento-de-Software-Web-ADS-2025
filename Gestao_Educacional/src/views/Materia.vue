<!-- src/views/Materia.vue -->
<template>
  <div class="content p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input v-model="filtro" class="form-control w-50" type="text" placeholder="Pesquisar matéria..." />
      <button class="btn btn-primary" @click="abrirFormularioNovaMateria">
        <i class="fa fa-plus me-2"></i>Nova Matéria
      </button>
    </div>

    <MateriaForm
      v-if="modoFormulario.ativo"
      :modelo="formulario"
      :edicao="modoFormulario.edicao"
      @salvar="salvarMateria"
      @cancelar="cancelarFormulario"
      @excluir="confirmarExclusao"
    />

    <MateriaTable :materias="materiasFiltradas" @editar="abrirFormularioEdicao" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import MateriaForm from '@/components/MateriaForm.vue'
import MateriaTable from '@/components/MateriaTable.vue'
import materiaService, { Materia } from '@/services/materiaService'

const materias = ref<Materia[]>([])
const filtro = ref('')
const formulario = ref<Materia>({ id: 0, nome: '', status: 'ativo' })
const modoFormulario = ref({ ativo: false, edicao: false })

const materiasFiltradas = computed(() =>
  materias.value.filter(m => m.nome.toLowerCase().includes(filtro.value.toLowerCase()))
)

async function carregarMaterias() {
  try {
    materias.value = await materiaService.listar()
  } catch (error) {
    Swal.fire('Erro', 'Não foi possível carregar as matérias.', 'error')
  }
}

function abrirFormularioNovaMateria() {
  formulario.value = { id: 0, nome: '', status: 'ativo' }
  modoFormulario.value = { ativo: true, edicao: false }
}

async function abrirFormularioEdicao(id: number) {
  try {
    const materia = await materiaService.buscarPorId(id)
    formulario.value = { ...materia }
    modoFormulario.value = { ativo: true, edicao: true }
  } catch {
    Swal.fire('Erro', 'Matéria não encontrada.', 'error')
  }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
  formulario.value = { id: 0, nome: '', status: 'ativo' }
}

async function salvarMateria(materia: Materia) {
  try {
    if (modoFormulario.value.edicao) {
      await materiaService.atualizar(materia)
      Swal.fire('Atualizado!', 'Matéria atualizada com sucesso.', 'success')
    } else {
      await materiaService.criar(materia)
      Swal.fire('Criado!', 'Matéria cadastrada com sucesso.', 'success')
    }

    await carregarMaterias()
    cancelarFormulario()
  } catch {
    Swal.fire('Erro', 'Não foi possível salvar a matéria.', 'error')
  }
}

async function confirmarExclusao(id: number) {
  const materia = materias.value.find(m => m.id === id)
  if (!materia) return

  const resultado = await Swal.fire({
    title: `Excluir "${materia.nome}"?`,
    text: 'Essa ação não poderá ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (resultado.isConfirmed) {
    try {
      await materiaService.excluir(id)
      Swal.fire('Excluído!', 'Matéria excluída com sucesso.', 'success')
      await carregarMaterias()
      cancelarFormulario()
    } catch {
      Swal.fire('Erro', 'Não foi possível excluir a matéria.', 'error')
    }
  }
}

onMounted(carregarMaterias)
</script>
