<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Nome</th>
        <th>CPF</th>
        <th>Cargo</th>
        <th>Status</th>
        <th>Matéria</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="f in funcionarios" :key="f.id">
        <td>{{ f.nome }}</td>
        <td>{{ f.cpf }}</td>
        <td>{{ f.cargo }}</td>
        <td>{{ f.status }}</td>
        <td>{{ f.materiaNome || '-' }}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" @click="$emit('editar', f.id)">
            <i class="fa fa-edit"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{ funcionarios: any[] }>()
defineEmits<{ (e: 'editar', id: number): void }>()
</script>
