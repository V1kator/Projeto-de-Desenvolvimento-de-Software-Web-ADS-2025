<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">{{ edicao ? 'Editar Funcionário' : 'Novo Funcionário' }}</h5>

    <!-- Nome -->
    <div class="mb-3">
      <label for="nome" class="form-label">Nome</label>
      <input v-model="form.nome" type="text" class="form-control" id="nome" />
      <div v-if="erros.nome" class="text-danger small mt-1">{{ erros.nome }}</div>
    </div>

    <!-- CPF -->
    <div class="mb-3">
      <label for="cpf" class="form-label">CPF</label>
      <input
        v-model="form.cpf"
        type="text"
        class="form-control"
        id="cpf"
        placeholder="000.000.000-00"
        maxlength="14"
        @blur="validarCPF"
      />
      <div v-if="erros.cpf" class="text-danger small mt-1">{{ erros.cpf }}</div>
    </div>

    <!-- Cargo -->
    <div class="mb-3">
      <label for="cargo" class="form-label">Cargo</label>
      <select v-model="form.cargo" class="form-select" id="cargo">
        <option value="">Selecione</option>
        <option value="professor">Professor</option>
        <option value="administrador">Administrador</option>
      </select>
      <div v-if="erros.cargo" class="text-danger small mt-1">{{ erros.cargo }}</div>
    </div>

    <!-- Status -->
    <div class="mb-3">
      <label for="status" class="form-label">Status</label>
      <select v-model="form.status" class="form-select" id="status">
        <option value="">Selecione</option>
        <option value="ativo">Ativo</option>
        <option value="desligado">Desligado</option>
      </select>
      <div v-if="erros.status" class="text-danger small mt-1">{{ erros.status }}</div>
    </div>

    <!-- Matéria -->
    <div class="mb-3">
      <label for="materia" class="form-label">Matéria</label>
      <select v-model="form.materia" class="form-select" id="materia">
        <option value="">Selecione a matéria</option>
        <option v-for="m in materias" :key="m" :value="m">{{ m }}</option>
      </select>
      <div v-if="erros.materia" class="text-danger small mt-1">{{ erros.materia }}</div>
    </div>

    <!-- Admissão -->
    <div class="mb-3">
      <label class="form-label">Data de Admissão</label>
      <input v-model="form.admissao" type="date" class="form-control" />
      <div v-if="erros.admissao" class="text-danger small mt-1">{{ erros.admissao }}</div>
    </div>

    <!-- Desligamento -->
    <div class="mb-4" v-if="form.status === 'desligado'">
      <label class="form-label">Data de Desligamento</label>
      <input v-model="form.desligamento" type="date" class="form-control" />
    </div>

    <!-- Ações -->
    <div class="d-flex justify-content-between">
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

interface Funcionario {
  id: number
  nome: string
  cpf: string
  cargo: 'professor' | 'administrador' | ''
  status: 'ativo' | 'desligado' | ''
  materia: string
  admissao: string
  desligamento?: string
}

const props = defineProps<{
  modelo: Funcionario
  edicao: boolean
  materias: string[]
}>()

const emit = defineEmits<{
  (e: 'salvar', func: Funcionario): void
  (e: 'cancelar'): void
  (e: 'excluir', id: number): void
}>()

const form = ref<Funcionario>({ ...props.modelo })
const erros = ref<Record<string, string>>({})

watch(() => props.modelo, (novo) => {
  form.value = { ...novo }
  erros.value = {}
})

function validarCPF() {
  const cpf = form.value.cpf.replace(/\D/g, '')
  if (cpf.length !== 11) {
    erros.value.cpf = 'CPF inválido'
  } else {
    delete erros.value.cpf
  }
}

function validarFormulario() {
  erros.value = {}

  if (!form.value.nome.trim()) erros.value.nome = 'Nome obrigatório'
  if (!form.value.cpf.trim() || form.value.cpf.replace(/\D/g, '').length !== 11)
    erros.value.cpf = 'CPF inválido'
  if (!form.value.cargo) erros.value.cargo = 'Cargo obrigatório'
  if (!form.value.status) erros.value.status = 'Status obrigatório'
  if (!form.value.materia) erros.value.materia = 'Matéria obrigatória'
  if (!form.value.admissao) erros.value.admissao = 'Data de admissão obrigatória'

  return Object.keys(erros.value).length === 0
}

function validarESalvar() {
  if (validarFormulario()) {
    emit('salvar', { ...form.value })
  }
}
</script>
