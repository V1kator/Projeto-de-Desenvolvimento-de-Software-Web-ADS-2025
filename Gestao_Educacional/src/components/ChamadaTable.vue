<template>
  <div>
    <h4 class="mt-4 mb-2">Chamada - {{ dataAtual }}</h4>
    <table class="table">
      <thead>
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
              type="radio"
              :name="'presenca_' + aluno.id"
              @change="$emit('marcar-presenca', aluno.id)"
              :checked="aluno.status === 'presente'"
            />
          </td>
          <td>
            <input
              type="radio"
              :name="'presenca_' + aluno.id"
              @change="$emit('marcar-falta', aluno.id)"
              :checked="aluno.status === 'falta'"
            />
          </td>
          <td>
            <input
              v-if="aluno.status === 'falta'"
              type="text"
              class="form-control"
              :value="aluno.justificativa"
              @input="$emit('editar-justificativa', aluno.id, $event.target.value)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

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
