<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">Dados do Aluno</h5>

    <!-- Nome -->
    <div class="mb-3">
      <label class="form-label">Nome</label>
      <input v-model="localAluno.nome" type="text" class="form-control" />
    </div>

    <!-- Período -->
    <div class="mb-3">
      <label class="form-label">Período</label>
      <select v-model="localAluno.periodo" class="form-select">
        <option value="">Selecione</option>
        <option value="Matutino">Matutino</option>
        <option value="Vespertino">Vespertino</option>
        <option value="Noturno">Noturno</option>
      </select>
    </div>

    <!-- Status da Matrícula -->
    <div class="mb-3">
      <label class="form-label">Status da Matrícula</label>
      <select v-model="localAluno.status" class="form-select">
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
    </div>

    <!-- Turma (bloqueada se for edição) -->
    <div class="mb-3">
      <label class="form-label">Turma</label>
      <input
        v-model="localAluno.turma"
        type="text"
        class="form-control"
        :disabled="bloquearTurma"
      />
    </div>

    <!-- Nascimento -->
    <div class="mb-3">
      <label class="form-label">Data de Nascimento</label>
      <input v-model="localAluno.nascimento" type="date" class="form-control" />
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
  transferencias: any[]
}

const props = defineProps<{
  aluno: Aluno
  bloquearTurma?: boolean
}>()

const emit = defineEmits<{
  (e: 'atualizar', alunoAtualizado: Aluno): void
}>()

const localAluno = ref<Aluno>({ ...props.aluno })

watch(() => props.aluno, (novo) => {
  localAluno.value = { ...novo }
}, { immediate: true })

watch(localAluno, (atualizado) => {
  emit('atualizar', atualizado)
}, { deep: true })
</script>
