<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">{{ edicao ? 'Editar Matéria' : 'Nova Matéria' }}</h5>

    <div class="mb-3">
      <label for="nome" class="form-label">Nome da Matéria</label>
      <input v-model="form.nome" type="text" class="form-control" id="nome" placeholder="Ex: Biologia" />
    </div>

    <div class="mb-4">
      <label for="status" class="form-label">Status</label>
      <select v-model="form.status" id="status" class="form-select">
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
    </div>

    <div class="d-flex justify-content-between">
      <!-- Botão Excluir apenas em modo edição -->
      <button
        v-if="edicao"
        class="btn btn-outline-danger"
        @click="$emit('excluir', form.id)"
      >
        <i class="fa fa-trash me-2"></i>Excluir
      </button>

      <div class="ms-auto">
        <button class="btn btn-secondary me-2" @click="$emit('cancelar')">Cancelar</button>
        <button class="btn btn-primary" @click="emitirSalvar">
          <i class="fa fa-save me-2"></i>Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

interface Materia {
  id: number
  nome: string
  status: 'ativo' | 'inativo'
}

const props = defineProps<{
  modelo: Materia
  edicao: boolean
}>()

const emit = defineEmits<{
  (e: 'salvar', materia: Materia): void
  (e: 'cancelar'): void
  (e: 'excluir', id: number): void
}>()

const form = ref<Materia>({ ...props.modelo })

watch(
  () => props.modelo,
  (novo) => {
    form.value = { ...novo }
  }
)

function emitirSalvar() {
  emit('salvar', { ...form.value })
}
</script>
