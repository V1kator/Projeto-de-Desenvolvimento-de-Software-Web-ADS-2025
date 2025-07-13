<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">Transferência de Turma</h5>

    <!-- Tabela de transferências -->
    <table class="table table-bordered align-middle table-hover mb-3">
      <thead class="table-primary">
        <tr>
          <th>Turma Origem</th>
          <th>Turma Destino</th>
          <th>Data</th>
          <th>Funcionário</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, index) in transferencias" :key="index">
          <td>{{ t.origem }}</td>
          <td>{{ t.destino }}</td>
          <td>{{ formatarData(t.data) }}</td>
          <td>{{ t.funcionario }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Formulário de nova transferência -->
    <div class="row g-2 align-items-end">
      <div class="col-md-3">
        <label>Turma Origem</label>
        <select v-model="nova.origem" class="form-select">
          <option value="">Selecione</option>
          <option v-for="t in turmas" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label>Turma Destino</label>
        <select v-model="nova.destino" class="form-select">
          <option value="">Selecione</option>
          <option v-for="t in turmas" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label>Data da Transferência</label>
        <input v-model="nova.data" type="date" class="form-control" />
      </div>
      <div class="col-md-2">
        <label>Funcionário</label>
        <select v-model="nova.funcionario" class="form-select">
          <option value="">Selecione</option>
          <option v-for="f in funcionarios" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
      <div class="col-md-1 text-end">
        <button class="btn btn-warning w-100" @click="adicionar">Adicionar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Transferencia {
  origem: string
  destino: string
  data: string
  funcionario: string
}

const props = withDefaults(defineProps<{
  transferencias?: Transferencia[]
  turmas: string[]
  funcionarios: string[]
}>(), {
  transferencias: () => [],
  turmas: () => [],
  funcionarios: () => []
})

const emit = defineEmits<{
  (e: 'adicionar-transferencia', nova: Transferencia): void
  (e: 'trocar-turma', novaTurma: string): void
}>()

const nova = ref<Transferencia>({
  origem: '',
  destino: '',
  data: '',
  funcionario: ''
})

function adicionar() {
  if (nova.value.origem && nova.value.destino && nova.value.data && nova.value.funcionario) {
    emit('adicionar-transferencia', { ...nova.value })
    emit('trocar-turma', nova.value.destino)
    nova.value = { origem: '', destino: '', data: '', funcionario: '' }
  }
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>
