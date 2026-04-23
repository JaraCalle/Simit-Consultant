import { StatusBadge } from '@/modules/consults/components/StatusBadge'
import { FineCard } from './FineCard'
import type { PlateResponseDTO } from '@/modules/consults/dto/consults.dto'

export function BulkAccordion({ r }: { r: PlateResponseDTO }) {
  return (
    <details className="border border-gray-100 rounded-lg overflow-hidden group">
      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none list-none bg-white hover:bg-gray-50 transition-colors">
        <span className="font-mono text-sm font-medium tracking-widest flex-1 text-gray-900">{r.placa}</span>
        <span className="font-mono text-[10px] text-gray-400 hidden sm:block">{r.tipoConsulta}</span>
        <span className="font-mono text-[11px] text-gray-500">{r.cantidadMultas} multa(s)</span>
        <StatusBadge estado={r.estado} />
        <span className="font-mono text-[10px] text-gray-400 transition-transform group-open:rotate-180">▼</span>
      </summary>

      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Fecha consulta</p>
            <p className="font-semibold text-gray-800 text-xs">
              {new Date(r.fechaConsulta).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          {r.error && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Error</p>
              <p className="font-semibold text-red-700 text-xs">{r.error}</p>
            </div>
          )}
        </div>
        {r.multas.length > 0
          ? <div className="space-y-2">{r.multas.map(m => <FineCard key={m.numero} multa={m} />)}</div>
          : <p className="font-mono text-xs text-gray-400">Sin multas registradas</p>
        }
      </div>
    </details>
  )
}