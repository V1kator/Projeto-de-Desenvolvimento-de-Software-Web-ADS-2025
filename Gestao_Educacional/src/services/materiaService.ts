import api from './api'

export interface Materia {
  id: number
  nome: string
  status: 'ativo' | 'desligado'
}

function normalizarMateria(m: any): Materia {
  return {
    id: m.id,
    nome: m.nome,
    status: m.status?.toLowerCase() === 'ativo' ? 'ativo' : 'desligado'
  }
}

export default {
  async listar(): Promise<Materia[]> {
    const resposta = await api.get('/Materia')
    return resposta.data.map(normalizarMateria)
  },

  async buscarPorId(id: number): Promise<Materia> {
    const resposta = await api.get(`/Materia/${id}`)
    return normalizarMateria(resposta.data)
  },

  async criar(materia: Omit<Materia, 'id'>): Promise<void> {
    // Envia o status capitalizado como backend espera
    const payload = {
      ...materia,
      status: materia.status.charAt(0).toUpperCase() + materia.status.slice(1)
    }
    await api.post('/Materia', payload)
  },

  async atualizar(materia: Materia): Promise<void> {
    const payload = {
      ...materia,
      status: materia.status.charAt(0).toUpperCase() + materia.status.slice(1)
    }
    await api.put(`/Materia/${materia.id}`, payload)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/Materia/${id}`)
  },

  async listarAtivas(): Promise<Materia[]> {
    const resposta = await api.get('/Materia/ativas')
    return resposta.data.map(normalizarMateria)
  }
}
