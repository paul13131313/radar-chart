import { useRef, useCallback } from 'react'

export interface Dataset {
  name: string
  values: number[]
  color: string
}

interface RadarChartProps {
  labels: string[]
  datasets: Dataset[]
  darkMode: boolean
}

export default function RadarChart({ labels, datasets, darkMode }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const size = 500
  const center = size / 2
  const radius = 190
  const axisCount = labels.length
  const levels = 5

  const bgColor = darkMode ? '#111111' : '#ffffff'
  const gridColor = darkMode ? '#333333' : '#e5e5e5'
  const textColor = darkMode ? '#999999' : '#666666'
  const titleColor = darkMode ? '#ffffff' : '#000000'

  const getPoint = useCallback((index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }, [axisCount, center, radius])

  const getLabelPoint = useCallback((index: number) => {
    const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2
    const r = radius + 28
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }, [axisCount, center, radius])

  // Grid polygons
  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const levelValue = ((level + 1) / levels) * 100
    const points = Array.from({ length: axisCount }, (_, i) => {
      const p = getPoint(i, levelValue)
      return `${p.x},${p.y}`
    }).join(' ')
    return points
  })

  // Axis lines
  const axisLines = Array.from({ length: axisCount }, (_, i) => {
    const p = getPoint(i, 100)
    return { x1: center, y1: center, x2: p.x, y2: p.y }
  })

  // Dataset polygons
  const datasetPolygons = datasets.map((dataset) => {
    const points = Array.from({ length: axisCount }, (_, i) => {
      const val = dataset.values[i] ?? 0
      const p = getPoint(i, Math.min(100, Math.max(0, val)))
      return `${p.x},${p.y}`
    }).join(' ')
    return { points, color: dataset.color }
  })

  const handleExportSVG = () => {
    if (!svgRef.current) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svgRef.current)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'radar-chart.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPNG = () => {
    if (!svgRef.current) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svgRef.current)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size * 2
      canvas.height = size * 2
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0, size, size)
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return
        const pngUrl = URL.createObjectURL(pngBlob)
        const a = document.createElement('a')
        a.href = pngUrl
        a.download = 'radar-chart.png'
        a.click()
        URL.revokeObjectURL(pngUrl)
      }, 'image/png')
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[500px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width={size} height={size} fill={bgColor} />

        {/* Grid */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke={gridColor}
            strokeWidth={i === levels - 1 ? 1.5 : 0.8}
          />
        ))}

        {/* Axes */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={gridColor}
            strokeWidth={0.8}
          />
        ))}

        {/* Data polygons */}
        {datasetPolygons.map((dp, i) => (
          <g key={`dataset-${i}`}>
            <polygon
              points={dp.points}
              fill={dp.color}
              fillOpacity={0.15}
              stroke={dp.color}
              strokeWidth={2}
            />
            {/* Data points */}
            {Array.from({ length: axisCount }, (_, j) => {
              const val = datasets[i].values[j] ?? 0
              const p = getPoint(j, Math.min(100, Math.max(0, val)))
              return (
                <circle
                  key={`point-${i}-${j}`}
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  fill={dp.color}
                  stroke={bgColor}
                  strokeWidth={1.5}
                />
              )
            })}
          </g>
        ))}

        {/* Labels */}
        {labels.map((label, i) => {
          const p = getLabelPoint(i)
          const angle = (Math.PI * 2 * i) / axisCount - Math.PI / 2
          const angleDeg = (angle * 180) / Math.PI
          let anchor: 'start' | 'middle' | 'end' = 'middle'
          if (angleDeg > -80 && angleDeg < 80) anchor = 'start'
          else if (angleDeg > 100 || angleDeg < -100) anchor = 'end'
          return (
            <text
              key={`label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor={anchor}
              dominantBaseline="central"
              fill={textColor}
              fontSize="11"
              fontFamily="'Courier New', monospace"
            >
              {label}
            </text>
          )
        })}

        {/* Legend */}
        {datasets.length > 1 && datasets.map((ds, i) => (
          <g key={`legend-${i}`}>
            <rect
              x={16}
              y={16 + i * 22}
              width={12}
              height={12}
              fill={ds.color}
              rx={2}
            />
            <text
              x={34}
              y={24 + i * 22}
              fill={titleColor}
              fontSize="11"
              fontFamily="'Courier New', monospace"
              dominantBaseline="central"
            >
              {ds.name}
            </text>
          </g>
        ))}
      </svg>

      <div className="flex gap-3">
        <button
          onClick={handleExportSVG}
          className="px-5 py-2 text-xs font-mono tracking-widest border cursor-pointer transition-colors"
          style={{
            borderColor: darkMode ? '#444' : '#ccc',
            color: darkMode ? '#fff' : '#000',
            background: darkMode ? '#222' : '#f5f5f5',
          }}
        >
          EXPORT SVG
        </button>
        <button
          onClick={handleExportPNG}
          className="px-5 py-2 text-xs font-mono tracking-widest border cursor-pointer transition-colors"
          style={{
            borderColor: darkMode ? '#444' : '#ccc',
            color: darkMode ? '#fff' : '#000',
            background: darkMode ? '#222' : '#f5f5f5',
          }}
        >
          EXPORT PNG
        </button>
      </div>
    </div>
  )
}
