import type { Dataset } from './RadarChart'

interface ControlsProps {
  labels: string[]
  datasets: Dataset[]
  activeDataset: number
  chartDarkMode: boolean
  onLabelsChange: (labels: string[]) => void
  onDatasetChange: (index: number, dataset: Dataset) => void
  onAxisCountChange: (count: number) => void
  onChartDarkModeChange: (dark: boolean) => void
}

const COLOR_SWATCHES = [
  '#CEFF00', // neon yellow (accent)
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#F1F1F1', // white
]

export default function Controls({
  labels,
  datasets,
  activeDataset,
  chartDarkMode,
  onLabelsChange,
  onDatasetChange,
  onAxisCountChange,
  onChartDarkModeChange,
}: ControlsProps) {
  const currentDataset = datasets[activeDataset]
  if (!currentDataset) return null

  const handleLabelChange = (index: number, value: string) => {
    const newLabels = [...labels]
    newLabels[index] = value
    onLabelsChange(newLabels)
  }

  const handleValueChange = (index: number, value: number) => {
    const newValues = [...currentDataset.values]
    newValues[index] = Math.min(100, Math.max(0, value))
    onDatasetChange(activeDataset, { ...currentDataset, values: newValues })
  }

  const handleNameChange = (name: string) => {
    onDatasetChange(activeDataset, { ...currentDataset, name })
  }

  const handleColorChange = (color: string) => {
    onDatasetChange(activeDataset, { ...currentDataset, color })
  }

  return (
    <div className="flex flex-col gap-5 p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[3px]">

      {/* Section: Chart Settings */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] tracking-[0.3em] text-[#444] font-medium">CHART</span>

        {/* Axis count */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#666] w-14">Axes</span>
          <button
            onClick={() => onAxisCountChange(Math.max(3, labels.length - 1))}
            className="w-7 h-7 border border-[#222] bg-transparent text-[#888] hover:text-[#CEFF00] hover:border-[#CEFF00] cursor-pointer flex items-center justify-center text-sm transition-all duration-200 rounded-[2px]"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold text-[#F1F1F1]">{labels.length}</span>
          <button
            onClick={() => onAxisCountChange(Math.min(8, labels.length + 1))}
            className="w-7 h-7 border border-[#222] bg-transparent text-[#888] hover:text-[#CEFF00] hover:border-[#CEFF00] cursor-pointer flex items-center justify-center text-sm transition-all duration-200 rounded-[2px]"
          >
            +
          </button>
        </div>

        {/* Background toggle */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#666] w-14">BG</span>
          <button
            onClick={() => onChartDarkModeChange(true)}
            className={`w-7 h-7 bg-[#111] border rounded-[2px] cursor-pointer transition-all duration-200 ${
              chartDarkMode ? 'border-[#CEFF00]' : 'border-[#333]'
            }`}
          />
          <button
            onClick={() => onChartDarkModeChange(false)}
            className={`w-7 h-7 bg-[#fff] border rounded-[2px] cursor-pointer transition-all duration-200 ${
              !chartDarkMode ? 'border-[#CEFF00]' : 'border-[#333]'
            }`}
          />
        </div>
      </div>

      <div className="h-px bg-[#1a1a1a]" />

      {/* Section: Dataset */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] tracking-[0.3em] text-[#444] font-medium">DATASET</span>

        {/* Dataset name */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#666] w-14">Name</span>
          <input
            type="text"
            value={currentDataset.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-[#111] border border-[#222] text-[#F1F1F1] text-[12px] outline-none focus:border-[#CEFF00] transition-colors rounded-[2px]"
          />
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#666] w-14 shrink-0">Color</span>
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => handleColorChange(c)}
              className={`w-5 h-5 shrink-0 rounded-[2px] cursor-pointer transition-all duration-200 ${
                currentDataset.color === c
                  ? 'ring-1 ring-[#CEFF00] ring-offset-1 ring-offset-[#010101] scale-110'
                  : 'border border-[#222] hover:scale-110'
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-[#1a1a1a]" />

      {/* Section: Parameters */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] tracking-[0.3em] text-[#444] font-medium">PARAMETERS</span>
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => handleLabelChange(i, e.target.value)}
              className="w-20 px-2 py-1 bg-[#111] border border-[#222] text-[#999] text-[11px] outline-none focus:border-[#CEFF00] focus:text-[#F1F1F1] transition-colors rounded-[2px]"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={currentDataset.values[i] ?? 0}
              onChange={(e) => handleValueChange(i, Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={currentDataset.values[i] ?? 0}
              onChange={(e) => handleValueChange(i, Number(e.target.value))}
              className="w-11 px-1 py-1 bg-[#111] border border-[#222] text-[#CEFF00] text-[11px] text-center font-semibold outline-none focus:border-[#CEFF00] transition-colors rounded-[2px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
