<template>
  <div class="content p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input v-model="filtro" class="form-control w-50" type="text" placeholder="Pesquisar evento..." />
      <button class="btn btn-primary" @click="abrirFormularioNovo">
        <i class="fa fa-plus me-2"></i>Novo Evento
      </button>
    </div>

    <EventoForm
      v-if="modoFormulario.ativo"
      :modelo="formulario"
      :edicao="modoFormulario.edicao"
      :alunos="alunosDisponiveis"
      @salvar="salvarEvento"
      @cancelar="cancelarFormulario"
      @excluir="excluirEvento"
    />

    <EventoTable :eventos="eventosFiltrados" @editar="abrirFormularioEdicao" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import EventoForm from '@/components/EventoForm.vue'
import EventoTable from '@/components/EventoTable.vue'

interface Participante {
  idAluno: number
  participou: boolean
  turma: string
  periodo: string
}

interface Evento {
  id: number
  nome: string
  descricao: string
  valor: number
  status: 'ativo' | 'encerrado' | ''
  inicio: string
  fim?: string
  participantes: Participante[]
}

interface Aluno {
  id: number
  nome: string
  turma: string
  periodo: string
}

const alunosDisponiveis = ref<Aluno[]>([
  { id: 1, nome: 'José', turma: 'A', periodo: 'Matutino' },
  { id: 2, nome: 'Ana', turma: 'B', periodo: 'Vespertino' },
  { id: 3, nome: 'Carlos', turma: 'A', periodo: 'Matutino' }
])

const eventos = ref<Evento[]>([])
const filtro = ref('')
const formulario = ref<Evento>({
  id: 0,
  nome: '',
  descricao: '',
  valor: 0,
  status: '',
  inicio: '',
  fim: '',
  participantes: []
})

const modoFormulario = ref({ ativo: false, edicao: false })

const eventosFiltrados = computed(() =>
  eventos.value.filter(e =>
    e.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

function abrirFormularioNovo() {
  formulario.value = {
    id: Date.now(),
    nome: '',
    descricao: '',
    valor: 0,
    status: '',
    inicio: '',
    fim: '',
    participantes: []
  }
  modoFormulario.value = { ativo: true, edicao: false }
}

function abrirFormularioEdicao(id: number) {
  const evento = eventos.value.find(e => e.id === id)
  if (evento) {
    formulario.value = { ...evento }
    modoFormulario.value = { ativo: true, edicao: true }
  }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
}

function salvarEvento(evento: Evento) {
  if (modoFormulario.value.edicao) {
    const i = eventos.value.findIndex(e => e.id === evento.id)
    if (i !== -1) eventos.value[i] = { ...evento }
    Swal.fire({ icon: 'success', title: 'Evento atualizado com sucesso!', timer: 1500, showConfirmButton: false })
  } else {
    eventos.value.push({ ...evento })
    Swal.fire({ icon: 'success', title: 'Evento cadastrado com sucesso!', timer: 1500, showConfirmButton: false })
  }
  cancelarFormulario()
}

function excluirEvento(id: number) {
  const evento = eventos.value.find(e => e.id === id)
  if (!evento) return

  Swal.fire({
    title: `Deseja excluir o evento "${evento.nome}"?`,
    text: 'Essa ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      eventos.value = eventos.value.filter(e => e.id !== id)
      cancelarFormulario()
      Swal.fire({ icon: 'success', title: 'Evento excluído com sucesso!', timer: 1500, showConfirmButton: false })
    }
  })
}
</script>
