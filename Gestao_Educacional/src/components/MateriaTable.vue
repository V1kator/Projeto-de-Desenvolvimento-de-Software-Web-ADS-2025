<template>
  <div class="bg-light rounded p-4">
    <table class="table table-hover align-middle">
      <thead class="table-primary">
        <tr>
          <th>Nome</th>
          <th>Status</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="materia in materias" :key="materia.id">
          <td>{{ materia.nome }}</td>
          <td>
            <span
              :class="[
                'badge',
                materia.status === 'ativo' ? 'bg-success' : 'bg-secondary'
              ]"
            >
              {{ materia.status }}
            </span>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-primary" @click="$emit('editar', materia.id)">
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
  materias: {
    id: number
    nome: string
    status: 'ativo' | 'inativo'
  }[]
}>()
</script>
