import { useState } from 'react'
import { useConsultaController } from '../controllers/consults.controller'

type Tab = 'individual' | 'bulk'

export default function ConsultaPage() {
  const [tab, setTab] = useState<Tab>('individual')

  // Individual
  const [placa, setPlaca] = useState('')

  // Bulk
  const [placasInput, setPlacasInput] = useState('')

  const { resultado, bulkResultado, loading, error, consultarPlaca, consultarBulk } =
    useConsultaController()

  function handleBulk() {
    const placas = placasInput
      .split(',')
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0)
    consultarBulk(placas)
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Consultar placas</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {(['individual', 'bulk'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'individual' ? 'Individual' : 'Masiva'}
          </button>
        ))}
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600 whitespace-pre-line">
          {error}
        </div>
      )}

      {/* ── TAB INDIVIDUAL ── */}
      {tab === 'individual' && (
        <>
          <div className="flex gap-2 mb-6">
            <input
              className="border rounded px-3 py-2 flex-1 uppercase"
              placeholder="ABC123"
              value={placa}
              onChange={e => setPlaca(e.target.value.toUpperCase())}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading || !placa}
              onClick={() => consultarPlaca(placa)}
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>

          {resultado && (
            <div className="border rounded p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Field label="Placa" value={resultado.placa} />
                <Field label="Tipo de consulta" value={resultado.tipoConsulta} />
                <Field
                  label="Fecha de consulta"
                  value={new Date(resultado.fechaConsulta).toLocaleString('es-CO', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                />
                <Field
                  label="Estado"
                  value={resultado.estado}
                  className={resultado.estado === 'EXITOSO' ? 'text-green-600' : 'text-red-500'}
                />
                <Field label="Cantidad de multas" value={String(resultado.cantidadMultas)} />
                {resultado.error && (
                  <div className="col-span-2">
                    <Field label="Error" value={resultado.error} className="text-red-500" />
                  </div>
                )}
              </div>

              {resultado.multas.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-gray-700">Multas</p>
                  {resultado.multas.map(m => (
                    <FineCard key={m.numero} multa={m} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── TAB BULK ── */}
      {tab === 'bulk' && (
        <>
          <div className="mb-2">
            <label className="text-sm text-gray-600 mb-1 block">
              Ingresa las placas separadas por coma
            </label>
            <textarea
              className="border rounded px-3 py-2 w-full uppercase resize-none"
              rows={3}
              placeholder="ABC123, QCK77G, XYZ987"
              value={placasInput}
              onChange={e => setPlacasInput(e.target.value.toUpperCase())}
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs text-gray-400">
              {placasInput
                .split(',')
                .map(p => p.trim())
                .filter(p => p.length > 0).length} placa(s) detectada(s)
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading || !placasInput.trim()}
              onClick={handleBulk}
            >
              {loading ? 'Consultando...' : 'Consultar todas'}
            </button>
          </div>

          {bulkResultado && (
            <div className="space-y-4">
              {/* Resumen */}
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="border rounded p-3">
                  <p className="text-gray-500">Total</p>
                  <p className="text-xl font-bold">{bulkResultado.total}</p>
                </div>
                <div className="border rounded p-3">
                  <p className="text-gray-500">Exitosas</p>
                  <p className="text-xl font-bold text-green-600">{bulkResultado.exitosas}</p>
                </div>
                <div className="border rounded p-3">
                  <p className="text-gray-500">Fallidas</p>
                  <p className="text-xl font-bold text-red-500">{bulkResultado.fallidas}</p>
                </div>
              </div>

              {/* Resultados por placa */}
              <div className="space-y-3">
                {bulkResultado.placas.map(r => (
                  <details key={r.placa} className="border rounded">
                    <summary className="flex justify-between items-center px-4 py-3 cursor-pointer select-none">
                      <span className="font-semibold">{r.placa}</span>
                      <span className="text-sm text-gray-500">{r.tipoConsulta}</span>
                      <span className="text-sm">{r.cantidadMultas} multa(s)</span>
                      <span className={`text-sm font-medium ${r.estado === 'EXITOSO' ? 'text-green-600' : 'text-red-500'}`}>
                        {r.estado}
                      </span>
                    </summary>
                    <div className="px-4 pb-4 space-y-2 border-t pt-3">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <Field
                          label="Fecha de consulta"
                          value={new Date(r.fechaConsulta).toLocaleString('es-CO', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        />
                        {r.error && <Field label="Error" value={r.error} className="text-red-500" />}
                      </div>
                      {r.multas.length > 0
                        ? r.multas.map(m => <FineCard key={m.numero} multa={m} />)
                        : <p className="text-sm text-gray-400">Sin multas registradas.</p>
                      }
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}

// ── Componentes internos ──

function Field({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className={`font-semibold text-sm ${className}`}>{value}</p>
    </div>
  )
}

function FineCard({ multa }: { multa: { numero: string; estado: string; valor: number; fecha: string } }) {
  return (
    <div className="bg-gray-50 rounded p-3 text-sm grid grid-cols-2 gap-1">
      <div>
        <p className="text-gray-500">Número</p>
        <p className="font-medium break-all">{multa.numero}</p>
      </div>
      <div>
        <p className="text-gray-500">Estado</p>
        <p className="font-medium">{multa.estado}</p>
      </div>
      <div>
        <p className="text-gray-500">Valor a pagar</p>
        <p className="font-medium">
          {multa.valor.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Fecha infracción</p>
        <p className="font-medium">
          {new Date(multa.fecha).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
        </p>
      </div>
    </div>
  )
}