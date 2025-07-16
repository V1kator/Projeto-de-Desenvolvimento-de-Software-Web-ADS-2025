import api from '@/services/api'

export default {
  async listarPorAluno(alunoId: number) {
    const response = await api.get(`/TransferenciaTurma/aluno/${alunoId}`)
    return response.data
  },

  async transferir(transferencia: {
    alunoId: number
    turmaOrigemId: number
    turmaDestinoId: number
    funcionarioId: number
    dataTransferencia: string
  }) {
    const response = await api.post('/TransferenciaTurma/transferir', transferencia)
    return response.data
  }
}
