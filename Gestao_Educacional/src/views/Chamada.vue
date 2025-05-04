<template>
  <Spinner />
  <Sidebar />

  <div class="content p-4">

     <!-- <SalesTable /> -->
    <!-- <ToDoList /> -->

    <ChamadaForm :data="dataSelecionada" @atualizar-data="mudarData" />
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
import Spinner from '@/components/Spinner.vue'
import Sidebar from '@/components/Sidebar.vue'
import ChamadaForm from '@/components/ChamadaForm.vue'
import ChamadaTable from '@/components/ChamadaTable.vue'

interface Aluno {
  id: number
  nome: string
  status: 'presente' | 'falta' | ''
  justificativa?: string
}

// simula um banco
const chamadasPorData = ref<Record<string, Aluno[]>>({})

// inicia com a data atual
const dataSelecionada = ref(new Date().toISOString().split('T')[0])

// alunos temporario
function inicializarAlunosParaData(data: string) {
  if (!chamadasPorData.value[data]) {
    chamadasPorData.value[data] = [
      { id: 1, nome: 'Maria', status: '', justificativa: '' },
      { id: 2, nome: 'João', status: '', justificativa: '' },
      { id: 3, nome: 'Ana', status: '', justificativa: '' },
    ]
  }
}

// mudança de data
function mudarData(novaData: string) {
  dataSelecionada.value = novaData
  inicializarAlunosParaData(novaData)
}

// presença
function marcarPresenca(alunoId: number) {
  const alunos = chamadasPorData.value[dataSelecionada.value]
  const aluno = alunos.find((a) => a.id === alunoId)
  if (aluno) {
    aluno.status = 'presente'
    aluno.justificativa = ''
  }
}

// falta
function marcarFalta(alunoId: number) {
  const alunos = chamadasPorData.value[dataSelecionada.value]
  const aluno = alunos.find((a) => a.id === alunoId)
  if (aluno) {
    aluno.status = 'falta'
  }
}

// edita justificativa
function editarJustificativa(alunoId: number, novaJustificativa: string) {
  const alunos = chamadasPorData.value[dataSelecionada.value]
  const aluno = alunos.find((a) => a.id === alunoId)
  if (aluno) {
    aluno.justificativa = novaJustificativa
  }
}

// inicia com a data atual
inicializarAlunosParaData(dataSelecionada.value)
</script>

