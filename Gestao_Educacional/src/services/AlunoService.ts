import api from '@/services/api'

interface AlunoCreateDTO {
  nome: string
  dataNascimento: string // formato ISO yyyy-mm-dd
  turmaId: number | null
  statusMatricula: 'Ativo' | 'Inativo' | 'Desligado'
  periodo: 'Matutino' | 'Vespertino'
}

interface AlunoUpdateDTO extends AlunoCreateDTO {}

function mapearStatus(status: string | undefined): 'Ativo' | 'Inativo' | 'Desligado' {
  if (!status) {
    console.warn('Status inválido: undefined — padrão Ativo aplicado.')
    return 'Ativo'
  }

  const mapa: Record<string, 'Ativo' | 'Inativo' | 'Desligado'> = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    desligado: 'Desligado'
  }

  return mapa[status.toLowerCase()] ?? 'Ativo'
}

function mapearPeriodo(periodo: string | undefined): 'Matutino' | 'Vespertino' {
  if (!periodo) {
    console.warn('Período inválido: undefined — padrão Matutino aplicado.')
    return 'Matutino'
  }

  const mapa: Record<string, 'Matutino' | 'Vespertino'> = {
    matutino: 'Matutino',
    vespertino: 'Vespertino'
  }

  return mapa[periodo.toLowerCase()] ?? 'Matutino'
}

export default {
  async listarTodos(): Promise<any[]> {
    const response = await api.get('/Aluno')
    return response.data
  },

  async buscarPorId(id: number): Promise<any> {
    const response = await api.get(`/Aluno/${id}`)
    return response.data
  },

  async buscarPorTurma(turmaId: number): Promise<any[]> {
    const response = await api.get(`/Aluno/turma/${turmaId}`)
    return response.data
  },

  async criar(aluno: any): Promise<any> {
    const dto: AlunoCreateDTO = {
      nome: aluno.nome,
      dataNascimento: aluno.dataNascimento,
      turmaId: aluno.turmaId ?? null,
      statusMatricula: mapearStatus(aluno.status),
      periodo: mapearPeriodo(aluno.periodo)
    }
    const response = await api.post('/Aluno', dto)
    return response.data
  },

  async atualizar(id: number, aluno: any): Promise<void> {
    const dto: AlunoUpdateDTO = {
      nome: aluno.nome,
      dataNascimento: aluno.dataNascimento,
      turmaId: aluno.turmaId ?? null,
      statusMatricula: mapearStatus(aluno.status),
      periodo: mapearPeriodo(aluno.periodo)
    }
    await api.put(`/Aluno/${id}`, dto)
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/Aluno/${id}`)
  }
}
