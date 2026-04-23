import { useState } from 'react'
import { useConsultaController } from '@/modules/consults/controllers/consults.controller'
import { ErrorBox } from '@/modules/consults/components/ErrorBox'
import { SkeletonCard } from '@/modules/consults/components/SkeletonCard'
import { ResultCard } from '@/modules/consults/components/ResultCard'
import { BulkAccordion } from '@/modules/consults/components/BulkAccordion'

type Tab = 'individual' | 'bulk'

export default function ConsultaPage() {
  const [tab, setTab] = useState<Tab>('individual')
  const [placa, setPlaca] = useState('')
  const [placasInput, setPlacasInput] = useState('')

  const { resultado, bulkResultado, loading, error, consultarPlaca, consultarBulk } =
    useConsultaController()

  const bulkPlacas = placasInput
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0)

  function handleBulk() {
    consultarBulk(bulkPlacas.map(p => p.toUpperCase()))
  }

  return (
    <main className="p-8 max-w-2xl mx-auto font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 pb-6 border-b border-gray-100">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Sistema de infracciones
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Consulta de placas</h1>
        </div>
        <span className="font-mono text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full">
          SIMIT · CO
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-8">
        {(['individual', 'bulk'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[11px] uppercase tracking-widest px-5 py-2.5 border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t === 'individual' ? 'Individual' : 'Masiva'}
          </button>
        ))}
      </div>

      {error && <ErrorBox message={error} />}

      {/* Tab individual */}
      {tab === 'individual' && (
        <>
          <div className="flex gap-2 mb-6">
            <input
              className="flex-1 font-mono text-lg font-medium tracking-widest uppercase px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white placeholder:text-gray-300 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal transition-colors"
              placeholder="ABC 123"
              value={placa}
              maxLength={7}
              onChange={e => setPlaca(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && !loading && placa && consultarPlaca(placa)}
            />
            <button
              className="font-mono text-[11px] uppercase tracking-widest px-5 py-3 bg-gray-900 text-white rounded-lg disabled:opacity-30 hover:bg-gray-700 active:scale-95 transition-all whitespace-nowrap"
              disabled={loading || !placa}
              onClick={() => consultarPlaca(placa)}
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>

          {loading && <SkeletonCard />}
          {!loading && resultado && <ResultCard resultado={resultado} />}
        </>
      )}

      {/* Tab bulk */}
      {tab === 'bulk' && (
        <>
          <div className="mb-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">
              Placas separadas por coma
            </label>
            <textarea
              className="w-full font-mono text-sm uppercase tracking-widest px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 resize-none bg-white transition-colors leading-loose"
              rows={3}
              placeholder="ABC123, QCK77G, XYZ987"
              value={placasInput}
              onChange={e => setPlacasInput(e.target.value.toUpperCase())}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="font-mono text-[11px] text-gray-400">
              <span className="text-amber-700 font-medium">{bulkPlacas.length}</span> placa(s) detectada(s)
            </p>
            <button
              className="font-mono text-[11px] uppercase tracking-widest px-5 py-3 bg-gray-900 text-white rounded-lg disabled:opacity-30 hover:bg-gray-700 active:scale-95 transition-all"
              disabled={loading || !placasInput.trim()}
              onClick={handleBulk}
            >
              {loading ? 'Consultando...' : 'Consultar todas'}
            </button>
          </div>

          {loading && <SkeletonCard />}

          {!loading && bulkResultado && (
            <div className="space-y-4">
              {/* Resumen */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Total', value: bulkResultado.total, color: '' },
                  { label: 'Exitosas', value: bulkResultado.exitosas, color: 'text-green-700' },
                  { label: 'Fallidas', value: bulkResultado.fallidas, color: 'text-red-700' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className={`font-mono text-3xl font-medium ${color || 'text-gray-900'}`}>{value}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Acordeones */}
              <div className="space-y-2">
                {bulkResultado.placas.map(r => (
                  <BulkAccordion key={r.placa} r={r} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}