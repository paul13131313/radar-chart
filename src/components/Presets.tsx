import { presets, type PresetData } from '../data/presets'

interface PresetsProps {
  onSelect: (preset: PresetData) => void
}

export default function Presets({ onSelect }: PresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onSelect(preset)}
          className="px-3 py-1.5 text-[11px] font-medium tracking-wide border border-[#222] bg-[#0a0a0a] text-[#888] hover:text-[#CEFF00] hover:border-[#CEFF00] cursor-pointer transition-all duration-200 rounded-[2px]"
        >
          {preset.emoji} {preset.name}
        </button>
      ))}
    </div>
  )
}
