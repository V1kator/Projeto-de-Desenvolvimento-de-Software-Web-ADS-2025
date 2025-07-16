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
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import EventoForm from '@/components/EventoForm.vue'
import EventoTable from '@/components/EventoTable.vue'
import EventoService from '@/services/EventoService'
import AlunoService from '@/services/AlunoService'
import ParticipacaoEventoService from '@/services/ParticipacaoEventoService'

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

const alunosDisponiveis = ref<Aluno[]>([])
const eventos = ref<Evento[]>([])
const filtro = ref('')
const formulario = ref<Evento>(eventoVazio())
const modoFormulario = ref({ ativo: false, edicao: false })

onMounted(async () => {
  await carregarEventos()
  await carregarAlunos()
})

async function carregarEventos() {
  const lista = await EventoService.listar()
  eventos.value = lista.map((e: any) => ({
    id: e.id,
    nome: e.nome,
    descricao: e.descricao,
    valor: e.valorSonhos,
    status: e.status.toLowerCase(),
    inicio: e.dataInicio.split('T')[0],
    fim: e.dataFim?.split('T')[0],
    participantes: []
  }))
}

async function carregarAlunos() {
  const lista = await AlunoService.listarTodos()
  alunosDisponiveis.value = lista.map((a: any) => ({
    id: a.id,
    nome: a.nome,
    turma: a.turmaNome ?? '',
    periodo: a.periodo
  }))
}

function eventoVazio(): Evento {
  return {
    id: 0,
    nome: '',
    descricao: '',
    valor: 0,
    status: '',
    inicio: '',
    fim: '',
    participantes: []
  }
}

const eventosFiltrados = computed(() =>
  eventos.value.filter(e =>
    e.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

function abrirFormularioNovo() {
  formulario.value = eventoVazio()
  modoFormulario.value = { ativo: true, edicao: false }
}

async function abrirFormularioEdicao(id: number) {
  const evento = eventos.value.find(e => e.id === id)
  if (!evento) return

  const participacoes = await ParticipacaoEventoService.listarPorEvento(id)

  formulario.value = {
    ...evento,
    participantes: participacoes.map((p: any) => ({
      idAluno: p.alunoId,
      participou: p.participou,
      turma: alunosDisponiveis.value.find(a => a.id === p.alunoId)?.turma ?? '',
      periodo: alunosDisponiveis.value.find(a => a.id === p.alunoId)?.periodo ?? ''
    }))
  }

  modoFormulario.value = { ativo: true, edicao: true }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
}

async function salvarEvento(evento: Evento) {
  try {
    let eventoId = evento.id

    if (modoFormulario.value.edicao) {
      await EventoService.atualizar(eventoId, evento)

      // Remove todas as participações atuais
      const participacoesAtuais = await ParticipacaoEventoService.listarPorEvento(eventoId)
      for (const p of participacoesAtuais) {
        await ParticipacaoEventoService.deletar(p.id)
      }

    } else {
      const { data } = await EventoService.criar(evento)
      eventoId = data.id
      evento.id = eventoId
      eventos.value.push(evento)
    }

    // Adiciona os novos participantes
    for (const p of evento.participantes) {
      await ParticipacaoEventoService.criar({
        eventoId,
        alunoId: p.idAluno,
        participou: p.participou
      })
    }

    Swal.fire({
      icon: 'success',
      title: modoFormulario.value.edicao ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!',
      timer: 1500,
      showConfirmButton: false
    })

    await carregarEventos()
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar evento:', error)
    Swal.fire({ icon: 'error', title: 'Erro ao salvar evento' })
  }
}

async function excluirEvento(id: number) {
  const evento = eventos.value.find(e => e.id === id)
  if (!evento) return

  const result = await Swal.fire({
    title: `Deseja excluir o evento "${evento.nome}"?`,
    text: 'Essa ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    // Exclui participações antes do evento
    const participacoes = await ParticipacaoEventoService.listarPorEvento(id)
    for (const p of participacoes) {
      await ParticipacaoEventoService.deletar(p.id)
    }

    await EventoService.deletar(id)
    eventos.value = eventos.value.filter(e => e.id !== id)
    cancelarFormulario()

    Swal.fire({ icon: 'success', title: 'Evento excluído com sucesso!', timer: 1500, showConfirmButton: false })
  }
}
</script>
