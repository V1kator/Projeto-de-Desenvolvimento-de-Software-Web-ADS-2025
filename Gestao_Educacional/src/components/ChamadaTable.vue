<template>
  <div class="bg-light rounded p-4">
    <h4 class="mb-4">Chamada - {{ dataAtual }}</h4>
    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-primary">
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
                :name="'presenca_' + aluno.id"
                :checked="aluno.status === 'presente'"
                @change="$emit('marcar-presenca', aluno.id)"
              />
            </td>
            <td>
              <input
                class="form-check-input"
                type="radio"
                :name="'presenca_' + aluno.id"
                :checked="aluno.status === 'falta'"
                @change="$emit('marcar-falta', aluno.id)"
              />
            </td>
            <td>
              <input
                type="text"
                class="form-control"
                :value="aluno.justificativa"
                :disabled="aluno.status !== 'falta'"
                @input="$emit('editar-justificativa', aluno.id, $event.target.value)"
                placeholder="Digite se necessário"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  alunos: {
    id: number
    nome: string
    status: 'presente' | 'falta' | ''
    justificativa?: string
  }[]
}>()

const dataAtual = new Date().toLocaleDateString()
</script>
