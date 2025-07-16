<template>
  <div class="bg-light rounded p-4 mb-4">
    <h5 class="mb-3">Histórico de Sonhos</h5>

    <!-- Tabela de registros -->
    <table class="table table-bordered align-middle table-hover mb-3" >
      <thead class="table-primary">
        <tr>
          <th>Data</th>
          <th>Motivo</th>
          <th>Valor</th>
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

    <!-- Formulário de adição -->
    <div class="row g-2 align-items-end">
      <div class="col-md-3">
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
      <div class="col-md-2">
        <label>Funcionário</label>
        <select v-model="novo.funcionario" class="form-select">
          <option value="">Selecione</option>
          <option v-for="f in funcionarios" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label>Tipo</label>
        <select v-model="novo.tipo" class="form-select" >
          <option value="ganho">Ganho</option>
          <option value="perda">Perda</option>
        </select>
      </div>
      <div class="col-md-2 ms-auto text-end">
        <button class="btn btn-warning w-100" @click="adicionar">Adicionar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import HistoricoSonhosService from '@/services/HistoricoSonhosService'

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
  alunoId: number
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

async function adicionar() {
  if (!novo.value.data || !novo.value.motivo || !novo.value.funcionario || novo.value.valor <= 0) return

  const funcionarioNome = novo.value.funcionario
  const funcionarioId = await buscarFuncionarioIdPorNome(funcionarioNome)
  if (!funcionarioId || !props.alunoId) {
    alert('Aluno ou Funcionário inválido.')
    return
  }

  try {
    if (novo.value.tipo === 'ganho') {
      await HistoricoSonhosService.adicionarSonhos(props.alunoId, novo.value.valor, novo.value.motivo, funcionarioId)
    } else {
      await HistoricoSonhosService.subtrairSonhos(props.alunoId, novo.value.valor, novo.value.motivo, funcionarioId)
    }

    const sonhosAtualizados = await HistoricoSonhosService.listarPorAluno(props.alunoId)
    const sonhosFormatados = sonhosAtualizados.map((s: any) => ({
      data: s.data.split('T')[0],
      motivo: s.motivo,
      valor: s.valor,
      funcionario: s.funcionarioNome ?? '',
      tipo: s.tipo === 'Adição' ? 'ganho' : 'perda'
    }))

    listaSonhos.value = sonhosFormatados
    emit('atualizar-sonhos', sonhosFormatados)

    novo.value = { data: '', motivo: '', valor: 0, funcionario: '', tipo: 'ganho' }
  } catch (error) {
    console.error('Erro ao adicionar sonhos:', error)
    alert('Erro ao salvar sonho. Verifique os dados.')
  }
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

async function buscarFuncionarioIdPorNome(nome: string): Promise<number | null> {
  try {
    const funcionarios = await import('@/services/FuncionarioService').then(m => m.default.listarTodos())
    const funcionario = funcionarios.find((f: any) => f.nome === nome)
    return funcionario?.id ?? null
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error)
    return null
  }
}
</script>
