<template>
  <div class="content p-4">
    <!-- Barra superior -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input v-model="filtro" class="form-control w-50" type="text" placeholder="Pesquisar matéria..." />
      <button class="btn btn-primary" @click="abrirFormularioNovaMateria">
        <i class="fa fa-plus me-2"></i>Nova Matéria
      </button>
    </div>

    <!-- Formulário -->
    <MateriaForm
      v-if="modoFormulario.ativo"
      :modelo="formulario"
      :edicao="modoFormulario.edicao"
      @salvar="salvarMateria"
      @cancelar="cancelarFormulario"
      @excluir="confirmarExclusao"
    />

    <!-- Tabela -->
    <MateriaTable :materias="materiasFiltradas" @editar="abrirFormularioEdicao" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import MateriaTable from '@/components/MateriaTable.vue'
import MateriaForm from '@/components/MateriaForm.vue'

interface Materia {
  id: number
  nome: string
  status: 'ativo' | 'inativo'
}

const materias = ref<Materia[]>([
  { id: 1, nome: 'Matemática', status: 'ativo' },
  { id: 2, nome: 'História', status: 'inativo' },
  { id: 3, nome: 'Física', status: 'ativo' },
])

const filtro = ref('')
const formulario = ref<Materia>({ id: 0, nome: '', status: 'ativo' })
const modoFormulario = ref({ ativo: false, edicao: false })

const materiasFiltradas = computed(() =>
  materias.value.filter(m =>
    m.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

function abrirFormularioNovaMateria() {
  formulario.value = { id: Date.now(), nome: '', status: 'ativo' }
  modoFormulario.value = { ativo: true, edicao: false }
}

function abrirFormularioEdicao(id: number) {
  const materia = materias.value.find(m => m.id === id)
  if (materia) {
    formulario.value = { ...materia }
    modoFormulario.value = { ativo: true, edicao: true }
  }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
  formulario.value = { id: 0, nome: '', status: 'ativo' }
}

function salvarMateria(materia: Materia) {
  if (modoFormulario.value.edicao) {
    const index = materias.value.findIndex(m => m.id === materia.id)
    if (index !== -1) {
      materias.value[index] = { ...materia }
    }

    Swal.fire({
      icon: 'success',
      title: 'Matéria atualizada com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

  } else {
    materias.value.push({ ...materia })

    Swal.fire({
      icon: 'success',
      title: 'Matéria cadastrada com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })
  }

  cancelarFormulario()
}

function confirmarExclusao(id: number) {
  const materia = materias.value.find(m => m.id === id)
  if (!materia) return

  Swal.fire({
    title: `Deseja excluir a matéria "${materia.nome}"?`,
    text: 'Essa ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      materias.value = materias.value.filter(m => m.id !== id)
      cancelarFormulario()

      Swal.fire({
        icon: 'success',
        title: 'Matéria excluída com sucesso!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  })
}
</script>
