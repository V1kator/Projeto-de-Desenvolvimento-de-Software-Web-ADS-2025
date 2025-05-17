<template>
  <div class="shadow-sm bg-white rounded-3 p-4">
    <table class="table align-middle mb-0">
      <thead>
        <tr class="table-light">
          <th class="text-uppercase text-secondary small fw-bold">Nome</th>
          <th class="text-uppercase text-secondary small fw-bold">Período</th>
          <th class="text-uppercase text-secondary small fw-bold">Status</th>
          <th class="text-uppercase text-secondary small fw-bold text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="turma in turmas" :key="turma.id" class="border-bottom">
          <td class="fw-semibold">{{ turma.nome }}</td>
          <td>{{ turma.periodo }}</td>
          <td>
            <span
              class="badge rounded-pill"
              :class="turma.status === 'ativo' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'"
            >
              {{ turma.status }}
            </span>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('editar', turma.id)">
              <i class="fa fa-edit me-1"></i>Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  turmas: {
    id: number
    nome: string
    periodo: string
    status: 'ativo' | 'inativo'
  }[]
}>()
</script>
