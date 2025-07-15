import api from './api'

export interface Turma {
  id: number
  nome: string
  periodo: 'matutino' | 'vespertino'
  status: 'ativo' | 'desligado'
}

export type TurmaCreateDTO = Omit<Turma, 'id'>
export type TurmaUpdateDTO = Turma

function normalizarTurma(t: any): Turma {
  return {
    id: t.id,
    nome: t.nome,
    periodo: t.periodo?.toLowerCase() === 'vespertino' ? 'vespertino' : 'matutino',
    status: t.status?.toLowerCase() === 'desligado' ? 'desligado' : 'ativo'
  }
}

export default {
  async listar(): Promise<Turma[]> {
    const resposta = await api.get('/Turma')
    return resposta.data.map(normalizarTurma)
  },

  async buscarPorId(id: number): Promise<Turma> {
    const resposta = await api.get(`/Turma/${id}`)
    return normalizarTurma(resposta.data)
  },

  async criar(turma: TurmaCreateDTO): Promise<void> {
    const payload = {
      ...turma,
      periodo: turma.periodo.charAt(0).toUpperCase() + turma.periodo.slice(1),
      status: turma.status.charAt(0).toUpperCase() + turma.status.slice(1)
    }
    await api.post('/Turma', payload)
  },

  async atualizar(turma: TurmaUpdateDTO): Promise<void> {
    const payload = {
      ...turma,
      periodo: turma.periodo.charAt(0).toUpperCase() + turma.periodo.slice(1),
      status: turma.status.charAt(0).toUpperCase() + turma.status.slice(1)
    }
    await api.put(`/Turma/${turma.id}`, payload)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/Turma/${id}`)
  },

  async listarPorPeriodo(periodo: 'matutino' | 'vespertino'): Promise<Turma[]> {
    const resposta = await api.get(`/Turma/periodo/${periodo}`)
    return resposta.data.map(normalizarTurma)
  }
}

