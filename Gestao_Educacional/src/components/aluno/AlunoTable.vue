<template>
  <div class="shadow-sm bg-white rounded-3 p-4">
    <table class="table align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th>Nome</th>
          <th>Saldo Sonhos</th>
          <th>Período</th>
          <th>Status Matrícula</th>
          <th>Turma</th>
          <th>Data Nasc.</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in alunos" :key="aluno.id">
          <td class="fw-semibold">{{ aluno.nome }}</td>
          <td>{{ aluno.saldoSonhos }}</td>
          <td>{{ aluno.periodo }}</td>
          <td>
            <span
              class="badge"
              :class="aluno.status === 'ativo'
                ? 'bg-success-subtle text-success'
                : 'bg-secondary-subtle text-secondary'"
            >
              {{ aluno.status }}
            </span>
          </td>
          <td>{{ aluno.turma }}</td>
          <td>{{ formatarData(aluno.nascimento) }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('editar', aluno.id)">
              <i class="fa fa-edit me-1"></i>Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  alunos: {
    id: number
    nome: string
    saldoSonhos: number
    periodo: string
    status: 'ativo' | 'inativo'
    turma: string
    nascimento: string
  }[]
}>()

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>
