import { StatusBadge } from './StatusBadge'
import { MetaField } from './MetaField'
import { FineCard } from './FineCard'
import type { PlateResponseDTO } from '@/modules/consults/dto/consults.dto'

export function ResultCard({ resultado }: { resultado: PlateResponseDTO }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-start justify-between px-4 py-3.5 bg-gray-50 border-b border-gray-100">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            {resultado.tipoConsulta}
          </p>
          <p className="font-mono text-xl font-medium tracking-widest text-gray-900">
            {resultado.placa}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge estado={resultado.estado} />
          <span className="font-mono text-[10px] text-gray-400">
            {new Date(resultado.fechaConsulta).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-5 gap-y-3 mb-4">
          <MetaField label="Multas" value={String(resultado.cantidadMultas)} />
          {resultado.error && (
            <div className="col-span-2">
              <MetaField label="Detalle error" value={resultado.error} danger />
            </div>
          )}
        </div>

        {resultado.multas.length > 0 ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 pb-2 mb-2 border-t border-gray-100 pt-3">
              Multas · {resultado.multas.length}
            </p>
            <div className="space-y-2">
              {resultado.multas.map(m => <FineCard key={m.numero} multa={m} />)}
            </div>
          </div>
        ) : (
          <p className="font-mono text-xs text-gray-400 border-t border-gray-100 pt-3 mt-1">
            Sin multas registradas
          </p>
        )}
      </div>
    </div>
  )
}