import api from './api'

export interface AlunoPresenca {
  alunoId: number
  status: 'Presente' | 'Falta'
  justificativa?: string | null
}

export interface Chamada {
  id: number
  data: string
  turmaId: number
  turmaNome: string
  periodo: 'Matutino' | 'Vespertino'
  materiaId: number
  materiaNome: string
  funcionarioId: number
  funcionarioNome: string
  alunos: AlunoPresenca[]
}

export interface ChamadaCreateDTO {
  turmaId: number
  periodo: 'Matutino' | 'Vespertino'
  funcionarioId: number
  materiaId: number
  data: string
  alunos: AlunoPresenca[]
}

export default {
  async listar(): Promise<Chamada[]> {
    const resposta = await api.get('/Chamada')
    return resposta.data
  },

  async buscarPorId(id: number): Promise<Chamada> {
    const resposta = await api.get(`/Chamada/${id}`)
    return resposta.data
  },

  async criar(chamada: ChamadaCreateDTO): Promise<void> {
    await api.post('/Chamada', chamada)
  },

  async atualizar(id: number, chamada: ChamadaCreateDTO): Promise<void> {
    await api.put(`/Chamada/${id}`, chamada)
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/Chamada/${id}`)
  }
}
