<template>
  <div class="bg-light rounded p-4">
    <h5 class="mb-3">Novo Aluno</h5>

    <div class="mb-3">
      <label class="form-label">Nome</label>
      <input v-model="modelo.nome" type="text" class="form-control" />
    </div>

    <div class="mb-3">
      <label class="form-label">Período</label>
      <select v-model="modelo.periodo" class="form-select">
        <option value="">Selecione</option>
        <option value="Matutino">Matutino</option>
        <option value="Vespertino">Vespertino</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Status</label>
      <select v-model="modelo.status" class="form-select">
        <option value="">Selecione</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
        <option value="desligado">Desligado</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Turma</label>
      <select v-model="modelo.turma" class="form-select">
        <option value="">Selecione</option>
        <option v-for="turma in turmasDisponiveis" :key="turma" :value="turma">
          {{ turma }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Data de Nascimento</label>
      <input v-model="modelo.nascimento" type="date" class="form-control" />
    </div>

    <div class="d-flex justify-content-end">
      <button class="btn btn-secondary me-2" @click="$emit('cancelar')">Cancelar</button>
      <button class="btn btn-success" @click="$emit('salvar', modelo)">Salvar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Aluno {
  id: number
  nome: string
  periodo: string
  status: 'ativo' | 'inativo' | 'desligado'
  turma: string
  nascimento: string
  saldoSonhos: number
  sonhos: any[]
  transferencias: any[]
}

defineProps<{
  modelo: Aluno
  turmasDisponiveis: string[]
}>()

defineEmits<{
  (e: 'salvar', aluno: Aluno): void
  (e: 'cancelar'): void
}>()
</script>
