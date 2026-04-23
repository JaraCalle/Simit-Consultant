import { useEffect } from 'react'
import { useConsultaController } from '../controllers/consults.controller'
import { StatusBadge } from '../components/StatusBadge'
import { FineCard } from '../components/FineCard'
import { ErrorBox } from '../components/ErrorBox'

const LIMIT = 10

function SkeletonRow() {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-28 bg-gray-100 rounded" />
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-14 bg-gray-100 rounded" />
            <div className="h-3.5 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-10.5H18a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 22.5H6A2.25 2.25 0 0 1 3.75 20.25V9.75A2.25 2.25 0 0 1 6 7.5h2.25m6.75-3H9A2.25 2.25 0 0 0 6.75 6.75v.75" />
        </svg>
      </div>
      <p className="font-bold text-gray-900 mb-1">Sin consultas registradas</p>
      <p className="text-sm font-medium text-gray-400">Las placas que consultes aparecerán aquí</p>
    </div>
  )
}

function Pagination({
  page,
  isLastPage,
  loading,
  onPrev,
  onNext,
}: {
  page: number
  isLastPage: boolean
  loading: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
      <button
        onClick={onPrev}
        disabled={page === 0 || loading}
        className="font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Anterior
      </button>

      <span className="font-mono text-[11px] text-gray-400 uppercase tracking-widest">
        Página <span className="text-gray-900 font-bold">{page + 1}</span>
      </span>

      <button
        onClick={onNext}
        disabled={isLastPage || loading}
        className="font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Siguiente →
      </button>
    </div>
  )
}

export default function HistoryPage() {
  const { historial, loading, error, page, cargarHistorial } = useConsultaController()

  const isLastPage = historial.length < LIMIT

  useEffect(() => { cargarHistorial(0) }, [])

  function handlePrev() {
    cargarHistorial((page - 1) * LIMIT)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNext() {
    cargarHistorial((page + 1) * LIMIT)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 pb-6 border-b border-gray-100">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Sistema de infracciones
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Historial de consultas</h1>
        </div>
        <button
          onClick={() => cargarHistorial(page * LIMIT)}
          disabled={loading}
          className="font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40"
        >
          {loading ? 'Actualizando...' : '↻ Actualizar'}
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {!loading && !error && historial.length === 0 && page === 0 && <EmptyState />}

      {!loading && historial.length > 0 && (
        <>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">
            {historial.length} registro(s) · página {page + 1}
          </p>

          <div className="space-y-3">
            {historial.map((c, i) => (
              <details
                key={`${c.placa}-${c.fechaConsulta}`}
                className="group border border-gray-100 rounded-2xl overflow-hidden"
                style={{ animation: `fadeUp 0.2s ease ${i * 0.04}s both` }}
              >
                <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none list-none hover:bg-gray-50 transition-colors">
                  <span className="font-mono text-base font-medium tracking-widest text-gray-900 flex-1">
                    {c.placa}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hidden sm:block">
                    {c.tipoConsulta}
                  </span>
                  <span className="font-bold text-sm text-gray-500">
                    {c.cantidadMultas} multa(s)
                  </span>
                  <StatusBadge estado={c.estado} />
                  <span className="font-mono text-[10px] text-gray-300 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>

                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Fecha consulta</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(c.fechaConsulta).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Tipo</p>
                      <p className="text-sm font-bold text-gray-900">{c.tipoConsulta}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Cantidad multas</p>
                      <p className="text-sm font-bold text-gray-900">{c.cantidadMultas}</p>
                    </div>
                    {c.error && (
                      <div className="col-span-2 sm:col-span-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Error</p>
                        <p className="text-sm font-semibold text-red-700">{c.error}</p>
                      </div>
                    )}
                  </div>

                  {c.multas && c.multas.length > 0 ? (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2 pt-2 border-t border-gray-200">
                        Multas · {c.multas.length}
                      </p>
                      <div className="space-y-2">
                        {c.multas.map(m => <FineCard key={m.numero} multa={m} />)}
                      </div>
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-gray-400 pt-2 border-t border-gray-200">
                      Sin multas registradas
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>

          <Pagination
            page={page}
            isLastPage={isLastPage}
            loading={loading}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  )
}