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
      <input v-model="form.cpf" type="text" class="form-control" id="cpf" maxlength="14" @blur="validarCPF" />
      <div v-if="erros.cpf" class="text-danger small mt-1">{{ erros.cpf }}</div>
    </div>

    <!-- Senha -->
    <div class="mb-3">
      <label for="senha" class="form-label">Senha</label>
      <div class="input-group">
        <input :type="mostrarSenha ? 'text' : 'password'" v-model="form.senha" class="form-control" id="senha" />
        <button type="button" class="btn btn-outline-secondary" @click="mostrarSenha = !mostrarSenha">
          <i :class="mostrarSenha ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
        </button>
      </div>
      <div v-if="!edicao && erros.senha" class="text-danger small mt-1">{{ erros.senha }}</div>
    </div>

    <!-- Cargo -->
    <div class="mb-3">
      <label for="cargo" class="form-label">Cargo</label>
      <select v-model="form.cargo" class="form-select" id="cargo">
        <option value="">Selecione</option>
        <option value="professor">Professor</option>
        <option value="administrativo">Administrador</option>
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
      <select v-model.number="form.materiaId" class="form-select" id="materia" :disabled="form.cargo === 'administrador'">
        <option :value="null">Selecione a matéria</option>
        <option v-for="m in materias" :key="m.id" :value="m.id">{{ m.nome }}</option>
      </select>
      <div v-if="erros.materiaId" class="text-danger small mt-1">{{ erros.materiaId }}</div>
    </div>

    <!-- Data de Admissão -->
    <div class="mb-3">
      <label class="form-label">Data de Admissão</label>
      <input v-model="form.dataAdmissao" type="date" class="form-control" />
      <div v-if="erros.dataAdmissao" class="text-danger small mt-1">{{ erros.dataAdmissao }}</div>
    </div>

    <!-- Data de Desligamento -->
    <div class="mb-4" v-if="form.status === 'desligado'">
      <label class="form-label">Data de Desligamento</label>
      <input v-model="form.dataDesligamento" type="date" class="form-control" />
    </div>

    <!-- Ações -->
    <div class="d-flex justify-content-between">
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
import { ref, watch } from 'vue'

interface Materia {
  id: number
  nome: string
  status: string
}

interface Funcionario {
  id?: number
  nome: string
  cpf: string
  senha?: string
  cargo: 'professor' | 'administrativo' | ''
  status: 'ativo' | 'desligado' | ''
  materiaId: number | null
  dataAdmissao: string
  dataDesligamento: string | null
}

const props = defineProps<{ modelo: Funcionario; edicao: boolean; materias: Materia[] }>()
const emit = defineEmits<{ (e: 'salvar', func: Funcionario): void; (e: 'cancelar'): void; (e: 'excluir', id: number): void }>()

const form = ref<Funcionario>({ ...props.modelo })
const mostrarSenha = ref(false)
const erros = ref<Record<string, string>>({})

watch(() => props.modelo, (novo) => {
  form.value = { ...novo }
  erros.value = {}
})

function validarCPF() {
  const cpf = form.value.cpf.replace(/\D/g, '')
  if (cpf.length !== 11) erros.value.cpf = 'CPF inválido'
  else delete erros.value.cpf
}

function validarFormulario() {
  erros.value = {}
  if (!form.value.nome.trim()) erros.value.nome = 'Nome obrigatório'
  if (!form.value.cpf.trim() || form.value.cpf.replace(/\D/g, '').length !== 11) erros.value.cpf = 'CPF inválido'
  if (!props.edicao && (!form.value.senha || form.value.senha.length < 4)) erros.value.senha = 'Senha obrigatória (mín. 4 caracteres)'
  if (!form.value.cargo) erros.value.cargo = 'Cargo obrigatório'
  if (!form.value.status) erros.value.status = 'Status obrigatório'
  if (form.value.cargo === 'professor' && !form.value.materiaId) erros.value.materiaId = 'Matéria obrigatória'
  if (!form.value.dataAdmissao) erros.value.dataAdmissao = 'Data obrigatória'
  return Object.keys(erros.value).length === 0
}

function validarESalvar() {
  if (validarFormulario()) {
    emit('salvar', { ...form.value })
  }
}
</script>
