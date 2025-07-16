import api from './api'

export interface AlunoChamada {
  id: number
  chamadaId: number
  alunoId: number
  status: 'presente' | 'falta'
  justificativa?: string
}

export interface AlunoChamadaCreateDTO {
  chamadaId: number
  alunoId: number
  status: 'presente' | 'falta'
  justificativa?: string
}

export interface AlunoChamadaUpdateDTO extends AlunoChamada {}

export default {
  async listarPorChamada(chamadaId: number): Promise<AlunoChamada[]> {
    const resposta = await api.get(`/AlunoChamada/chamada/${chamadaId}`)
    return resposta.data
  },

  async criar(participacao: AlunoChamadaCreateDTO): Promise<void> {
    await api.post(`/AlunoChamada`, participacao)
  },

  async atualizar(id: number, dados: AlunoChamadaUpdateDTO): Promise<void> {
    await api.put(`/AlunoChamada/${id}`, dados)
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/AlunoChamada/${id}`)
  }
}
