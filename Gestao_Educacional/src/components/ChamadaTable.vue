<!-- src/components/ChamadaTable.vue -->
<template>
  <div class="shadow-sm bg-white rounded-3 p-4">
    <h5 class="mb-4">Lista de Alunos</h5>
    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Aluno</th>
            <th>Presente</th>
            <th>Faltou</th>
            <th>Justificativa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aluno in alunos" :key="aluno.id">
            <td>{{ aluno.nome }}</td>
            <td>
              <input
                class="form-check-input"
                type="radio"
                :name="'status_' + aluno.id"
                value="presente"
                :checked="aluno.status === 'presente'"
                @change="$emit('marcar-presenca', aluno.id)"
              />
            </td>
            <td>
              <input
                class="form-check-input"
                type="radio"
                :name="'status_' + aluno.id"
                value="falta"
                :checked="aluno.status === 'falta'"
                @change="$emit('marcar-falta', aluno.id)"
              />
            </td>
            <td>
              <input
                type="text"
                class="form-control form-control-sm"
                :disabled="aluno.status !== 'falta'"
                :value="aluno.justificativa"
                @input="$emit('editar-justificativa', aluno.id, $event.target.value)"
                placeholder="Digite a justificativa"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  alunos: {
    id: number
    nome: string
    status: 'presente' | 'falta' | ''
    justificativa?: string
  }[]
}>()
</script>
