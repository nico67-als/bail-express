'use client'

import { useId } from 'react'

export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  disabled?: boolean
}

export default function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled,
}: CheckboxProps) {
  const id = useId()

  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
      />
      <label htmlFor={id} className="text-sm">
        <span className="font-medium text-gray-900">{label}</span>
        {description && <span className="block text-gray-500">{description}</span>}
      </label>
    </div>
  )
}
