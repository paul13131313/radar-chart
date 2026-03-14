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
    { name: 'Data 1', values: DEFAULT_VALUES, color: '#CEFF00' },
  ])
  const [activeDataset, setActiveDataset] = useState(0)
  const [chartDarkMode, setChartDarkMode] = useState(true)

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
    <div className="min-h-screen bg-[#010101] text-[#F1F1F1]">
      {/* Header */}
      <header className="max-w-[960px] mx-auto px-6 md:px-10 pt-[60px] pb-[20px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.04em] leading-none">
              RADAR
              <span className="text-[#CEFF00]">.</span>
              CHART
            </h1>
            <p className="text-[11px] tracking-[0.3em] text-[#666] mt-[16px] font-medium">
              MULTI-AXIS VISUALIZER
            </p>
          </div>
          <div className="text-[10px] tracking-[0.2em] text-[#444] font-medium">
            #87
          </div>
        </div>
        <div className="mt-[32px] h-px bg-[#1a1a1a]" />
      </header>

      {/* Presets */}
      <div className="max-w-[960px] mx-auto px-6 md:px-10 pt-[28px] pb-[48px]">
        <Presets onSelect={handlePresetSelect} />
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-3 px-6 md:px-10 pb-[80px] max-w-[960px] mx-auto">
        {/* Chart area */}
        <div className="flex-1 flex flex-col items-center gap-5">
          <div className="w-full bg-[#0a0a0a] rounded-[3px] p-4 border border-[#1a1a1a]">
            <RadarChart
              labels={labels}
              datasets={datasets}
              darkMode={chartDarkMode}
            />
          </div>
        </div>

        {/* Controls panel */}
        <div className="lg:w-[340px] flex flex-col gap-4 lg:self-end">
          <DatasetTabs
            datasets={datasets}
            activeDataset={activeDataset}
            onActiveChange={setActiveDataset}
            onAdd={handleAddDataset}
            onRemove={handleRemoveDataset}
          />
          <Controls
            labels={labels}
            datasets={datasets}
            activeDataset={activeDataset}
            chartDarkMode={chartDarkMode}
            onLabelsChange={setLabels}
            onDatasetChange={handleDatasetChange}
            onAxisCountChange={handleAxisCountChange}
            onChartDarkModeChange={setChartDarkMode}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-[10px] tracking-[0.3em] text-[#333] font-medium border-t border-[#1a1a1a]">
        RADAR CHART MAKER — AI STUDIO PAUL
      </footer>
    </div>
  )
}
