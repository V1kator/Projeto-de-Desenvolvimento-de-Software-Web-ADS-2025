<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">{{ edicao ? 'Editar Evento' : 'Novo Evento' }}</h5>

    <!-- Dados principais -->
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label">Nome do Evento</label>
        <input v-model="form.nome" type="text" class="form-control" />
        <div v-if="erros.nome" class="text-danger small mt-1">{{ erros.nome }}</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Valor Sonhos</label>
        <input v-model.number="form.valor" type="number" class="form-control" />
        <div v-if="erros.valor" class="text-danger small mt-1">{{ erros.valor }}</div>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Descrição</label>
      <textarea v-model="form.descricao" class="form-control" rows="2" />
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-select">
          <option value="">Selecione</option>
          <option value="ativo">Ativo</option>
          <option value="encerrado">Encerrado</option>
        </select>
        <div v-if="erros.status" class="text-danger small mt-1">{{ erros.status }}</div>
      </div>
      <div class="col-md-4">
        <label class="form-label">Data Início</label>
        <input v-model="form.inicio" type="date" class="form-control" />
        <div v-if="erros.inicio" class="text-danger small mt-1">{{ erros.inicio }}</div>
      </div>
      <div class="col-md-4">
        <label class="form-label">Data Fim</label>
        <input v-model="form.fim" type="date" class="form-control" />
      </div>
    </div>

    <!-- Participantes com seleção por turma/período -->
    <div class="border-top pt-3 mt-4">
      <h6>Adicionar Participantes</h6>

      <div class="row">
        <div class="col-md-4">
          <label class="form-label">Turma</label>
          <select v-model="turmaSelecionada" class="form-select">
            <option value="">Selecione</option>
            <option v-for="t in turmasUnicas" :key="t">{{ t }}</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">Período</label>
          <select v-model="periodoSelecionado" class="form-select">
            <option value="">Selecione</option>
            <option v-for="p in periodosUnicos" :key="p">{{ p }}</option>
          </select>
        </div>
      </div>

      <div v-if="alunosFiltrados.length" class="mt-3">
        <p class="fw-semibold">Selecione os alunos participantes:</p>
        <div v-for="aluno in alunosFiltrados" :key="aluno.id" class="form-check">
          <input class="form-check-input" type="checkbox" :id="`aluno-${aluno.id}`" :value="aluno.id" v-model="selecionados" />
          <label class="form-check-label" :for="`aluno-${aluno.id}`">{{ aluno.nome }}</label>
        </div>
        <button class="btn btn-warning mt-2" @click="adicionarParticipantesSelecionados">
          <i class="fa fa-plus me-1"></i>Adicionar Participantes
        </button>
      </div>

      <ul class="mt-3 list-group">
        <li v-for="(p, index) in form.participantes" :key="index" class="list-group-item d-flex justify-content-between">
          {{ alunoNome(p.idAluno) }} — {{ p.participou ? 'Participou' : 'Não participou' }} — Turma {{ p.turma }} ({{ p.periodo }})
          <button class="btn btn-sm btn-outline-danger" @click="form.participantes.splice(index, 1)">Remover</button>
        </li>
      </ul>
    </div>

    <!-- Ações -->
    <div class="d-flex justify-content-between mt-4">
      <button v-if="edicao" class="btn btn-outline-danger" @click="$emit('excluir', form.id)">
        <i class="fa fa-trash me-2"></i>Excluir
      </button>

      <div class="ms-auto">
        <button class="btn btn-secondary me-2" @click="$emit('cancelar')">Cancelar</button>
        <button class="btn btn-primary" @click="validarESalvar">
          <i class="fa fa-save me-2"></i>Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Aluno {
  id: number
  nome: string
  turma: string
  periodo: string
}

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

const props = defineProps<{ modelo: Evento; edicao: boolean; alunos: Aluno[] }>()
const emit = defineEmits(['salvar', 'cancelar', 'excluir'])
const form = ref<Evento>({ ...props.modelo })
const erros = ref<Record<string, string>>({})
const turmaSelecionada = ref('')
const periodoSelecionado = ref('')
const selecionados = ref<number[]>([])

const alunosFiltrados = computed(() =>
  props.alunos.filter(a => a.turma === turmaSelecionada.value && a.periodo === periodoSelecionado.value)
)

const turmasUnicas = computed(() => [...new Set(props.alunos.map(a => a.turma))])
const periodosUnicos = computed(() => [...new Set(props.alunos.filter(a => a.turma === turmaSelecionada.value).map(a => a.periodo))])

function alunoNome(id: number) {
  return props.alunos.find(a => a.id === id)?.nome || 'Desconhecido'
}

function adicionarParticipantesSelecionados() {
  selecionados.value.forEach(id => {
    if (!form.value.participantes.some(p => p.idAluno === id)) {
      const aluno = props.alunos.find(a => a.id === id)
      if (aluno) {
        form.value.participantes.push({
          idAluno: id,
          participou: true,
          turma: aluno.turma,
          periodo: aluno.periodo
        })
      }
    }
  })
  selecionados.value = []
}

function validarFormulario() {
  erros.value = {}
  if (!form.value.nome.trim()) erros.value.nome = 'Nome obrigatório'
  if (form.value.valor == null || form.value.valor < 0) erros.value.valor = 'Valor obrigatório'
  if (!form.value.status) erros.value.status = 'Status obrigatório'
  if (!form.value.inicio) erros.value.inicio = 'Data de início obrigatória'
  return Object.keys(erros.value).length === 0
}

function formatarDataParaISO(data: string) {
  const d = new Date(data)
  return d.toISOString().split('T')[0]
}

function validarESalvar() {
  if (validarFormulario()) {
    const eventoFinal = {
      ...form.value,
      inicio: formatarDataParaISO(form.value.inicio),
      fim: form.value.fim ? formatarDataParaISO(form.value.fim) : undefined
    }
    emit('salvar', eventoFinal)
  }
}
</script>
