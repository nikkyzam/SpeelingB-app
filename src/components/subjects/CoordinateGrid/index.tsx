import React from 'react'
import type { GridBounds, GridFigure } from '../../../services/subjects/types'
import './CoordinateGrid.css'

interface CoordinateGridProps {
  figure?: GridFigure
  /** Fixed bounds (plot questions). Otherwise the grid fits the figure, at least ±5. */
  bounds?: GridBounds
  /** Points the child has placed. */
  placed?: [number, number][]
  /** When set, every grid crossing is tappable and toggles a placed point. */
  onToggle?: (x: number, y: number) => void
}

const W = 280
const PAD = 18

const fitBounds = (figure?: GridFigure): GridBounds => {
  let m = 5
  const all = [...(figure?.points ?? []), ...(figure?.path ?? []), ...(figure?.polygon ?? [])]
  for (const [x, y] of all) m = Math.max(m, Math.abs(x), Math.abs(y))
  m = Math.ceil(m) + 1
  return { xMin: -m, xMax: m, yMin: -m, yMax: m }
}

const minus = (v: number) => String(v).replace('-', '−')

/** A coordinate plane: draws a figure, and optionally lets a child plot points on it. */
const CoordinateGrid: React.FC<CoordinateGridProps> = ({ figure, bounds, placed = [], onToggle }) => {
  const b = bounds ?? fitBounds(figure)
  const span = Math.max(b.xMax - b.xMin, b.yMax - b.yMin)
  const cell = W / span
  const X = (x: number) => (x - b.xMin) * cell
  const Y = (y: number) => (b.yMax - y) * cell
  const width = (b.xMax - b.xMin) * cell
  const height = (b.yMax - b.yMin) * cell
  const step = span > 18 ? 5 : span > 12 ? 2 : 1

  const xs: number[] = []
  for (let i = Math.ceil(b.xMin); i <= b.xMax; i++) xs.push(i)
  const ys: number[] = []
  for (let i = Math.ceil(b.yMin); i <= b.yMax; i++) ys.push(i)

  const pts = (list: [number, number][]) => list.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')
  const isPlaced = (x: number, y: number) => placed.some(([px, py]) => px === x && py === y)

  return (
    <svg
      className={`coord-grid${onToggle ? ' coord-grid-interactive' : ''}`}
      viewBox={`${-PAD} ${-PAD} ${width + 2 * PAD} ${height + 2 * PAD}`}
      role="img"
      aria-label={onToggle ? 'Coordinate grid — tap a crossing to place a point' : 'Coordinate grid'}
    >
      {xs.map((i) => (
        <line key={`v${i}`} className="cg-line" x1={X(i)} y1={0} x2={X(i)} y2={height} />
      ))}
      {ys.map((i) => (
        <line key={`h${i}`} className="cg-line" x1={0} y1={Y(i)} x2={width} y2={Y(i)} />
      ))}
      {b.yMin <= 0 && b.yMax >= 0 && <line className="cg-axis" x1={0} y1={Y(0)} x2={width} y2={Y(0)} />}
      {b.xMin <= 0 && b.xMax >= 0 && <line className="cg-axis" x1={X(0)} y1={0} x2={X(0)} y2={height} />}

      {figure?.polygon && <polygon className="cg-poly" points={pts(figure.polygon)} />}
      {figure?.path && <polyline className="cg-path" points={pts(figure.path)} />}

      {xs
        .filter((v) => v !== 0 && v % step === 0)
        .map((v) => (
          <text key={`tx${v}`} className="cg-tick" x={X(v)} y={Y(0) + 13} textAnchor="middle">
            {minus(v)}
          </text>
        ))}
      {ys
        .filter((v) => v !== 0 && v % step === 0)
        .map((v) => (
          <text key={`ty${v}`} className="cg-tick" x={X(0) - 5} y={Y(v) + 3.5} textAnchor="end">
            {minus(v)}
          </text>
        ))}

      {figure?.points?.map(([x, y, label], i) => {
        const left = X(x) > width - 64
        return (
          <g key={`p${i}`}>
            <circle className="cg-point" cx={X(x)} cy={Y(y)} r={4.6} />
            {label && (
              <text className="cg-label" x={X(x) + (left ? -9 : 9)} y={Y(y) - 7} textAnchor={left ? 'end' : 'start'}>
                {label}
              </text>
            )}
          </g>
        )
      })}

      {onToggle &&
        xs.flatMap((x) =>
          ys.map((y) => (
            <circle
              key={`t${x},${y}`}
              className={`cg-target${isPlaced(x, y) ? ' cg-target-on' : ''}`}
              cx={X(x)}
              cy={Y(y)}
              r={isPlaced(x, y) ? 6 : cell / 2.4}
              onClick={() => onToggle(x, y)}
              role="button"
              aria-label={`${isPlaced(x, y) ? 'Remove' : 'Place'} point (${minus(x)}, ${minus(y)})`}
            />
          ))
        )}
    </svg>
  )
}

export default CoordinateGrid
