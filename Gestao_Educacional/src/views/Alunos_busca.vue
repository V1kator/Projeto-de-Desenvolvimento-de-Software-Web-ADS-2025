<template>
  <div class="content p-4">
    <!-- Filtro + botão -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input v-model="filtro" class="form-control w-50" type="text" placeholder="Pesquisar aluno..." />
      <button class="btn btn-primary" @click="abrirFormularioNovo">
        <i class="fa fa-plus me-2"></i>Novo Aluno
      </button>
    </div>

    <!-- Formulário de cadastro -->
    <AlunoForm
      v-if="modoFormulario.ativo && !modoFormulario.edicao"
      :modelo="formulario"
      :turmas-disponiveis="turmas.map(t => t.nome)"
      @salvar="criarAluno"
      @cancelar="cancelarFormulario"
    />

    <!-- Formulário de edição -->
    <div v-if="modoFormulario.ativo && modoFormulario.edicao">
      <DadosAluno :aluno="formulario" :bloquear-turma="true" @atualizar="atualizarAlunoLocal" />

      <HistoricoSonhos
        :sonhos="formulario.sonhos"
        :funcionarios="nomesFuncionarios.map(f => f.nome)"
        :aluno-id="formulario.id"
        @atualizar-sonhos="atualizarSonhos"
      />

      <TransferenciaTurma
        :transferencias="formulario.transferencias"
        :turmas="turmas.map(t => t.nome)"
        :funcionarios="nomesFuncionarios.map(f => f.nome)"
        @adicionar-transferencia="salvarTransferencia"
        @trocar-turma="trocarTurma"
      />

      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-secondary me-2" @click="cancelarFormulario">Cancelar</button>
        <button class="btn btn-success" @click="salvarEdicaoAluno">Salvar</button>
      </div>
    </div>

    <!-- Tabela -->
    <AlunoTable :alunos="alunosFiltrados" @editar="abrirFormularioEdicao" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AlunoForm from '@/components/aluno/AlunoForm.vue'
import AlunoTable from '@/components/aluno/AlunoTable.vue'
import DadosAluno from '@/components/aluno/DadosAluno.vue'
import HistoricoSonhos from '@/components/aluno/HistoricoSonhos.vue'
import TransferenciaTurma from '@/components/aluno/TransferenciaTurma.vue'

import TurmaService from '@/services/turmaService'
import FuncionarioService from '@/services/FuncionarioService'
import AlunoService from '@/services/AlunoService'
import HistoricoSonhosService from '@/services/HistoricoSonhosService'
import TransferenciaTurmaService from '@/services/TransferenciaTurmaService'

interface RegistroSonho {
  data: string
  motivo: string
  valor: number
  funcionario: string
  tipo: 'ganho' | 'perda'
}

interface Transferencia {
  origem: string
  destino: string
  data: string
  funcionario: string
}

interface Aluno {
  id: number
  nome: string
  periodo: string
  status: 'ativo' | 'inativo' | 'desligado'
  turma: string
  nascimento: string
  saldoSonhos: number
  sonhos: RegistroSonho[]
  transferencias: Transferencia[]
}

const alunos = ref<Aluno[]>([])
const filtro = ref('')
const modoFormulario = ref({ ativo: false, edicao: false })
const formulario = ref<Aluno>(alunoVazio())
const turmas = ref<any[]>([])
const nomesFuncionarios = ref<any[]>([])

onMounted(carregarDadosIniciais)

async function carregarDadosIniciais() {
  try {
    turmas.value = await TurmaService.listar()
    nomesFuncionarios.value = await FuncionarioService.listarTodos()
    const listaAlunos = await AlunoService.listarTodos()

    alunos.value = listaAlunos.map((a: any) => ({
      id: a.id,
      nome: a.nome,
      periodo: a.periodo,
      status: (a.statusMatricula ?? 'ativo').toLowerCase(),
      turma: a.turmaNome ?? '',
      nascimento: a.dataNascimento.split('T')[0],
      saldoSonhos: a.saldoSonhos,
      sonhos: [],
      transferencias: []
    }))
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error)
  }
}

