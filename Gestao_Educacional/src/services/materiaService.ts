import api from './api'

export interface Materia {
  id: number
  nome: string
  status: 'ativo' | 'desligado' // Corrigido para refletir os valores do banco
}

export default {
  async listar(): Promise<Materia[]> {
    const resposta = await api.get('/Materia')
    return resposta.data
  },

  async buscarPorId(id: number): Promise<Materia> {
    const resposta = await api.get(`/Materia/${id}`)
    return resposta.data
  },

  async criar(materia: Omit<Materia, 'id'>): Promise<void> {
    await api.post('/Materia', materia)
  },

  async atualizar(materia: Materia): Promise<void> {
    await api.put(`/Materia/${materia.id}`, materia)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/Materia/${id}`)
  },

  async listarAtivas(): Promise<Materia[]> {
    const resposta = await api.get('/Materia/ativas')
    return resposta.data
  }
}
