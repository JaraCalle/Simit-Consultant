type Fine = { numero: string; estado: string; valor: number; fecha: string }

export function FineCard({ multa }: { multa: Fine }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border border-gray-100 rounded-md p-3 bg-white">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Número</p>
        <p className="font-mono text-xs text-gray-700 break-all">{multa.numero}</p>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Estado</p>
        <p className="text-sm font-semibold text-gray-900">{multa.estado}</p>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Valor</p>
        <p className="font-mono text-sm font-medium text-amber-800">
          {multa.valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}
        </p>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Infracción</p>
        <p className="font-mono text-xs text-gray-600">
          {new Date(multa.fecha).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
        </p>
      </div>
    </div>
  )
}