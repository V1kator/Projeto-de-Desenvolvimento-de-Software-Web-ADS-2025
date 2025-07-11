<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">Histórico de Sonhos</h5>

    <!-- Tabela -->
    <div class="table-responsive mb-3">
      <table class="table table-bordered align-middle table-hover">
        <thead class="table-primary">
          <tr>
            <th>Data</th>
            <th>Motivo</th>
            <th>Valor Sonhos</th>
            <th>Funcionário</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, index) in listaSonhos" :key="index">
            <td>{{ formatarData(s.data) }}</td>
            <td>{{ s.motivo }}</td>
            <td :class="s.tipo === 'ganho' ? 'text-success' : 'text-danger'">
              {{ s.tipo === 'ganho' ? '+' : '-' }}{{ s.valor }}
            </td>
            <td>{{ s.funcionario }}</td>
            <td>
              <span class="badge"
                :class="s.tipo === 'ganho' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                {{ s.tipo }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formulário de novo sonho -->
    <div class="row g-2 align-items-end">
      <div class="col-md-2">
        <label>Data</label>
        <input v-model="novo.data" type="date" class="form-control" />
      </div>
      <div class="col-md-3">
        <label>Motivo</label>
        <input v-model="novo.motivo" type="text" class="form-control" />
      </div>
      <div class="col-md-2">
        <label>Valor</label>
        <input v-model.number="novo.valor" type="number" class="form-control" />
      </div>
      <div class="col-md-3">
        <label>Funcionário</label>
        <select v-model="novo.funcionario" class="form-select">
          <option value="">Selecione</option>
          <option v-for="f in funcionarios" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
      <div class="col-md-1">
        <label>Tipo</label>
        <select v-model="novo.tipo" class="form-select">
          <option value="ganho">Ganho</option>
          <option value="perda">Perda</option>
        </select>
      </div>
      <div class="col-md-1 text-end">
        <button class="btn btn-warning w-100" @click="adicionar">Adicionar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface RegistroSonho {
  data: string
  motivo: string
  valor: number
  funcionario: string
  tipo: 'ganho' | 'perda'
}

const props = defineProps<{
  sonhos: RegistroSonho[]
  funcionarios: string[]
}>()

const emit = defineEmits<{
  (e: 'atualizar-sonhos', lista: RegistroSonho[]): void
}>()

const listaSonhos = ref<RegistroSonho[]>([])

watch(() => props.sonhos, (val) => {
  listaSonhos.value = [...val]
}, { immediate: true })

const novo = ref<RegistroSonho>({
  data: '',
  motivo: '',
  valor: 0,
  funcionario: '',
  tipo: 'ganho'
})

function adicionar() {
  if (novo.value.data && novo.value.motivo && novo.value.funcionario && novo.value.valor > 0) {
    listaSonhos.value.push({ ...novo.value })
    emit('atualizar-sonhos', [...listaSonhos.value])
    novo.value = { data: '', motivo: '', valor: 0, funcionario: '', tipo: 'ganho' }
  }
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>
