import type { Dataset } from './RadarChart'

interface ControlsProps {
  labels: string[]
  datasets: Dataset[]
  activeDataset: number
  darkMode: boolean
  onLabelsChange: (labels: string[]) => void
  onDatasetChange: (index: number, dataset: Dataset) => void
  onAxisCountChange: (count: number) => void
  onDarkModeChange: (dark: boolean) => void
}

const COLOR_SWATCHES = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#ffffff', // white
  '#000000', // black
]

export default function Controls({
  labels,
  datasets,
  activeDataset,
  darkMode,
  onLabelsChange,
  onDatasetChange,
  onAxisCountChange,
  onDarkModeChange,
}: ControlsProps) {
  const currentDataset = datasets[activeDataset]
  if (!currentDataset) return null

  const textColor = darkMode ? '#fff' : '#000'
  const borderColor = darkMode ? '#444' : '#ccc'
  const inputBg = darkMode ? '#222' : '#fff'
  const panelBg = darkMode ? '#1a1a1a' : '#fafafa'

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
    <div
      className="flex flex-col gap-4 p-4 font-mono text-xs"
      style={{ background: panelBg, color: textColor }}
    >
      {/* Axis count */}
      <div className="flex items-center gap-3">
        <span className="tracking-widest text-[10px] opacity-60">AXES</span>
        <button
          onClick={() => onAxisCountChange(Math.max(3, labels.length - 1))}
          className="w-7 h-7 border cursor-pointer flex items-center justify-center"
          style={{ borderColor, background: inputBg, color: textColor }}
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{labels.length}</span>
        <button
          onClick={() => onAxisCountChange(Math.min(8, labels.length + 1))}
          className="w-7 h-7 border cursor-pointer flex items-center justify-center"
          style={{ borderColor, background: inputBg, color: textColor }}
        >
          +
        </button>
      </div>

      {/* Background toggle */}
      <div className="flex items-center gap-3">
        <span className="tracking-widest text-[10px] opacity-60">BG</span>
        <button
          onClick={() => onDarkModeChange(false)}
          className="w-7 h-7 border cursor-pointer"
          style={{
            background: '#fff',
            borderColor: !darkMode ? '#000' : borderColor,
            borderWidth: !darkMode ? 2 : 1,
          }}
        />
        <button
          onClick={() => onDarkModeChange(true)}
          className="w-7 h-7 border cursor-pointer"
          style={{
            background: '#111',
            borderColor: darkMode ? '#fff' : borderColor,
            borderWidth: darkMode ? 2 : 1,
          }}
        />
      </div>

      {/* Dataset name */}
      <div className="flex items-center gap-3">
        <span className="tracking-widest text-[10px] opacity-60">NAME</span>
        <input
          type="text"
          value={currentDataset.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="flex-1 px-2 py-1 border font-mono text-xs outline-none"
          style={{ borderColor, background: inputBg, color: textColor }}
        />
      </div>

      {/* Color swatches */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="tracking-widest text-[10px] opacity-60">COLOR</span>
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c}
            onClick={() => handleColorChange(c)}
            className="w-6 h-6 border cursor-pointer rounded-none"
            style={{
              background: c,
              borderColor: currentDataset.color === c ? textColor : borderColor,
              borderWidth: currentDataset.color === c ? 2 : 1,
            }}
          />
        ))}
      </div>

      {/* Axis labels + values */}
      <div className="flex flex-col gap-2 mt-2">
        <span className="tracking-widest text-[10px] opacity-60">PARAMETERS</span>
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => handleLabelChange(i, e.target.value)}
              className="w-24 px-2 py-1 border font-mono text-xs outline-none"
              style={{ borderColor, background: inputBg, color: textColor }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={currentDataset.values[i] ?? 0}
              onChange={(e) => handleValueChange(i, Number(e.target.value))}
              className="flex-1 h-1 accent-current"
              style={{ accentColor: currentDataset.color }}
            />
            <input
              type="number"
              min={0}
              max={100}
              value={currentDataset.values[i] ?? 0}
              onChange={(e) => handleValueChange(i, Number(e.target.value))}
              className="w-12 px-1 py-1 border font-mono text-xs text-center outline-none"
              style={{ borderColor, background: inputBg, color: textColor }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
