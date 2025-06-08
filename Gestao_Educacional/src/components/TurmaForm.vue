<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">{{ edicao ? 'Editar Turma' : 'Nova Turma' }}</h5>

    <!-- Nome -->
    <div class="mb-3">
      <label for="nome" class="form-label">Nome da Turma</label>
      <input v-model="form.nome" type="text" class="form-control" id="nome" />
      <div v-if="erros.nome" class="text-danger small mt-1">{{ erros.nome }}</div>
    </div>

    <!-- Período -->
    <div class="mb-3">
      <label for="periodo" class="form-label">Período</label>
      <input v-model="form.periodo" type="text" class="form-control" id="periodo" placeholder="Ex: 2024.1" />
      <div v-if="erros.periodo" class="text-danger small mt-1">{{ erros.periodo }}</div>
    </div>

    <!-- Status -->
    <div class="mb-4">
      <label for="status" class="form-label">Status</label>
      <select v-model="form.status" id="status" class="form-select">
        <option value="">Selecione</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
      <div v-if="erros.status" class="text-danger small mt-1">{{ erros.status }}</div>
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

interface Turma {
  id: number
  nome: string
  periodo: string
  status: 'ativo' | 'inativo' | ''
}

const props = defineProps<{
  modelo: Turma
  edicao: boolean
}>()

const emit = defineEmits<{
  (e: 'salvar', turma: Turma): void
  (e: 'cancelar'): void
  (e: 'excluir', id: number): void
}>()

const form = ref<Turma>({ ...props.modelo })
const erros = ref<Record<string, string>>({})

watch(() => props.modelo, (novo) => {
  form.value = { ...novo }
  erros.value = {}
})

function validarFormulario() {
  erros.value = {}

  if (!form.value.nome.trim()) erros.value.nome = 'Nome da turma é obrigatório'
  if (!form.value.periodo.trim()) erros.value.periodo = 'Período é obrigatório'
  if (!form.value.status) erros.value.status = 'Status é obrigatório'

  return Object.keys(erros.value).length === 0
}

function validarESalvar() {
  if (validarFormulario()) {
    emit('salvar', { ...form.value })
  }
}
</script>
