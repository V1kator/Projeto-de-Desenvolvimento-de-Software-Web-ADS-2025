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
      :turmas-disponiveis="turmas"
      @salvar="salvarAluno"
      @cancelar="cancelarFormulario"
    />

    <!-- Formulário de edição -->
    <div v-if="modoFormulario.ativo && modoFormulario.edicao">
      <DadosAluno
        :aluno="formulario"
        :bloquear-turma="true"
        @atualizar="atualizarAluno"
      />

      <HistoricoSonhos
        :sonhos="formulario.sonhos"
        :funcionarios="funcionariosAtivos"
        @atualizar-sonhos="atualizarSonhos"
      />

      <TransferenciaTurma
        :transferencias="formulario.transferencias"
        :turmas="turmas"
        :funcionarios="funcionariosAtivos"
        @adicionar-transferencia="adicionarTransferencia"
        @trocar-turma="trocarTurma"
      />

      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-secondary me-2" @click="cancelarFormulario">Cancelar</button>
        <button class="btn btn-success" @click="salvarAluno(formulario)">Salvar</button>
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
  status: 'ativo' | 'inativo'
  turma: string
  nascimento: string
  saldoSonhos: number
  sonhos: RegistroSonho[]
  transferencias: Transferencia[]
}

interface Funcionario {
  id: number
  nome: string
  status: 'ativo' | 'desligado'
}

const alunos = ref<Aluno[]>([])
const filtro = ref('')
const modoFormulario = ref({ ativo: false, edicao: false })
const formulario = ref<Aluno>(alunoVazio())

// Simulação de dados vindos da API
const turmas = ref<string[]>(['1º Ano A', '2º Ano B', '3º Ano C'])
const funcionariosSistema = ref<Funcionario[]>([
  { id: 1, nome: 'Maria Silva', status: 'ativo' },
  { id: 2, nome: 'João Oliveira', status: 'ativo' },
  { id: 3, nome: 'Ana Paula', status: 'desligado' }
])

const funcionariosAtivos = computed(() =>
  funcionariosSistema.value
    .filter(f => f.status === 'ativo')
    .map(f => f.nome)
)

onMounted(() => {
  // Aqui futuramente você pode substituir pelo carregamento da API
})

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

const alunosFiltrados = computed(() =>
  alunos.value.filter((a) =>
    a.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

function abrirFormularioNovo() {
  formulario.value = alunoVazio()
  modoFormulario.value = { ativo: true, edicao: false }
}

function abrirFormularioEdicao(id: number) {
  const aluno = alunos.value.find((a) => a.id === id)
  if (aluno) {
    formulario.value = JSON.parse(JSON.stringify(aluno))
    modoFormulario.value = { ativo: true, edicao: true }
  }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
  formulario.value = alunoVazio()
}

function salvarAluno(aluno: Aluno) {
  const index = alunos.value.findIndex((a) => a.id === aluno.id)
  if (index !== -1) {
    alunos.value[index] = { ...aluno }
  } else {
    alunos.value.push({ ...aluno })
  }
  cancelarFormulario()
}

function atualizarAluno(alunoAtualizado: Aluno) {
  const turmaAtual = formulario.value.turma
  formulario.value = { ...alunoAtualizado }
  formulario.value.turma = turmaAtual
}

function atualizarSonhos(lista: RegistroSonho[]) {
  formulario.value.sonhos = [...lista]
  formulario.value.saldoSonhos = lista.reduce((acc, s) => {
    return acc + (s.tipo === 'ganho' ? s.valor : -s.valor)
  }, 0)
}

function adicionarTransferencia(transferencia: Transferencia) {
  formulario.value.transferencias = [
    ...formulario.value.transferencias,
    transferencia
  ]
  formulario.value.turma = transferencia.destino
}

function trocarTurma(novaTurma: string) {
  formulario.value.turma = novaTurma
}
</script>
