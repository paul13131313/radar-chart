import { presets, type PresetData } from '../data/presets'

interface PresetsProps {
  onSelect: (preset: PresetData) => void
}

export default function Presets({ onSelect }: PresetsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {presets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onSelect(preset)}
          className="px-3 py-1.5 text-xs font-mono border border-[#ccc] bg-white hover:bg-[#f0f0f0] cursor-pointer transition-colors rounded-none"
        >
          {preset.emoji} {preset.name}
        </button>
      ))}
    </div>
  )
}
