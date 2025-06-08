<template>
  <div class="shadow-sm bg-white rounded-3 p-4">
    <table class="table align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Cargo</th>
          <th>Status</th>
          <th>Matéria</th>
          <th>Admissão</th>
          <th>Desligamento</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="func in funcionarios" :key="func.id">
          <td class="fw-semibold">{{ func.nome }}</td>
          <td>{{ formatarCPF(func.cpf) }}</td>
          <td>{{ func.cargo }}</td>
          <td>
            <span
              class="badge rounded-pill"
              :class="func.status === 'ativo' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'"
            >
              {{ func.status }}
            </span>
          </td>
          <td>{{ func.materia }}</td>
          <td>{{ formatarData(func.admissao) }}</td>
          <td>{{ func.desligamento ? formatarData(func.desligamento) : '-' }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('editar', func.id)">
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
  funcionarios: {
    id: number
    nome: string
    cpf: string
    cargo: 'professor' | 'administrador'
    status: 'ativo' | 'desligado'
    materia: string
    admissao: string
    desligamento?: string
  }[]
}>()

function formatarCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>
