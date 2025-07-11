import api from './api'

export interface Funcionario {
  id: number
  nome: string
  cpf: string
  cargo: 'professor' | 'administrador'
  status: 'ativo' | 'desligado'
  materiaId: number | null
  materiaNome?: string
  dataAdmissao: string
  dataDesligamento?: string | null
}

// Criação: sem ID nem nome da matéria
export type FuncionarioCreateDTO = Omit<Funcionario, 'id' | 'materiaNome'>

// Atualização: com ID, mas sem nome da matéria
export type FuncionarioUpdateDTO = Omit<Funcionario, 'materiaNome'>

export default {
  async listarTodos(): Promise<Funcionario[]> {
    const res = await api.get('/Funcionario')
    return res.data
  },

  async buscarPorId(id: number): Promise<Funcionario> {
    const res = await api.get(`/Funcionario/${id}`)
    return res.data
  },

  async criar(func: FuncionarioCreateDTO): Promise<Funcionario> {
    const res = await api.post('/Funcionario', func)
    return res.data
  },

  async atualizar(id: number, func: FuncionarioUpdateDTO): Promise<void> {
    await api.put(`/Funcionario/${id}`, func)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/Funcionario/${id}`)
  },

  async listarProfessores(): Promise<Funcionario[]> {
    const res = await api.get('/Funcionario/professores')
    return res.data
  },

  async verificarCPF(cpf: string): Promise<boolean> {
    const res = await api.get(`/Funcionario/verificar-cpf/${cpf}`)
    return res.data
  },
}
