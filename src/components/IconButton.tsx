import type { ButtonHTMLAttributes } from 'react'
import './IconButton.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export default function IconButton({ active, className, children, ...rest }: Props) {
  return (
    <button className={`icon-button${active ? ' icon-button--active' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </button>
  )
}
