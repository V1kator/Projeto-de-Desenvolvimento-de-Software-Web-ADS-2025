<template>
  <div class="shadow-sm bg-white rounded-3 p-4">
    <table class="table align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Valor Sonhos</th>
          <th>Status</th>
          <th>Início</th>
          <th>Fim</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="evento in eventos" :key="evento.id">
          <td class="fw-semibold">{{ evento.nome }}</td>
          <td>{{ evento.descricao }}</td>
          <td>{{ evento.valor }}</td>
          <td>
            <span
              class="badge rounded-pill"
              :class="evento.status === 'ativo' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
              {{ evento.status }}
            </span>
          </td>
          <td>{{ formatarData(evento.inicio) }}</td>
          <td>{{ evento.fim ? formatarData(evento.fim) : '-' }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('editar', evento.id)">
              <i class="fa fa-edit me-1"></i>Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  eventos: Array
})

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>
