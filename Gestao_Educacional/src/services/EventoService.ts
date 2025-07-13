import api from './api'

export default {
  async listar() {
    const response = await api.get('/Evento')
    return response.data
  },

  async buscarPorId(id: number) {
    const response = await api.get(`/Evento/${id}`)
    return response.data
  },

  async criar(evento: {
    nome: string
    descricao: string
    valor: number
    inicio: string
    fim?: string
    status: string
  }) {
    const payload = {
      nome: evento.nome,
      descricao: evento.descricao,
      valorSonhos: evento.valor,
      dataInicio: evento.inicio,
      dataFim: evento.fim,
      status: evento.status
    }
    const response = await api.post('/Evento', payload)
    return response
  },

  async atualizar(id: number, evento: {
    nome: string
    descricao: string
    valor: number
    inicio: string
    fim?: string
    status: string
  }) {
    const payload = {
      nome: evento.nome,
      descricao: evento.descricao,
      valorSonhos: evento.valor,
      dataInicio: evento.inicio,
      dataFim: evento.fim,
      status: evento.status
    }
    await api.put(`/Evento/${id}`, payload)
  },

  async deletar(id: number) {
    await api.delete(`/Evento/${id}`)
  }
}
