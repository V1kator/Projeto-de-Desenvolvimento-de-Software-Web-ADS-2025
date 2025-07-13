<template>
  <div class="content p-4">
    <h4 class="mb-4">Histórico de Chamadas</h4>

    <div v-for="(grupo, chave) in chamadasAgrupadas" :key="chave" class="mb-4">
      <h6 class="text-secondary">{{ chave }}</h6>
      <ul class="list-group">
        <li v-for="registro in grupo" :key="registro.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            📅 {{ registro.data.split('T')[0] }} — {{ registro.materiaNome }} — Prof. {{ registro.funcionarioNome }}
          </span>
          <div>
            <button class="btn btn-sm btn-outline-primary me-2" @click="visualizarChamada(registro)">👁 Ver</button>
            <button class="btn btn-sm btn-outline-warning me-2" @click="editarChamada(registro)">✏️ Editar</button>
            <button class="btn btn-sm btn-outline-danger" @click="excluirChamada(registro.id)">🗑 Excluir</button>
          </div>
        </li>
      </ul>
    </div>

    <button class="btn btn-success mb-4" @click="iniciarNovaChamada">
      <i class="fa fa-plus me-2"></i>Nova Chamada
    </button>

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
          <select class="form-select" v-model="funcionarioSelecionado">
            <option value="">Selecione</option>
            <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Matéria</label>
          <select class="form-select" v-model="materiaSelecionada">
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
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import ChamadaTable from '@/components/ChamadaTable.vue'
import ChamadaService from '@/services/ChamadaService'
import AlunoService from '@/services/AlunoService'
import TurmaService from '@/services/turmaService'
import FuncionarioService from '@/services/FuncionarioService'
import MateriaService from '@/services/materiaService'

interface Aluno {
  id: number
  nome: string
  status: 'presente' | 'falta' | ''
  justificativa?: string
  periodo: string
  statusMatricula: string
}

interface RegistroChamada {
  id: number
  data: string
  turmaId: number
  funcionarioId: number
  materiaId: number
  periodo: 'Matutino' | 'Vespertino'
  turmaNome: string
  funcionarioNome: string
  materiaNome: string
  alunos?: Aluno[]
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
const chamadaEditandoId = ref<number | null>(null)

const alunos = ref<Aluno[]>([])
const turmas = ref<any[]>([])
const funcionarios = ref<any[]>([])
const materias = ref<any[]>([])
const historicoChamadas = ref<RegistroChamada[]>([])

const chamadasAgrupadas = computed(() => {
  const grupos: Record<string, RegistroChamada[]> = {}
  historicoChamadas.value.forEach(chamada => {
    const chave = `${chamada.turmaNome} (${chamada.periodo})`
    if (!grupos[chave]) grupos[chave] = []
    grupos[chave].push(chamada)
  })
  return grupos
})

onMounted(async () => {
  turmas.value = await TurmaService.listar()
  funcionarios.value = await FuncionarioService.listarProfessoresAtivos()
  materias.value = await MateriaService.listarAtivas()
  historicoChamadas.value = await ChamadaService.listar()
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
  chamadaEditandoId.value = null
}

function verificarExibicaoAlunos() {
  if (turmaSelecionada.value && periodoSelecionado.value) {
    AlunoService.buscarPorTurma(Number(turmaSelecionada.value)).then(lista => {
      alunos.value = lista
        .filter(
          (a: any) =>
            a.statusMatricula?.toLowerCase() === 'ativo' &&
            a.periodo?.toLowerCase() === periodoSelecionado.value
        )
        .map((a: any) => ({
          id: a.id,
          nome: a.nome,
          status: '',
          justificativa: '',
          periodo: a.periodo,
          statusMatricula: a.statusMatricula
        }))
      mostrarAlunos.value = alunos.value.length > 0
    })
  } else {
    mostrarAlunos.value = false
    alunos.value = []
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

  const payload = {
    data: `${dataSelecionada.value}T00:00:00`,
    periodo: periodoSelecionado.value.charAt(0).toUpperCase() + periodoSelecionado.value.slice(1),
    turmaId: Number(turmaSelecionada.value),
    funcionarioId: Number(funcionarioSelecionado.value),
    materiaId: Number(materiaSelecionada.value),
    alunos: alunos.value.map(a => ({
      alunoId: a.id,
      status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
      justificativa: a.status === 'falta' ? a.justificativa : null
    }))
  }

  const acao = modoEdicao.value && chamadaEditandoId.value
    ? ChamadaService.atualizar(chamadaEditandoId.value, payload)
    : ChamadaService.criar(payload)

  acao.then(() => {
    Swal.fire('Sucesso!', 'Chamada salva com sucesso.', 'success')
    recarregarChamadas()
    formularioAtivo.value = false
    mostrarAlunos.value = false
    modoEdicao.value = false
    chamadaEditandoId.value = null
  })
}

function editarChamada(registro: RegistroChamada) {
  dataSelecionada.value = registro.data.split('T')[0]
  periodoSelecionado.value = registro.periodo.toLowerCase()
  funcionarioSelecionado.value = registro.funcionarioId.toString()
  materiaSelecionada.value = registro.materiaId.toString()
  turmaSelecionada.value = registro.turmaId.toString()
  mostrarAlunos.value = true
  formularioAtivo.value = true
  modoEdicao.value = true
  chamadaEditandoId.value = registro.id
}

function visualizarChamada(registro: RegistroChamada) {
  Swal.fire({
    title: `Chamada - ${registro.data}`,
    html: `<strong>${registro.turmaNome}</strong><br>${registro.materiaNome} - ${registro.funcionarioNome}`,
    icon: 'info'
  })
}

function excluirChamada(id: number) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Essa ação não pode ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      ChamadaService.deletar(id).then(() => {
        Swal.fire('Excluído!', 'A chamada foi removida.', 'success')
        recarregarChamadas()
      })
    }
  })
}

function recarregarChamadas() {
  ChamadaService.listar().then(lista => {
    historicoChamadas.value = lista
  })
}
</script>
