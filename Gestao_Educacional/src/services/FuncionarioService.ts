import api from './api'

export interface Funcionario {
  id: number
  nome: string
  cpf: string
  cargo: string
  status: string
  materiaId: number | null
  materiaNome?: string
  dataAdmissao: string
  dataDesligamento: string | null
  senha?: string
}

export interface FuncionarioCreateDTO {
  nome: string
  cpf: string
  senha: string
  cargo: string
  status: string
  materiaId: number | null
  dataAdmissao: string
  dataDesligamento: string | null
}

export default {
  async listarTodos(): Promise<Funcionario[]> {
    const response = await api.get('/Funcionario')
    return response.data
  },

  async buscarPorId(id: number): Promise<Funcionario> {
    const response = await api.get(`/Funcionario/${id}`)
    return response.data
  },

  async criar(dados: FuncionarioCreateDTO): Promise<void> {
    const payload = {
      ...dados,
      dataAdmissao: new Date(dados.dataAdmissao).toISOString(),
      dataDesligamento: dados.dataDesligamento
        ? new Date(dados.dataDesligamento).toISOString()
        : null
    }

    await api.post('/Funcionario', payload)
  },

  async atualizar(id: number, dados: Funcionario): Promise<void> {
    const payload = {
      nome: dados.nome,
      cargo: dados.cargo,
      status: dados.status,
      materiaId: dados.materiaId,
      senha: dados.senha,
      dataAdmissao: dados.dataAdmissao
        ? new Date(dados.dataAdmissao).toISOString()
        : null,
      dataDesligamento: dados.dataDesligamento
        ? new Date(dados.dataDesligamento).toISOString()
        : null
    }

    await api.put(`/Funcionario/${id}`, payload)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/Funcionario/${id}`)
  },

  async verificarCpfExistente(cpf: string): Promise<boolean> {
    const response = await api.get(`/Funcionario/verificar-cpf/${cpf}`)
    return response.data
  },

  async listarProfessoresAtivos(): Promise<Funcionario[]> {
    const response = await api.get('/Funcionario/professores')
    return response.data
  },
  async loginPorCpf(cpf: string): Promise<{ cpf: string; senha: string }> {
  const response = await api.get(`/Funcionario/login/${cpf}`)
  return response.data
}
}
