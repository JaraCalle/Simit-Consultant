type Props = { label: string; value: string; danger?: boolean }

export function MetaField({ label, value, danger }: Props) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${danger ? 'text-red-700' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}