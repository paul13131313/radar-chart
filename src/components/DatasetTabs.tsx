import type { Dataset } from './RadarChart'

interface DatasetTabsProps {
  datasets: Dataset[]
  activeDataset: number
  darkMode: boolean
  onActiveChange: (index: number) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

const DEFAULT_COLORS = ['#3b82f6', '#ef4444', '#22c55e']

export function getDefaultColor(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length]
}

export default function DatasetTabs({
  datasets,
  activeDataset,
  darkMode,
  onActiveChange,
  onAdd,
  onRemove,
}: DatasetTabsProps) {
  const textColor = darkMode ? '#fff' : '#000'
  const borderColor = darkMode ? '#444' : '#ccc'
  const activeBg = darkMode ? '#333' : '#e5e5e5'

  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {datasets.map((ds, i) => (
        <button
          key={i}
          onClick={() => onActiveChange(i)}
          className="flex items-center gap-1 px-3 py-1.5 border cursor-pointer transition-colors"
          style={{
            borderColor,
            background: activeDataset === i ? activeBg : 'transparent',
            color: textColor,
          }}
        >
          <span
            className="w-2.5 h-2.5 inline-block rounded-full"
            style={{ background: ds.color }}
          />
          {ds.name || `Data ${i + 1}`}
          {datasets.length > 1 && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                onRemove(i)
              }}
              className="ml-1 opacity-40 hover:opacity-100 cursor-pointer"
            >
              ×
            </span>
          )}
        </button>
      ))}
      {datasets.length < 3 && (
        <button
          onClick={onAdd}
          className="px-3 py-1.5 border cursor-pointer transition-colors"
          style={{ borderColor, color: textColor, background: 'transparent' }}
        >
          + ADD
        </button>
      )}
    </div>
  )
}
