import { useState, useCallback } from 'react'
import RadarChart, { type Dataset } from './components/RadarChart'
import Controls from './components/Controls'
import Presets from './components/Presets'
import DatasetTabs, { getDefaultColor } from './components/DatasetTabs'
import type { PresetData } from './data/presets'

const DEFAULT_LABELS = ['攻撃', '防御', '素早さ', '魔法', '運', '体力']
const DEFAULT_VALUES = [70, 60, 80, 50, 65, 75]

export default function App() {
  const [labels, setLabels] = useState<string[]>(DEFAULT_LABELS)
  const [datasets, setDatasets] = useState<Dataset[]>([
    { name: 'Data 1', values: DEFAULT_VALUES, color: '#3b82f6' },
  ])
  const [activeDataset, setActiveDataset] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  const bgColor = darkMode ? '#111111' : '#f5f0e8'
  const textColor = darkMode ? '#ffffff' : '#000000'
  const subColor = darkMode ? '#666666' : '#999999'

  const handlePresetSelect = useCallback((preset: PresetData) => {
    setLabels(preset.labels)
    setDatasets((prev) =>
      prev.map((ds, i) =>
        i === 0 ? { ...ds, values: preset.values, name: preset.name } : ds
      )
    )
  }, [])

  const handleAxisCountChange = useCallback((count: number) => {
    setLabels((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill('').map((_, i) => `Axis ${prev.length + i + 1}`)]
      }
      return prev.slice(0, count)
    })
    setDatasets((prev) =>
      prev.map((ds) => {
        if (count > ds.values.length) {
          return { ...ds, values: [...ds.values, ...Array(count - ds.values.length).fill(50)] }
        }
        return { ...ds, values: ds.values.slice(0, count) }
      })
    )
  }, [])

  const handleDatasetChange = useCallback((index: number, dataset: Dataset) => {
    setDatasets((prev) => prev.map((ds, i) => (i === index ? dataset : ds)))
  }, [])

  const handleAddDataset = useCallback(() => {
    setDatasets((prev) => {
      if (prev.length >= 3) return prev
      const newIndex = prev.length
      return [
        ...prev,
        {
          name: `Data ${newIndex + 1}`,
          values: Array(labels.length).fill(50),
          color: getDefaultColor(newIndex),
        },
      ]
    })
  }, [labels.length])

  const handleRemoveDataset = useCallback((index: number) => {
    setDatasets((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
    setActiveDataset((prev) => Math.min(prev, datasets.length - 2))
  }, [datasets.length])

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: bgColor, color: textColor }}
    >
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-baseline justify-between">
          <h1
            className="text-2xl font-mono font-bold tracking-[0.2em]"
            style={{ color: textColor }}
          >
            RADAR.CHART
          </h1>
          <span
            className="text-[10px] font-mono tracking-widest"
            style={{ color: subColor }}
          >
            MULTI-AXIS VISUALIZER
          </span>
        </div>
        <div className="mt-1 h-px" style={{ background: darkMode ? '#333' : '#ccc' }} />
      </header>

      {/* Presets */}
      <div className="px-6 py-3">
        <Presets onSelect={handlePresetSelect} />
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 px-6 pb-8">
        {/* Chart */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <RadarChart
            labels={labels}
            datasets={datasets}
            darkMode={darkMode}
          />
        </div>

        {/* Controls */}
        <div className="lg:w-[340px] flex flex-col gap-3">
          <DatasetTabs
            datasets={datasets}
            activeDataset={activeDataset}
            darkMode={darkMode}
            onActiveChange={setActiveDataset}
            onAdd={handleAddDataset}
            onRemove={handleRemoveDataset}
          />
          <Controls
            labels={labels}
            datasets={datasets}
            activeDataset={activeDataset}
            darkMode={darkMode}
            onLabelsChange={setLabels}
            onDatasetChange={handleDatasetChange}
            onAxisCountChange={handleAxisCountChange}
            onDarkModeChange={setDarkMode}
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-4 text-[10px] font-mono tracking-widest"
        style={{ color: subColor }}
      >
        RADAR CHART MAKER — AI STUDIO PAUL
      </footer>
    </div>
  )
}
