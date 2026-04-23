import { useEffect } from 'react'
import { useConsultaController } from '../controllers/consults.controller'

export default function HistoryPage() {
  const { historial, loading, error, cargarHistorial } = useConsultaController()

  useEffect(() => { cargarHistorial() }, [])

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Historial de consultas</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-3">
        {historial.map((c, i) => (
          <div key={i} className="border rounded p-4 flex justify-between">
            <span className="font-semibold">{c.placa}</span>
            <span>{c.tipoConsulta}</span>
            <span>{c.cantidadMultas} multa(s)</span>
            <span className={c.estado === 'EXITOSO' ? 'text-green-600' : 'text-red-500'}>
              {c.estado}
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}