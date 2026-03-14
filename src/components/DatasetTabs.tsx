import type { Dataset } from './RadarChart'

interface DatasetTabsProps {
  datasets: Dataset[]
  activeDataset: number
  onActiveChange: (index: number) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

const DEFAULT_COLORS = ['#CEFF00', '#ef4444', '#3b82f6']

export function getDefaultColor(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length]
}

export default function DatasetTabs({
  datasets,
  activeDataset,
  onActiveChange,
  onAdd,
  onRemove,
}: DatasetTabsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {datasets.map((ds, i) => (
        <button
          key={i}
          onClick={() => onActiveChange(i)}
          className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium tracking-wide border rounded-[2px] cursor-pointer transition-all duration-200 ${
            activeDataset === i
              ? 'border-[#CEFF00] bg-[#CEFF00]/10 text-[#F1F1F1]'
              : 'border-[#222] bg-transparent text-[#666] hover:text-[#999]'
          }`}
        >
          <span
            className="w-2 h-2 inline-block rounded-[1px]"
            style={{ background: ds.color }}
          />
          {ds.name || `Data ${i + 1}`}
          {datasets.length > 1 && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                onRemove(i)
              }}
              className="ml-1 text-[#444] hover:text-[#CEFF00] cursor-pointer transition-colors"
            >
              ×
            </span>
          )}
        </button>
      ))}
      {datasets.length < 3 && (
        <button
          onClick={onAdd}
          className="px-3 py-2 text-[11px] font-medium tracking-wide border border-dashed border-[#333] text-[#444] hover:text-[#CEFF00] hover:border-[#CEFF00] cursor-pointer transition-all duration-200 rounded-[2px]"
        >
          + ADD
        </button>
      )}
    </div>
  )
}
