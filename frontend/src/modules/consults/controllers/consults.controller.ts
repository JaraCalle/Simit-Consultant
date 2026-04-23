import { useState } from 'react'
import ConsultasService from '../services/consults.service'
import type {
  PlateResponseDTO,
  BulkResponseDTO,
} from '../dto/consults.dto'

export function useConsultaController() {
  const [resultado, setResultado] = useState<PlateResponseDTO | null>(null)
  const [historial, setHistorial] = useState<PlateResponseDTO[]>([])
  const [bulkResultado, setBulkResultado] = useState<BulkResponseDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function consultarPlaca(placa: string) {
    setLoading(true)
    setError(null)
    try {
      const data = await ConsultasService.consultarPlaca({ placa })
      setResultado(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  async function consultarBulk(placas: string[]) {
    setLoading(true)
    setError(null)
    try {
      const data = await ConsultasService.consultarBulk({ placas })
      setBulkResultado(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  async function cargarHistorial(skip = 0, limit = 100) {
    setLoading(true)
    setError(null)
    try {
      const data = await ConsultasService.getHistorial(skip, limit)
      setHistorial(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return {
    resultado,
    historial,
    bulkResultado,
    loading,
    error,
    consultarPlaca,
    consultarBulk,
    cargarHistorial,
  }
}
