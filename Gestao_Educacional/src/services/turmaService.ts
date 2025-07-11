import api from './api'

export interface Turma {
  id: number
  nome: string
  periodo: 'matutino' | 'vespertino'
  status: 'ativo' | 'desligado'
}

export type TurmaCreateDTO = Omit<Turma, 'id'>
export type TurmaUpdateDTO = Turma

export default {
  async listar(): Promise<Turma[]> {
    const resposta = await api.get('/Turma')
    return resposta.data
  },

  async buscarPorId(id: number): Promise<Turma> {
    const resposta = await api.get(`/Turma/${id}`)
    return resposta.data
  },

  async criar(turma: TurmaCreateDTO): Promise<void> {
    await api.post('/Turma', turma)
  },

  async atualizar(turma: TurmaUpdateDTO): Promise<void> {
    await api.put(`/Turma/${turma.id}`, turma)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/Turma/${id}`)
  },

  async listarPorPeriodo(periodo: 'matutino' | 'vespertino'): Promise<Turma[]> {
    const resposta = await api.get(`/Turma/periodo/${periodo}`)
    return resposta.data
  }
}