const alunosFiltrados = computed(() =>
  alunos.value.filter(a =>
    a.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

function alunoVazio(): Aluno {
  return {
    id: Date.now(),
    nome: '',
    periodo: '',
    status: 'ativo',
    turma: '',
    nascimento: '',
    saldoSonhos: 0,
    sonhos: [],
    transferencias: []
  }
}

function abrirFormularioNovo() {
  formulario.value = alunoVazio()
  modoFormulario.value = { ativo: true, edicao: false }
}

async function abrirFormularioEdicao(id: number) {
  const alunoDTO = await AlunoService.buscarPorId(id)
  const sonhos = await HistoricoSonhosService.listarPorAluno(id)
  const transferencias = await TransferenciaTurmaService.listarPorAluno(id)

  formulario.value = {
    id: alunoDTO.id,
    nome: alunoDTO.nome,
    periodo: alunoDTO.periodo,
    status: (alunoDTO.statusMatricula ?? 'ativo').toLowerCase(),
    turma: alunoDTO.turmaNome ?? '',
    nascimento: alunoDTO.dataNascimento.split('T')[0],
    saldoSonhos: alunoDTO.saldoSonhos,
    sonhos: sonhos.map((s: any) => ({
      data: s.data.split('T')[0],
      motivo: s.motivo,
      valor: s.valor,
      funcionario: s.funcionarioNome ?? '',
      tipo: s.tipo === 'Adição' ? 'ganho' : 'perda'
    })),
    transferencias: transferencias.map((t: any) => ({
      origem: t.turmaOrigemNome ?? '',
      destino: t.turmaDestinoNome ?? '',
      data: t.dataTransferencia.split('T')[0],
      funcionario: t.funcionarioNome ?? ''
    }))
  }

  modoFormulario.value = { ativo: true, edicao: true }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
  formulario.value = alunoVazio()
}

async function criarAluno(aluno: Aluno) {
  try {
    const turma = turmas.value.find(t => t.nome === aluno.turma)
    await AlunoService.criar({
      nome: aluno.nome,
      dataNascimento: aluno.nascimento,
      turmaId: turma?.id ?? null,
      status: aluno.status, // ✅ corrigido
      periodo: aluno.periodo
    })
    await carregarDadosIniciais()
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao criar aluno:', error)
  }
}

async function salvarEdicaoAluno() {
  try {
    const turma = turmas.value.find(t => t.nome === formulario.value.turma)
    await AlunoService.atualizar(formulario.value.id, {
      nome: formulario.value.nome,
      dataNascimento: formulario.value.nascimento,
      turmaId: turma?.id ?? null,
      status: formulario.value.status, // ✅ corrigido
      periodo: formulario.value.periodo
    })
    await carregarDadosIniciais()
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error)
  }
}

function atualizarAlunoLocal(alunoAtualizado: Aluno) {
  formulario.value = { ...alunoAtualizado }
}

function atualizarSonhos(lista: RegistroSonho[]) {
  formulario.value.sonhos = [...lista]
  formulario.value.saldoSonhos = lista.reduce((acc, s) => acc + (s.tipo === 'ganho' ? s.valor : -s.valor), 0)
}

async function salvarTransferencia(transferencia: Transferencia) {
  try {
    const turmaOrigem = turmas.value.find(t => t.nome === transferencia.origem)
    const turmaDestino = turmas.value.find(t => t.nome === transferencia.destino)
    const funcionario = nomesFuncionarios.value.find(f => f.nome === transferencia.funcionario)

    if (!turmaOrigem || !turmaDestino || !funcionario) {
      console.error('Dados incompletos para salvar transferência')
      return
    }

    await TransferenciaTurmaService.transferir({
      alunoId: formulario.value.id,
      turmaOrigemId: turmaOrigem.id,
      turmaDestinoId: turmaDestino.id,
      funcionarioId: funcionario.id,
      dataTransferencia: transferencia.data
    })

    formulario.value.transferencias.push(transferencia)
    formulario.value.turma = transferencia.destino
  } catch (error) {
    console.error('Erro ao salvar transferência:', error)
  }
}

function trocarTurma(novaTurma: string) {
  formulario.value.turma = novaTurma
}
</script>
