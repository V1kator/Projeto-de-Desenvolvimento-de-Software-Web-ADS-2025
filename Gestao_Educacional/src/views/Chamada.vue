<template>
  <div class="content p-4">
    <div class="d-flex justify-content-between mb-3">
      <label class="form-label me-2">Data:</label>
      <input type="date" class="form-control w-auto" v-model="dataSelecionada" @change="carregarChamada" />
    </div>

    <ChamadaTable
      :alunos="chamadasPorData[dataSelecionada] || []"
      @marcar-presenca="marcarPresenca"
      @marcar-falta="marcarFalta"
      @editar-justificativa="editarJustificativa"

    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChamadaTable from '@/components/ChamadaTable.vue'

interface Aluno {
  id: number
  nome: string
  status: 'presente' | 'falta' | ''
  justificativa?: string
}

const chamadasPorData = ref<Record<string, Aluno[]>>({})
const dataSelecionada = ref(new Date().toISOString().split('T')[0])

function carregarChamada() {
  if (!chamadasPorData.value[dataSelecionada.value]) {
    chamadasPorData.value[dataSelecionada.value] = [
      { id: 1, nome: 'Maria', status: '', justificativa: '' },
      { id: 2, nome: 'João', status: '', justificativa: '' },
    ]
  }
}

function marcarPresenca(id: number) {
  const aluno = chamadasPorData.value[dataSelecionada.value]?.find(a => a.id === id)
  if (aluno) {
    aluno.status = 'presente'
    aluno.justificativa = ''
  }
}

function marcarFalta(id: number) {
  const aluno = chamadasPorData.value[dataSelecionada.value]?.find(a => a.id === id)
  if (aluno) aluno.status = 'falta'
}

function editarJustificativa(id: number, texto: string) {
  const aluno = chamadasPorData.value[dataSelecionada.value]?.find(a => a.id === id)
  if (aluno) aluno.justificativa = texto
}

// Inicializa ao abrir
carregarChamada()
</script>
