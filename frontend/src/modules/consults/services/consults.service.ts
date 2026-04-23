import apiClient from '../../../lib/axios'
import axios from 'axios'
import type {
  PlateRequestDTO,
  PlateResponseDTO,
  BulkRequestDTO,
  BulkResponseDTO,
} from '../dto/consults.dto'

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data

    if (err.response?.status === 422 && Array.isArray(data?.detail)) {
      const msg = data.detail
        .map((d: { msg: string }) => d.msg.replace(/^Value error,\s*/i, '').trim())
        .join(' ')

      const matches = [...msg.matchAll(/'([^']+)' no es una placa válida/g)]

      if (matches.length > 0) {
        const placas = matches.map(m => m[1])
        return `Placas con formato inválido:\n${placas.map(p => `  · ${p}`).join('\n')}\n\nFormato esperado: 3 letras + 2 números + 1 alfanumérico opcional (ej: ABC12, ABC123)`
      }

      return msg
    }

    if (typeof data?.detail === 'string') return data.detail
  }

  return err instanceof Error ? err.message : 'Error desconocido'
}

const ConsultasService = {
  async consultarPlaca(body: PlateRequestDTO): Promise<PlateResponseDTO> {
    try {
      const { data } = await apiClient.post<PlateResponseDTO>('/consultas', body)
      return data
    } catch (err) {
      throw new Error(extractErrorMessage(err), { cause: err })
    }
  },

  async consultarBulk(body: BulkRequestDTO): Promise<BulkResponseDTO> {
    try {
      const { data } = await apiClient.post<BulkResponseDTO>('/consultas/bulk', body)
      return data
    } catch (err) {
      throw new Error(extractErrorMessage(err), { cause: err })
    }
  },

  async getHistorial(skip = 0, limit = 100): Promise<PlateResponseDTO[]> {
    try {
      const { data } = await apiClient.get<PlateResponseDTO[]>('/consultas', {
        params: { skip, limit },
      })
      return data
    } catch (err) {
      throw new Error(extractErrorMessage(err), { cause: err })
    }
  },
}

export default ConsultasService