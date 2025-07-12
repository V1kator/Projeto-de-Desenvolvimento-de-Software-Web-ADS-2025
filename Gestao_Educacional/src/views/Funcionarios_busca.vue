<template>
  <div class="content p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input v-model="filtro" class="form-control w-50" type="text" placeholder="Pesquisar funcionário..." />
      <button class="btn btn-primary" @click="abrirFormularioNovo">
        <i class="fa fa-plus me-2"></i>Novo Funcionário
      </button>
    </div>

    <FuncionarioForm
      v-if="modoFormulario.ativo"
      :modelo="formulario"
      :edicao="modoFormulario.edicao"
      :materias="materiasDisponiveis"
      @salvar="salvarFuncionario"
      @cancelar="cancelarFormulario"
      @excluir="excluirFuncionario"
    />

    <FuncionarioTable :funcionarios="funcionariosFiltrados" @editar="abrirFormularioEdicao" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import FuncionarioForm from '@/components/FuncionarioForm.vue'
import FuncionarioTable from '@/components/FuncionarioTable.vue'
import FuncionarioService, { Funcionario, FuncionarioCreateDTO } from '@/services/FuncionarioService'
import MateriaService, { Materia } from '@/services/materiaService'

const materiasDisponiveis = ref<Materia[]>([])
const funcionarios = ref<Funcionario[]>([])
const filtro = ref('')
const formulario = ref<FuncionarioCreateDTO | (Funcionario & { id: number })>({
  nome: '',
  cpf: '',
  senha: '',
  cargo: 'professor',
  status: 'ativo',
  materiaId: null,
  dataAdmissao: '',
  dataDesligamento: null
})

const modoFormulario = ref({ ativo: false, edicao: false })

const funcionariosFiltrados = computed(() =>
  funcionarios.value.filter(f => f.nome.toLowerCase().includes(filtro.value.toLowerCase()))
)

onMounted(() => {
  carregarFuncionarios()
  carregarMaterias()
})

async function carregarFuncionarios() {
  funcionarios.value = await FuncionarioService.listarTodos()
}

async function carregarMaterias() {
  try {
    materiasDisponiveis.value = await MateriaService.listarAtivas()
  } catch (error) {
    console.error('Erro ao carregar matérias:', error)
    Swal.fire({ icon: 'error', title: 'Erro ao carregar matérias' })
  }
}

function abrirFormularioNovo() {
  formulario.value = {
    nome: '',
    cpf: '',
    senha: '',
    cargo: 'professor',
    status: 'ativo',
    materiaId: null,
    dataAdmissao: '',
    dataDesligamento: null
  }
  modoFormulario.value = { ativo: true, edicao: false }
}

function formatarData(data: string | null | undefined): string {
  if (!data) return ''
  return data.split('T')[0]
}

async function abrirFormularioEdicao(id: number) {
  const func = await FuncionarioService.buscarPorId(id)
  formulario.value = {
    ...func,
    cargo: func.cargo.toLowerCase(),
    status: func.status.toLowerCase(),
    dataAdmissao: formatarData(func.dataAdmissao),
    dataDesligamento: formatarData(func.dataDesligamento),
    senha: ''
  }
  modoFormulario.value = { ativo: true, edicao: true }
}

function cancelarFormulario() {
  modoFormulario.value = { ativo: false, edicao: false }
}

async function salvarFuncionario(func: FuncionarioCreateDTO | (Funcionario & { id: number })) {
  try {
    if (modoFormulario.value.edicao && 'id' in func) {
      await FuncionarioService.atualizar(func.id, func)
      Swal.fire({ icon: 'success', title: 'Funcionário atualizado com sucesso!', showConfirmButton: false, timer: 1500 })
    } else {
      await FuncionarioService.criar(func)
      Swal.fire({ icon: 'success', title: 'Funcionário cadastrado com sucesso!', showConfirmButton: false, timer: 1500 })
    }
    cancelarFormulario()
    await carregarFuncionarios()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Erro ao salvar funcionário', text: (e as any).message })
  }
}

async function excluirFuncionario(id: number) {
  const func = funcionarios.value.find(f => f.id === id)
  if (!func) return

  const confirm = await Swal.fire({
    title: `Deseja excluir ${func.nome}?`,
    text: 'Essa ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (confirm.isConfirmed) {
    await FuncionarioService.excluir(id)
    await carregarFuncionarios()
    cancelarFormulario()
    Swal.fire({ icon: 'success', title: 'Funcionário excluído com sucesso!', showConfirmButton: false, timer: 1500 })
  }
}
</script>
