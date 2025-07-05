<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">{{ edicao ? 'Editar Aluno' : 'Novo Aluno' }}</h5>

    <!-- Nome -->
    <div class="mb-3">
      <label for="nome" class="form-label">Nome</label>
      <input v-model="aluno.nome" type="text" class="form-control" id="nome" />
      <div v-if="erros.nome" class="text-danger small mt-1">{{ erros.nome }}</div>
    </div>

    <!-- Período -->
    <div class="mb-3">
      <label for="periodo" class="form-label">Período</label>
      <select v-model="aluno.periodo" class="form-select" id="periodo">
        <option value="">Selecione</option>
        <option value="Matutino">Matutino</option>
        <option value="Vespertino">Vespertino</option>
        <option value="Noturno">Noturno</option>
      </select>
      <div v-if="erros.periodo" class="text-danger small mt-1">{{ erros.periodo }}</div>
    </div>

    <!-- Status -->
    <div class="mb-3">
      <label for="status" class="form-label">Status da Matrícula</label>
      <select v-model="aluno.status" class="form-select" id="status">
        <option value="">Selecione</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
      <div v-if="erros.status" class="text-danger small mt-1">{{ erros.status }}</div>
    </div>

    <!-- Turma -->
    <div class="mb-3">
      <label for="turma" class="form-label">Turma</label>
      <input v-model="aluno.turma" type="text" class="form-control" id="turma" />
      <div v-if="erros.turma" class="text-danger small mt-1">{{ erros.turma }}</div>
    </div>

    <!-- Nascimento -->
    <div class="mb-4">
      <label for="nascimento" class="form-label">Data de Nascimento</label>
      <input v-model="aluno.nascimento" type="date" class="form-control" id="nascimento" />
      <div v-if="erros.nascimento" class="text-danger small mt-1">{{ erros.nascimento }}</div>
    </div>

    <!-- Ações -->
    <div class="d-flex justify-content-end">
      <button class="btn btn-secondary me-2" @click="$emit('cancelar')">Cancelar</button>
      <button class="btn btn-primary" @click="validarESalvar">
        <i class="fa fa-save me-1"></i>Salvar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Aluno {
  id: number
  nome: string
  periodo: string
  status: 'ativo' | 'inativo' | ''
  turma: string
  nascimento: string
  saldoSonhos: number
  sonhos: any[]
  matriculas: any[]
  transferencias: any[]
}

const props = defineProps<{
  modelo: Aluno
  edicao: boolean
}>()

const emit = defineEmits<{
  (e: 'salvar', aluno: Aluno): void
  (e: 'cancelar'): void
}>()

const aluno = ref<Aluno>({ ...props.modelo })
const erros = ref<Record<string, string>>({})

// Se o modelo mudar (ex: ao editar), atualiza os dados no form
watch(() => props.modelo, (novo) => {
  aluno.value = { ...novo }
  erros.value = {}
})

function validarFormulario(): boolean {
  erros.value = {}

  if (!aluno.value.nome.trim()) erros.value.nome = 'Nome é obrigatório'
  if (!aluno.value.periodo) erros.value.periodo = 'Período é obrigatório'
  if (!aluno.value.status) erros.value.status = 'Status é obrigatório'
  if (!aluno.value.turma.trim()) erros.value.turma = 'Turma é obrigatória'
  if (!aluno.value.nascimento) erros.value.nascimento = 'Data de nascimento é obrigatória'

  return Object.keys(erros.value).length === 0
}

function validarESalvar() {
  if (validarFormulario()) {
    emit('salvar', { ...aluno.value })
  }
}
</script>
