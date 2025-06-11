<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">{{ edicao ? 'Editar Evento' : 'Novo Evento' }}</h5>

    <!-- Campos principais -->
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

    <!-- Participantes -->
    <div class="mt-4 border-top pt-3">
      <h6>Participantes</h6>
      <div class="row align-items-end">
        <div class="col-md-3">
          <label class="form-label">Aluno</label>
          <select v-model="participanteSelecionado.idAluno" class="form-select">
            <option disabled value="">Selecione</option>
            <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
              {{ aluno.nome }}
            </option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Participou</label>
          <div class="d-flex gap-2">
            <div class="form-check">
              <input
                v-model="participanteSelecionado.participou"
                type="radio"
                class="form-check-input"
                :value="true"
                id="sim"
              />
              <label class="form-check-label" for="sim">Sim</label>
            </div>
            <div class="form-check">
              <input
                v-model="participanteSelecionado.participou"
                type="radio"
                class="form-check-input"
                :value="false"
                id="nao"
              />
              <label class="form-check-label" for="nao">Não</label>
            </div>
          </div>
        </div>

        <div class="col-md-2">
          <label class="form-label">Turma</label>
          <input v-model="participanteSelecionado.turma" class="form-control" disabled />
        </div>

        <div class="col-md-2">
          <label class="form-label">Período</label>
          <input v-model="participanteSelecionado.periodo" class="form-control" disabled />
        </div>

        <div class="col-md-3 text-end">
          <button class="btn btn-warning" @click="adicionarParticipante">
            <i class="fa fa-plus me-1"></i>Adicionar
          </button>
        </div>
      </div>

      <ul class="mt-3 list-group">
        <li
          v-for="(p, index) in form.participantes"
          :key="index"
          class="list-group-item d-flex justify-content-between"
        >
          {{ alunoNome(p.idAluno) }} —
          {{ p.participou ? 'Participou' : 'Não participou' }} — Turma {{ p.turma }} ({{ p.periodo }})
          <button class="btn btn-sm btn-outline-danger" @click="form.participantes.splice(index, 1)">
            Remover
          </button>
        </li>
      </ul>
    </div>

    <!-- Ações -->
    <div class="d-flex justify-content-between mt-4">
      <button
        v-if="edicao"
        class="btn btn-outline-danger"
        @click="$emit('excluir', form.id)"
      >
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
import { ref, watch } from 'vue'

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

const props = defineProps<{
  modelo: Evento
  edicao: boolean
  alunos: Aluno[]
}>()

const emit = defineEmits<{
  (e: 'salvar', evento: Evento): void
  (e: 'cancelar'): void
  (e: 'excluir', id: number): void
}>()

const form = ref<Evento>({ ...props.modelo })
const erros = ref<Record<string, string>>({})
const participanteSelecionado = ref<Participante>({
  idAluno: 0,
  participou: true,
  turma: '',
  periodo: ''
})

watch(() => participanteSelecionado.value.idAluno, (id) => {
  const aluno = props.alunos.find(a => a.id === id)
  if (aluno) {
    participanteSelecionado.value.turma = aluno.turma
    participanteSelecionado.value.periodo = aluno.periodo
  }
})

function adicionarParticipante() {
  if (participanteSelecionado.value.idAluno && !form.value.participantes.some(p => p.idAluno === participanteSelecionado.value.idAluno)) {
    form.value.participantes.push({ ...participanteSelecionado.value })
    participanteSelecionado.value = {
      idAluno: 0,
      participou: true,
      turma: '',
      periodo: ''
    }
  }
}

function alunoNome(id: number) {
  return props.alunos.find(a => a.id === id)?.nome || 'Desconhecido'
}

function validarFormulario() {
  erros.value = {}

  if (!form.value.nome.trim()) erros.value.nome = 'Nome obrigatório'
  if (form.value.valor == null || form.value.valor < 0) erros.value.valor = 'Valor obrigatório'
  if (!form.value.status) erros.value.status = 'Status obrigatório'
  if (!form.value.inicio) erros.value.inicio = 'Data de início obrigatória'

  return Object.keys(erros.value).length === 0
}

function validarESalvar() {
  if (validarFormulario()) emit('salvar', { ...form.value })
}
</script>
