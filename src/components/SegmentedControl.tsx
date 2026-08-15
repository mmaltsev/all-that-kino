import './SegmentedControl.css'

interface Props<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export default function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="segmented" role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={opt.value === value}
          className={`segmented__item${opt.value === value ? ' segmented__item--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
