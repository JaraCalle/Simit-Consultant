type Props = { message: string }

export function ErrorBox({ message }: Props) {
  const [title, ...rest] = message.split('\n')

  return (
    <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3 mb-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-red-400 mb-2">Error</p>
      <p className="font-bold text-sm text-red-800 mb-2">{title}</p>
      <div className="space-y-1">
        {rest.map((line, i) => {
          const isPlaca = line.trim().startsWith('·')
          const isEmpty = line.trim() === ''
          if (isEmpty) return <div key={i} className="h-1" />
          return (
            <p key={i} className={
              isPlaca
                ? 'font-mono text-sm font-semibold text-red-900 bg-red-100 border border-red-200 rounded-md px-2.5 py-1 inline-block mr-1'
                : 'text-xs text-red-600 mt-1'
            }>
              {isPlaca ? line.trim().replace('· ', '') : line}
            </p>
          )
        })}
      </div>
    </div>
  )
}