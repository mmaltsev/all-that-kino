import type { ReactNode } from 'react'
import './PillGroup.css'

interface PillOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface Props<T extends string> {
  options: PillOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function PillGroup<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`pill${opt.value === value ? ' pill--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
