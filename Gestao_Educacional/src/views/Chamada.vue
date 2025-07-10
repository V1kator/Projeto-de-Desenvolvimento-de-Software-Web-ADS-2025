// ✅ Arquivo: src/views/Chamada.vue
<template>
  <div class="content p-4">
    <h4 class="mb-4">Histórico de Chamadas</h4>

    <!-- Histórico Agrupado -->
    <div v-for="(grupo, chave) in chamadasAgrupadas" :key="chave" class="mb-4">
      <h6 class="text-secondary">{{ chave }}</h6>
      <ul class="list-group">
        <li v-for="registro in grupo" :key="registro.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            📅 {{ registro.data }} — {{ registro.materia }} — Prof. {{ registro.professor }}
          </span>
          <div>
            <button class="btn btn-sm btn-outline-primary me-2" @click="visualizarChamada(registro)">👁 Ver</button>
            <button class="btn btn-sm btn-outline-warning" @click="editarChamada(registro)">✏️ Editar</button>
          </div>
        </li>
      </ul>
    </div>

    <button class="btn btn-success mb-4" @click="iniciarNovaChamada">
      <i class="fa fa-plus me-2"></i>Nova Chamada
    </button>

    <!-- Formulário de Nova ou Edição de Chamada -->
    <div v-if="formularioAtivo">
      <div class="row g-3 mb-4">
        <div class="col-md-2">
          <label class="form-label">Data</label>
          <input type="date" class="form-control" v-model="dataSelecionada" :max="dataHoje" @change="verificarExibicaoAlunos" />
        </div>

        <div class="col-md-2">
          <label class="form-label">Turma</label>
          <select class="form-select" v-model="turmaSelecionada" @change="verificarExibicaoAlunos">
            <option value="">Selecione</option>
            <option v-for="turma in turmas" :key="turma.id" :value="turma.id">{{ turma.nome }}</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Período</label>
          <select class="form-select" v-model="periodoSelecionado" @change="verificarExibicaoAlunos">
            <option value="">Selecione</option>
            <option value="matutino">Matutino</option>
            <option value="vespertino">Vespertino</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Professor</label>
          <select class="form-select" v-model="funcionarioSelecionado" @change="verificarExibicaoAlunos">
            <option value="">Selecione</option>
            <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Matéria</label>
          <select class="form-select" v-model="materiaSelecionada" @change="verificarExibicaoAlunos">
            <option value="">Selecione</option>
            <option v-for="m in materias" :key="m.id" :value="m.id">{{ m.nome }}</option>
          </select>
        </div>
      </div>

      <ChamadaTable
        v-if="mostrarAlunos"
        :alunos="alunos"
        @marcar-presenca="marcarPresenca"
        @marcar-falta="marcarFalta"
        @editar-justificativa="editarJustificativa"
      />

      <div v-if="mostrarAlunos" class="text-end mt-4">
        <button class="btn btn-primary" @click="enviarChamada">
          <i class="fa fa-save me-2"></i>{{ modoEdicao ? 'Atualizar Chamada' : 'Salvar Chamada' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import ChamadaTable from '@/components/ChamadaTable.vue'

interface Aluno {
  id: number
  nome: string
  status: 'presente' | 'falta' | ''
  justificativa?: string
}

interface RegistroChamada {
  id: number
  data: string
  turma: string
  periodo: 'matutino' | 'vespertino'
  materia: string
  professor: string
  alunos: Aluno[]
}

const dataHoje = new Date().toISOString().split('T')[0]

const dataSelecionada = ref(dataHoje)
const turmaSelecionada = ref('')
const periodoSelecionado = ref('')
const funcionarioSelecionado = ref('')
const materiaSelecionada = ref('')
const mostrarAlunos = ref(false)
const formularioAtivo = ref(false)
const modoEdicao = ref(false)
let chamadaEditandoId: number | null = null

const alunos = ref<Aluno[]>([])

const turmas = [
  { id: '1', nome: '1º Ano A' },
  { id: '2', nome: '2º Ano B' }
]
const funcionarios = [
  { id: '1', nome: 'Carlos Souza' },
  { id: '2', nome: 'Ana Lima' }
]
const materias = [
  { id: '1', nome: 'Matemática' },
  { id: '2', nome: 'História' }
]

const historicoChamadas = ref<RegistroChamada[]>([])

const chamadasAgrupadas = computed(() => {
  const grupos: Record<string, RegistroChamada[]> = {}
  historicoChamadas.value.forEach(chamada => {
    const chave = `${chamada.turma} (${chamada.periodo})`
    if (!grupos[chave]) grupos[chave] = []
    grupos[chave].push(chamada)
  })
  return grupos
})

function iniciarNovaChamada() {
  dataSelecionada.value = dataHoje
  turmaSelecionada.value = ''
  periodoSelecionado.value = ''
  funcionarioSelecionado.value = ''
  materiaSelecionada.value = ''
  alunos.value = []
  mostrarAlunos.value = false
  formularioAtivo.value = true
  modoEdicao.value = false
  chamadaEditandoId = null
}

function visualizarChamada(chamada: RegistroChamada) {
  Swal.fire({
    title: `Chamada - ${chamada.data}`,
    html: `<strong>${chamada.turma}</strong><br>${chamada.materia} - ${chamada.professor}`,
    icon: 'info'
  })
}

function editarChamada(chamada: RegistroChamada) {
  dataSelecionada.value = chamada.data
  turmaSelecionada.value = turmas.find(t => t.nome === chamada.turma)?.id || ''
  periodoSelecionado.value = chamada.periodo
  materiaSelecionada.value = materias.find(m => m.nome === chamada.materia)?.id || ''
  funcionarioSelecionado.value = funcionarios.find(f => f.nome === chamada.professor)?.id || ''
  alunos.value = chamada.alunos.map(a => ({ ...a }))
  mostrarAlunos.value = true
  formularioAtivo.value = true
  modoEdicao.value = true
  chamadaEditandoId = chamada.id
}

function verificarExibicaoAlunos() {
  if (
    dataSelecionada.value &&
    turmaSelecionada.value &&
    periodoSelecionado.value &&
    funcionarioSelecionado.value &&
    materiaSelecionada.value
  ) {
    alunos.value = [
      { id: 1, nome: 'João', status: '', justificativa: '' },
      { id: 2, nome: 'Maria', status: '', justificativa: '' }
    ]
    mostrarAlunos.value = true
  } else {
    mostrarAlunos.value = false
  }
}

function marcarPresenca(id: number) {
  const aluno = alunos.value.find(a => a.id === id)
  if (aluno) {
    aluno.status = 'presente'
    aluno.justificativa = ''
  }
}

function marcarFalta(id: number) {
  const aluno = alunos.value.find(a => a.id === id)
  if (aluno) aluno.status = 'falta'
}

function editarJustificativa(id: number, texto: string) {
  const aluno = alunos.value.find(a => a.id === id)
  if (aluno) aluno.justificativa = texto
}

function enviarChamada() {
  const incompletos = alunos.value.some(a => a.status === '')
  const faltasSemJustificativa = alunos.value.some(a => a.status === 'falta' && !a.justificativa?.trim())

  if (incompletos) {
    Swal.fire('Erro', 'Todos os alunos devem ter presença ou falta marcada.', 'error')
    return
  }

  if (faltasSemJustificativa) {
    Swal.fire('Erro', 'Justifique todas as faltas antes de enviar.', 'error')
    return
  }

  const novaChamada: RegistroChamada = {
    id: chamadaEditandoId || Date.now(),
    data: dataSelecionada.value,
    turma: turmas.find(t => t.id === turmaSelecionada.value)?.nome || '',
    periodo: periodoSelecionado.value as 'matutino' | 'vespertino',
    professor: funcionarios.find(f => f.id === funcionarioSelecionado.value)?.nome || '',
    materia: materias.find(m => m.id === materiaSelecionada.value)?.nome || '',
    alunos: JSON.parse(JSON.stringify(alunos.value))
  }

  if (modoEdicao.value && chamadaEditandoId) {
    const index = historicoChamadas.value.findIndex(c => c.id === chamadaEditandoId)
    if (index !== -1) historicoChamadas.value[index] = novaChamada
    Swal.fire('Atualizado!', 'Chamada atualizada com sucesso.', 'success')
  } else {
    historicoChamadas.value.push(novaChamada)
    Swal.fire('Sucesso!', 'Chamada salva com sucesso.', 'success')
  }

  formularioAtivo.value = false
  mostrarAlunos.value = false
  modoEdicao.value = false
  chamadaEditandoId = null
}
</script>
