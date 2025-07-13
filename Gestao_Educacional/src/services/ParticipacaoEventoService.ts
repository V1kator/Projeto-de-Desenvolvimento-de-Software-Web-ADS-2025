import api from './api'

export default {
  async criar(participacao: { alunoId: number; eventoId: number; participou: boolean }) {
    const response = await api.post(`/Evento/${participacao.eventoId}/participacao/${participacao.alunoId}`, {
      participou: participacao.participou
    })
    return response.data
  },

  async listarPorEvento(eventoId: number) {
    const response = await api.get(`/ParticipacaoEvento/evento/${eventoId}`)
    return response.data
  },

  async deletar(id: number) {
    await api.delete(`/ParticipacaoEvento/${id}`)
  }
}
