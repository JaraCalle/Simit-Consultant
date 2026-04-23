export interface FinesResponseDTO {
  numero: string
  valor: number
  estado: string
  fecha: string
}

export interface PlateResponseDTO {
  placa: string
  tipoConsulta: string
  fechaConsulta: string
  estado: string
  cantidadMultas: number
  multas: FinesResponseDTO[]
  error: string | null
}

export interface BulkResponseDTO {
  total: number
  exitosas: number
  fallidas: number
  placas: PlateResponseDTO[]
}

export interface PlateRequestDTO {
  placa: string
}

export interface BulkRequestDTO {
  placas: string[]
}
