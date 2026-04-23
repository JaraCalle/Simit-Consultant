type Props = { estado: string }

export function StatusBadge({ estado }: Props) {
  const styles: Record<string, string> = {
    EXITOSO: 'bg-green-50 text-green-800 border-green-200',
    ERROR: 'bg-red-50 text-red-800 border-red-200',
    FORMATO_INVALIDO: 'bg-amber-50 text-amber-800 border-amber-200',
  }

  const cls = styles[estado] ?? 'bg-gray-50 text-gray-600 border-gray-200'

  return (
    <span className={`font-mono text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full border ${cls}`}>
      {estado.replace(/_/g, ' ')}
    </span>
  )
}