import api from '@/services/api'

function mapearTipoOperacao(tipo: 'ganho' | 'perda'): 'Adição' | 'Subtração' {
  return tipo === 'ganho' ? 'Adição' : 'Subtração'
}

export default {
  async listarPorAluno(alunoId: number) {
    const response = await api.get(`/HistoricoSonhos/aluno/${alunoId}`)
    return response.data
  },

  async adicionarSonhos(alunoId: number, valor: number, motivo: string, funcionarioId: number) {
    const response = await api.post('/HistoricoSonhos/adicionar', {
      alunoId,
      valor,
      motivo,
      funcionarioId,
      tipo: 'Adição'
    })
    return response.data
  },

  async subtrairSonhos(alunoId: number, valor: number, motivo: string, funcionarioId: number) {
    const response = await api.post('/HistoricoSonhos/subtrair', {
      alunoId,
      valor,
      motivo,
      funcionarioId,
      tipo: 'Subtração'
    })
    return response.data
  }
}
